from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from cruds.day_time_keeping_crud import has_registered_next_week
from dependencies.get_infor_from_token import get_infor_from_token
from database import get_db

check_if_registered_dtk_router = APIRouter()

@check_if_registered_dtk_router.get("/check_if_registered_dtk")
async def check_if_registered_next_week(
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = int(infor.id)

        if await has_registered_next_week(employee_id, db):
            return {"message": "True"}

        else:
            return {"message": "False"}

    except Exception as e:
        raise e