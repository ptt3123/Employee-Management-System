from fastapi import HTTPException

from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from datetime import date, timedelta

from entities import LeaveRequest, Employee
from enums import RequestStatus, EmployeeRole, EmployeeStatus
from exceptions.exceptions import ObjectNotFoundException, RequestInProcessingException, InvalidPaginationException
from schemas.leave_requests_schemas.leave_request_schemas import LeaveRequestCreate, LeaveRequestUpdate, \
    AdminGetLeaveRequests
from schemas.token.InforFromToken import InforFromToken


async def get_current_leave_request_crud(leave_request_id: int, db: AsyncSession):
    stmt = select(LeaveRequest).where(LeaveRequest.id == leave_request_id)
    result = await db.execute(stmt)
    leave_request = result.scalar_one_or_none()

    if leave_request is None:
        raise ObjectNotFoundException('Leave Request')

    return leave_request

async def staff_get_leave_requests_crud(
        page: int,
        pages_size: int,
        employee_id,
        db: AsyncSession
    ):

    skip = (page - 1) * pages_size

    stmt = select(LeaveRequest).where(LeaveRequest.employee_id == employee_id)

    total_leave_requests = (await db.execute(
        select(func.count()).select_from(stmt.subquery())
    )).scalar()
    total_pages = (total_leave_requests + pages_size - 1) // pages_size

    result = await db.execute(stmt.offset(skip).limit(pages_size))
    leave_requests = result.scalars().all()

    if leave_requests is None:
        raise ObjectNotFoundException('Leave Request')

    return {
        'current_page': page,
        'total_pages': total_pages,
        'total_leave_requests': total_leave_requests,
        'leave_requests': jsonable_encoder(leave_requests)
    }

async def admin_get_leave_request_crud(
        params: AdminGetLeaveRequests,
        db: AsyncSession
    ):
    if params.page < 1 or params.page_size < 1:
        raise InvalidPaginationException

    stmt =select(
        LeaveRequest,
        Employee.name, Employee.email, Employee.phone_number, Employee.address, Employee.position
    ).join(
        Employee,
        (Employee.id == LeaveRequest.employee_id)
        & (Employee.status == EmployeeStatus.ACTIVE)
    ).where(LeaveRequest.status == params.leave_request_status)

    if params.name:
        stmt = stmt.where(
            Employee.name.ilike(f"%{params.name}%")
        )

    if params.start_date:
        stmt = stmt.where(LeaveRequest.start_date >= params.start_date)
    if params.end_date:
        stmt = stmt.where(LeaveRequest.end_date <= params.end_date)

    if params.type:
        stmt = stmt.where(
            LeaveRequest.type == params.type
        )

    total_leave_requests_query = select(func.count()).select_from(stmt.subquery())
    total_leave_requests = (await db.execute(total_leave_requests_query)).scalar()
    total_pages = (total_leave_requests + params.page_size - 1) // params.page_size

    skip = (params.page - 1) * params.page_size
    stmt = stmt.offset(skip).limit(params.page_size)

    result = await db.execute(stmt)
    leave_quests_result = result.all()

    leave_quests = []
    for request, name, email, phone_number, address, position in leave_quests_result:
        leave_quests.append(
            {
                **jsonable_encoder(request),
                "employee": {
                    "name": name,
                    "email": email,
                    "phone_number": phone_number,
                    "address": address,
                    "position": position
                }
            }
        )

    return {
        'total_leave_requests': total_leave_requests,
        'total_pages': total_pages,
        'current_page': params.page,
        'leave_requests': leave_quests
    }


async def get_quantity_rest_day_crud(
    employee_id: int,
    db: AsyncSession
):
    today = date.today()
    date_30_days_ago = today - timedelta(days=30)

    request_in_30_days_ago_query = (
        select(LeaveRequest)
        .where(
            LeaveRequest.employee_id == employee_id,
            LeaveRequest.end_date < today,
            LeaveRequest.end_date >= date_30_days_ago,
            LeaveRequest.status == RequestStatus.APPROVED
        )
    )
    result_30_days = await db.execute(request_in_30_days_ago_query)
    requests_in_30_days_ago = result_30_days.scalars().all()

    request_in_year_query = (
        select(LeaveRequest)
        .where(
            LeaveRequest.employee_id == employee_id,
            extract('year', LeaveRequest.end_date) == today.year,
            LeaveRequest.status == RequestStatus.APPROVED
        )
    )
    result_year = await db.execute(request_in_year_query)
    requests_in_year = result_year.scalars().all()

    total_rest_days_in_30_days_ago = 0
    for row in requests_in_30_days_ago:
        if row.start_date < date_30_days_ago:
            rest_day_quantity = (row.end_date - date_30_days_ago).days + 1
        else:
            rest_day_quantity = (row.end_date - row.start_date).days + 1
        total_rest_days_in_30_days_ago += rest_day_quantity

    total_rest_days_in_year = 0
    for row in requests_in_year:
        if row.start_date.year < today.year:
            rest_day_quantity = (row.end_date - date(today.year, 1, 1)).days + 1
        else:
            rest_day_quantity = (row.end_date - row.start_date).days + 1
        total_rest_days_in_year += rest_day_quantity

    return {
        'total_rest_days_in_30_days': total_rest_days_in_30_days_ago,
        'total_rest_days_in_year': total_rest_days_in_year
    }


async def leave_request_create_crud(request: LeaveRequestCreate,employee_id, db: AsyncSession):
    try:
        new_leave_request = LeaveRequest(
            start_date=request.start_date,
            end_date=request.end_date,
            employee_id=employee_id,
            type=request.type,
            status=RequestStatus.WAITING,
            detail=request.detail
        )

        db.add(new_leave_request)
        await db.commit()
        await db.refresh(new_leave_request)

    except Exception as e:
        await db.rollback()
        print(e)
        raise e


async def update_request_crud(
        employee_id: int,
        update_request: LeaveRequestUpdate,
        db: AsyncSession
    ):

    try:
        stmt = select(LeaveRequest).where(
            LeaveRequest.employee_id == employee_id,
             LeaveRequest.id == update_request.id
        )

        leave_request = (await db.execute(stmt)).scalar_one_or_none()
        if not leave_request:
            raise ObjectNotFoundException('Leave Request')

        if leave_request.status != RequestStatus.WAITING:
            raise RequestInProcessingException

        if update_request.start_date and update_request.end_date:
            leave_request.start_date = update_request.start_date
            leave_request.end_date = update_request.end_date

        if update_request.detail:
            leave_request.detail = update_request.detail

        await db.commit()
        await db.refresh(leave_request)

    except Exception as e:
        await db.rollback()
        raise e

async def leave_request_update_status_crud(
        request_id: int,
        employee_infor: InforFromToken,
        request_status: RequestStatus,
        db: AsyncSession
    ):
    try:
        if employee_infor.employee_role != EmployeeRole.STAFF:
            stmt = select(LeaveRequest).where(
                LeaveRequest.id == request_id,
            )
        else:
            stmt = select(LeaveRequest).where(
                LeaveRequest.employee_id == employee_infor.id,
                LeaveRequest.id == request_id
            )

        leave_request = (await db.execute(stmt)).scalar_one_or_none()
        if not leave_request:
            raise ObjectNotFoundException('Leave Request')

        leave_request.status = request_status
        if employee_infor.employee_role != EmployeeRole.STAFF:
            if request_status != RequestStatus.PENDING:
                raise HTTPException(status_code=403, detail='The request has been processed.')
            leave_request.manager_id = employee_infor.id

        await db.commit()
        await db.refresh(leave_request)

    except Exception as e:
        await db.rollback()
        raise e

async def leave_request_delete_crud(
        employee_id: int,
        leave_request_id,
        db: AsyncSession
    ):
    try:
        stmt = select(LeaveRequest).where(
            LeaveRequest.employee_id == employee_id,
            LeaveRequest.id == leave_request_id
        )

        leave_request = (await db.execute(stmt)).scalar_one_or_none()
        if not leave_request:
            raise ObjectNotFoundException('Leave Request')

        if leave_request.status != RequestStatus.WAITING:
            raise RequestInProcessingException

        await db.delete(leave_request)
        await db.commit()

    except Exception as e:
        await db.rollback()
        raise e
