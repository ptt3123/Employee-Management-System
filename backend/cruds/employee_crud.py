from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from entities import Employee


async def get_employee_by_username(db:AsyncSession, username: str):
    try:
        stmt = select(
            Employee.id,
            Employee.username,
            Employee.password,
            Employee.name,
            Employee.email,
            Employee.phone_number,
            Employee.position
        ).where(Employee.username == username)

        result = await db.execute(stmt)
        employee = result.first()
        if not employee: return None
        return employee
    except Exception as e:
        print(e)
        raise e

async def get_employee_by_id (db:AsyncSession, employee_id: int):
    try:
        stmt = select(
            Employee.id,
            Employee.username,
            Employee.password,
            Employee.name,
            Employee.email,
            Employee.phone_number,
            Employee.position,
            Employee.role
        ).where(Employee.id == employee_id)

        result = await db.execute(stmt)
        employee = result.first()
        if not employee: return None
        return employee

    except Exception as e:
        print(e)
        raise e
