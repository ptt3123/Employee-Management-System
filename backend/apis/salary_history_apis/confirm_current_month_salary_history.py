from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.salary_history_cruds import update_confirm_date_of_current_salary_history
from dependencies.get_infor_from_token import get_infor_from_token

update_current_salary_history_router = APIRouter()

@update_current_salary_history_router.get("/confirm-my-current-salary-history")
async def read_employee_salary_history(
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = int(infor.id)

        await update_confirm_date_of_current_salary_history(employee_id, db)

        return {"message": "success"}

    except Exception as e:
        print(e)
        raise e