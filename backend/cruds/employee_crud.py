from fastapi import HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from entities import Employee, Team, DayTimekeeping
from enums import SortValue
from exceptions.exceptions import InvalidPaginationException, EmployeeNotFoundException
from schemas.employee_schemas.employee_schema import EmployeeCreate, EmployeeUpdate
from schemas.employee_schemas.get_employees import GetEmployees
from datetime import date

from schemas.employee_schemas.get_employees_respone import EmployeesResponse


async def get_current_employee(db: AsyncSession, field: str, value):
    try:
        column = getattr(Employee, field, None)
        if not column:
            raise ValueError(f"Field '{field}' không tồn tại trong bảng Employee")

        stmt = select(Employee).where(column == value)
        result = await db.execute(stmt)
        employee = result.scalar_one_or_none()
        if employee is None: raise EmployeeNotFoundException
        return employee
    except Exception as e:
        print(e)
        raise e

async def create_employee_crud(
        db: AsyncSession,
        employee: EmployeeCreate,
        username: str,
        password: str,
    ):

    try:
        new_employee = Employee(
            username=username,
            password=password,
            name=employee.name,
            email=str(employee.email),
            phone_number=employee.phone_number,
            role=employee.role,
            status=employee.status,
            address=employee.address,
            dob=employee.dob
        )

        db.add(new_employee)
        await db.commit()
        await db.refresh(new_employee)
        return new_employee

    except Exception as e:
        await db.rollback()
        raise e

async def get_employees_crud(db: AsyncSession, params: GetEmployees):
    try:
        if params.page < 1 or params.page > 100:
            raise InvalidPaginationException

        skip = (params.page - 1) * params.page_size

        base_query = (
            select(
                Employee.id,
                Employee.team_id,
                Employee.name,
                Employee.email,
                Employee.phone_number,
                Employee.status,
                Employee.address,
                Employee.dob,
                Employee.position,
                Employee.username,
                Team.name.label('team_name'),
                DayTimekeeping.checkin.label('checkin'),
                DayTimekeeping.checkout.label('checkout')
            )
            .join(Team, Employee.team_id == Team.id, isouter=True)
            .join(
                DayTimekeeping,
                (DayTimekeeping.employee_id == Employee.id)
                & (DayTimekeeping.date == date.today()),
                isouter=True)
        )

        print(date.today())
        base_query = base_query.where(Employee.status == params.employee_status)
        if params.search_by and params.search_value:
            if hasattr(Employee, params.search_by):
                column_attr = getattr(Employee, params.search_by)
                base_query = base_query.where(column_attr.ilike(f'%{params.search_value}%'))
            else:
                raise HTTPException(status_code=400, detail=f"Invalid search_by field: {params.search_by}")

        if params.team_id:
            base_query = base_query.where(Employee.team_id == params.team_id)

        total_employees_query = select(func.count()).select_from(base_query.subquery())
        total_employees = (await db.execute(total_employees_query)).scalar()
        total_pages = (total_employees + params.page_size - 1) // params.page_size

        if hasattr(Employee, params.sort_by):
            sort_column = getattr(Employee, params.sort_by)
            if params.sort_value == SortValue.DESC:
                base_query = base_query.order_by(sort_column.desc())
            elif params.sort_value == SortValue.ASC:
                base_query = base_query.order_by(sort_column.asc())
            else:
                base_query = base_query.order_by(sort_column.desc())

        employees = (
            await db.execute(
                base_query.offset(skip).limit(params.page_size)
            )
        ).all()

        if not employees: raise EmployeeNotFoundException
        employees_response = []
        for row in employees:
            new_employee_response = EmployeesResponse(
                id=row.id,
                team_id=row.team_id,

            )
        print(base_query.compile(compile_kwargs={"literal_binds": True}))
        return {
            "current_page": params.page,
            "total_pages": total_pages,
            "total_employees": total_employees,
            "employees": employees_list
        }

    except Exception as e:
        print(e)
        raise e

async def change_password(db: AsyncSession, employee_id: int, new_password: str):
    try:
        result = await db.execute(
            select(Employee).where(Employee.id == employee_id)
        )

        employee = result.scalar_one_or_none()
        if not employee: raise EmployeeNotFoundException

        employee.password = new_password

        await db.commit()
        await db.refresh(employee)
    except Exception as e:
        await db.rollback()
        raise e

async def update_employee_crud(
        db: AsyncSession,
        employee_id: int,
        employee_update_infor: EmployeeUpdate
    ):

    try:
        update_employee = await get_current_employee(db, 'id', employee_id)
        if not update_employee: raise EmployeeNotFoundException

        for key, value in employee_update_infor.model_dump().items():
            if value:
                setattr(update_employee, key, value)

        await db.commit()
        await db.refresh(update_employee)

    except Exception as e:
        await db.rollback()
        raise e


