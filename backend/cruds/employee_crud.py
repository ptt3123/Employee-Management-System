from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from entities import Employee
from schemas.employee_schemas.employee_schema import EmployeeCreate


async def get_current_employee(db: AsyncSession, field: str, value: str):
    try:
        column = getattr(Employee, field, None)
        if not column:
            raise ValueError(f"Field '{field}' không tồn tại trong bảng Employee")

        stmt = select(
            Employee.id,
            Employee.username,
            Employee.password,
            Employee.name,
            Employee.email,
            Employee.phone_number,
            Employee.position,
            Employee.role
        ).where(column.__eq__(value))

        result = await db.execute(stmt)
        employee = result.first()
        return employee if employee else None
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