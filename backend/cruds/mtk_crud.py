from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.future import select

from entities.month_time_keeping import MonthTimeKeeping
from exceptions.exceptions import *

async def get_mtk_history(
        employee_id: int, year: int, month: int, db: AsyncSession):

    try:
        # Filter by year and month
        data_query = select(MonthTimeKeeping).where(
            MonthTimeKeeping.employee_id == employee_id,
            MonthTimeKeeping.year == year,
            MonthTimeKeeping.month == month
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