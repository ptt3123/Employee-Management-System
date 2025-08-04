from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from entities import Balance
from config import settings
from exceptions.exceptions import DayRequestGreaterThanRemainingAnnualLeaveDays


async def get_remaining_annual_leave_days_crud(
        employee_id: int,
        year: int,
        db: AsyncSession
    ):

    stmt = select(
        Balance
    ).where(
        Balance.employee_id == employee_id,
        Balance.year == year,
    )

    result = await db.execute(stmt)
    balance = result.scalar_one_or_none()

    return balance

async def update_balance_crud(employee_id: int, year: int, quantity_date: int, db: AsyncSession):

    try:
        stmt = select(Balance).where(
            Balance.employee_id == employee_id,
            Balance.year == year,
        )

        balance = (await db.execute(stmt)).scalar_one_or_none()
        if not balance:
            remaining_annual_leave_days = settings.remaining_annual_leave_days
            if remaining_annual_leave_days < quantity_date:
                raise DayRequestGreaterThanRemainingAnnualLeaveDays
            new_balance = Balance(
                balance=remaining_annual_leave_days - quantity_date,
                year=year,
                employee_id=employee_id,
            )

            db.add(new_balance)
            await db.commit()
            await db.refresh(new_balance)
        else:
            remaining_annual_leave_days = balance.balance
            if remaining_annual_leave_days < quantity_date:
                raise DayRequestGreaterThanRemainingAnnualLeaveDays

            balance.balance = remaining_annual_leave_days - quantity_date

            await db.commit()
            await db.refresh(balance)

    except Exception as e:
        await db.rollback()
        raise e

