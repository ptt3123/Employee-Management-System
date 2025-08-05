from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.salary_history_cruds import get_salary_history
from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import ObjectNotFoundException
from schemas.day_time_keeping_schemas.dtk_query import DTKQuery

read_my_salary_history_router = APIRouter()

@read_my_salary_history_router.get("/read-my-salary-history")
async def read_my_salary_history(
        form: DTKQuery = Depends(),
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = int(infor.id)

        result = await get_salary_history(employee_id, form.year, form.month, db)

        if not result:
            raise ObjectNotFoundException(f"Salary History of employee {employee_id}")

        return result

    except Exception as e:
        print(e)
        raise e