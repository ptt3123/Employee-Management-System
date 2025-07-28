from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.day_time_keeping_crud import get_dtk_history
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.day_time_keeping_schemas.dtk_query import DTKQuery

get_my_dtk_history_router = APIRouter()

@get_my_dtk_history_router.get("/get_my_dtk_history")
async def get_my_dtk_history(
        form: DTKQuery = Depends(),
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = int(infor.employee_id)

        return await get_dtk_history(
            employee_id, form.page, form.page_size, form.start_date, form.end_date, db)

    except Exception as e:
        print(e)
        raise e