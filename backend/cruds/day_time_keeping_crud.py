from sqlalchemy import update, func, extract
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import time, timedelta, datetime

from sqlalchemy.future import select
from sqlalchemy import delete

from entities.day_time_keeping import DayTimekeeping
from exceptions.exceptions import *
from schemas.day_time_keeping_schemas.day_time_keeping_regis_form import DayTimeKeepingRegisForm

async def create_list(employee_id: int, form: DayTimeKeepingRegisForm, db: AsyncSession) -> None:

    try:
        for dtk in form.regis_list:
            new_entry = DayTimekeeping(
                date=dtk.date,
                shift_start=dtk.shift_start,
                shift_end=dtk.shift_end,
                employee_id=employee_id,
            )
            db.add(new_entry)

        await db.commit()

    except IntegrityError as e:
        await db.rollback()
        print(e)
        raise EmployeeNotFoundException

    except SQLAlchemyError as e:
        await db.rollback()
        print(e)
        raise e

async def has_registered_schedule_next_week(employee_id: int, db: AsyncSession) -> bool:
    today = date.today()
    current_monday = today - timedelta(days=today.weekday())
    next_monday = current_monday + timedelta(days=7)
    next_sunday = next_monday + timedelta(days=6)

    query = select(DayTimekeeping).where(
        (DayTimekeeping.employee_id == employee_id) &
        (DayTimekeeping.date >= next_monday) &
        (DayTimekeeping.date <= next_sunday)
    )

    try:
        result = await db.execute(query)
        record = result.scalars().first()
        return record is not None

    except SQLAlchemyError as e:
        await db.rollback()
        print(e)
        raise e

async def checkin(
        dtk_id: int, current_time: time, is_late: bool, db: AsyncSession) -> None:

    try:
        # Update record
        stmt = (
            update(DayTimekeeping)
            .where(DayTimekeeping.id == dtk_id)
            .values(
                checkin=current_time,
                is_checkin_late=is_late
            )
        )
        await db.execute(stmt)
        await db.commit()

    except SQLAlchemyError as e:
        await db.rollback()
        print(f"Check-in error: {e}")
        raise e

async def checkout(
        dtk_id: int, current_time: time, is_checkout_soon: bool, db: AsyncSession) -> None:

    try:
        # Update record
        stmt = (
            update(DayTimekeeping)
            .where(DayTimekeeping.id == dtk_id)
            .values(
                checkout=current_time,
                is_checkout_early=is_checkout_soon
            )
        )
        await db.execute(stmt)
        await db.commit()

    except SQLAlchemyError as e:
        await db.rollback()
        print(f"Check-in error: {e}")
        raise e

async def get_today_dtk(employee_id: int, db: AsyncSession):
    today = datetime.now().date()

    try:
        # Find today's registered schedule
        query = select(DayTimekeeping).where(
            DayTimekeeping.employee_id == employee_id,
            DayTimekeeping.date == today
        )
        result = await db.execute(query)
        entry = result.scalars().first()

        return entry

    except IntegrityError as e:
        await db.rollback()
        raise EmployeeNotFoundException

    except SQLAlchemyError as e:
        await db.rollback()
        print(f"Check-in error: {e}")
        raise e

async def get_dtk_history(
        employee_id: int, year: int, month: int, db: AsyncSession):

    try:
        # Filter by year and month
        data_query = select(DayTimekeeping).where(
            DayTimekeeping.employee_id == employee_id,
            extract('year', DayTimekeeping.date) == year,
            extract('month', DayTimekeeping.date) == month
        )

        data_result = await db.execute(data_query)
        records = data_result.scalars().all()

        return records

    except IntegrityError as e:
        await db.rollback()
        raise EmployeeNotFoundException

    except SQLAlchemyError as e:
            await db.rollback()
            print(f"Check-in error: {e}")
            raise e

async def delete_registered_schedule_next_week(employee_id: int, db: AsyncSession) -> bool:
    today = date.today()
    current_monday = today - timedelta(days=today.weekday())
    next_monday = current_monday + timedelta(days=7)
    next_sunday = next_monday + timedelta(days=6)

    delete_query = delete(DayTimekeeping).where(
        (DayTimekeeping.employee_id == employee_id) &
        (DayTimekeeping.date >= next_monday) &
        (DayTimekeeping.date <= next_sunday)
    )

    try:
        result = await db.execute(delete_query)
        await db.commit()
        return result.rowcount > 0

    except SQLAlchemyError as e:
            await db.rollback()
            print(e)
            raise e