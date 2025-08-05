from datetime import date, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from entities import DayTimekeeping, MonthTimeKeeping, Salary, SalaryHistory
from database import SessionLocal
from config import settings

async def calculate_monthly_attendance():
    print("Calculating Monthly Attendance")
    today = date.today()
    first_day_this_month = date(today.year, today.month, 1)
    last_day_prev_month = first_day_this_month - timedelta(days=1)
    first_day_prev_month = date(last_day_prev_month.year, last_day_prev_month.month, 1)

    async with SessionLocal() as session:
        stmt = select(
            DayTimekeeping.employee_id,
            func.count(DayTimekeeping.date).label("working_days"),
            func.sum(
                func.extract('epoch', DayTimekeeping.checkout - DayTimekeeping.checkin) / 3600
            ).label("working_hours"),
            func.count(DayTimekeeping.is_checkin_late).filter(DayTimekeeping.is_checkin_late == True).label("checkin_late"),
            func.count(DayTimekeeping.is_checkout_early).filter(DayTimekeeping.is_checkout_early == True).label("checkout_early")
        ).where(
            DayTimekeeping.date >= first_day_prev_month,
            DayTimekeeping.date <= last_day_prev_month,
            DayTimekeeping.checkin.isnot(None),
            DayTimekeeping.checkout.isnot(None)
        ).group_by(DayTimekeeping.employee_id)

        result = await session.execute(stmt)
        rows = result.all()

        for row in rows:
            employee_id, working_days, working_hours, checkin_late, checkout_early = row
            is_full_attendance = working_days >= 22  # Adjust threshold as needed

            # Save monthly attendance summary
            record = MonthTimeKeeping(
                employee_id=employee_id,
                year=first_day_prev_month.year,
                month=first_day_prev_month.month,
                working_days=int(working_days),
                working_hours=int(working_hours),
                is_full_attendance=is_full_attendance,
                checkin_late=int(checkin_late),
                checkout_early=int(checkout_early)
            )
            session.add(record)

            # Fetch base salary info
            salary_stmt = select(Salary).where(Salary.employee_id == employee_id)
            salary_result = await session.execute(salary_stmt)
            salary_data = salary_result.scalar_one_or_none()

            if salary_data:
                penalty = (checkin_late + checkout_early) * settings.PENALTY_PER_VIOLATION
                bonus = 0

                if is_full_attendance:
                    bonus += settings.FULL_ATTENDANCE_BONUS

                if working_hours > settings.STANDARD_HOURS:
                    bonus += (working_hours - settings.STANDARD_HOURS) * settings.OVERTIME_RATE

                total_salary = salary_data.salary + salary_data.allowance + salary_data.reward + bonus - penalty

                # Save salary history
                salary_history = SalaryHistory(
                    employee_id=employee_id,
                    total=total_salary
                )
                session.add(salary_history)

        await session.commit()

async def calculate_employee_current_monthly_attendance(employee_id: int, db: AsyncSession):
    today = date.today()
    first_day_this_month = date(today.year, today.month, 1)

    stmt = select(
        DayTimekeeping.employee_id,
        func.count(DayTimekeeping.date).label("working_days"),
        func.sum(
            func.extract('epoch', DayTimekeeping.checkout - DayTimekeeping.checkin) / 3600
        ).label("working_hours"),
        func.count(DayTimekeeping.is_checkin_late).filter(DayTimekeeping.is_checkin_late == True).label("checkin_late"),
        func.count(DayTimekeeping.is_checkout_early).filter(DayTimekeeping.is_checkout_early == True).label(
            "checkout_early")
    ).where(
        DayTimekeeping.employee_id == employee_id,
        DayTimekeeping.date >= first_day_this_month,
        DayTimekeeping.date <= today,
        DayTimekeeping.checkin.isnot(None),
        DayTimekeeping.checkout.isnot(None)
    ).group_by(DayTimekeeping.employee_id)

    result = await db.execute(stmt)
    row = result.first()

    if row is None:
        return None

    return {
        "employee_id": row.employee_id,
        "working_days": row.working_days,
        "working_hours": round(row.working_hours, 1),
        "checkin_late": row.checkin_late,
        "checkout_early": row.checkout_early,
    }