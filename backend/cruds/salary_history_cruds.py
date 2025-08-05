from sqlalchemy import extract
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from sqlalchemy.future import select

from entities.salary_history import SalaryHistory
from exceptions.exceptions import *

async def get_salary_history(
        employee_id: int, year: int, month: int, db: AsyncSession):

    try:
        # Filter by year and month
        data_query = select(SalaryHistory).where(
            SalaryHistory.employee_id == employee_id,
            extract('year', SalaryHistory.create_date) == year,
            extract('month', SalaryHistory.create_date) == month + 1
        )

        data_result = await db.execute(data_query)
        record = data_result.scalars().first()

        return record

    except IntegrityError as e:
        await db.rollback()
        raise EmployeeNotFoundException

    except SQLAlchemyError as e:
        await db.rollback()
        print(f"Check-in error: {e}")
        raise e

async def update_confirm_date_of_current_salary_history(employee_id: int, db: AsyncSession):

    today = datetime.now()

    entry = await get_salary_history(employee_id, today.year, today.month - 1, db)
    if not entry:
        raise ObjectNotFoundException(f"Salary History of employee {employee_id}")

    try:
        entry.confirm_date = today
        await db.commit()

    except SQLAlchemyError as e:
        await db.rollback()
        print(f"Check-in error: {e}")
        raise e