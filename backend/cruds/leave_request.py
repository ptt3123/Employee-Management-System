from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from entities import LeaveRequest
from enums import RequestStatus
from exceptions.exceptions import ObjectNotFoundException
from schemas.employee_schemas.get_employees import GetEmployees
from schemas.leave_requests_schemas.leave_request_schemas import LeaveRequestCreate


async def get_current_leave_request_crud(leave_request_id: int, db: AsyncSession):
    stmt = select(LeaveRequest).where(LeaveRequest.id == leave_request_id)
    result = await db.execute(stmt)
    leave_request = result.scalar_one_or_none()

    if leave_request is None:
        raise ObjectNotFoundException('Leave Request')

    return leave_request

async def get_leave_requests_crud(employee_id, db: AsyncSession):
    stmt = select(LeaveRequest).where(LeaveRequest.employee_id == employee_id)
    result = await db.execute(stmt)
    leave_requests = result.scalars().all()

    if leave_requests is None:
        raise ObjectNotFoundException('Leave Request')

    return leave_requests

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