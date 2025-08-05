from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from entities import Salary
from exceptions.exceptions import EmployeeNotFoundException, ObjectNotFoundException
from schemas.salary import *

async def create(form: SalaryCreateForm, db: AsyncSession):

    try:
        new_salary = Salary(
            salary=form.salary,
            allowance=form.allowance,
            reward=form.reward,
            detail=form.detail,
            employee_id=form.employee_id,
        )

        db.add(new_salary)
        await db.commit()

    except IntegrityError as e:
        await db.rollback()
        print(e)
        raise EmployeeNotFoundException

async def read_by_employee_id(employee_id: int, db: AsyncSession):
    stmt = select(Salary).where(Salary.employee_id.__eq__(employee_id))
    result = await db.execute(stmt)
    salary_record = result.scalar_one_or_none()

    if not salary_record:
        raise ObjectNotFoundException(f"Salary record with Employee's ID {employee_id}")

    return salary_record

async def update(form: SalaryCreateForm, db: AsyncSession):
    try:
        salary_record = await read_by_employee_id(form.employee_id, db)

        # Update fields
        if form.salary:
            salary_record.salary = form.salary

        if form.allowance:
            salary_record.allowance = form.allowance

        if form.reward:
            salary_record.reward = form.reward

        if form.detail:
            salary_record.detail = form.detail

        await db.commit()

    except IntegrityError as e:
        await db.rollback()
        print(f"Integrity error: {e}")
        raise EmployeeNotFoundException()




