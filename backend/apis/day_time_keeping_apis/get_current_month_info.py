from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.salary_management_crud import calculate_employee_current_monthly_attendance
from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import ObjectNotFoundException

get_current_month_info_router = APIRouter()

@get_current_month_info_router.get("/get-current-month-dtk-history")
async def get_current_month_info(
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = int(infor.id)

        result = await calculate_employee_current_monthly_attendance(employee_id, db)

        if not result:
            raise ObjectNotFoundException("Day time keeping")

        return result

    except Exception as e:
        print(e)
        raise e