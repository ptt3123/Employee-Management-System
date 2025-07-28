from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.day_time_keeping_crud import get_dtk_history
from dependencies.get_admin_role import get_admin_role
from schemas.day_time_keeping_schemas.dtk_query_with_employee_id import DTKWithEmployeeId

get_employee_dtk_history_router = APIRouter()

@get_employee_dtk_history_router.get("/get_employee_dtk_history")
async def get_my_dtk_history(
        form: DTKWithEmployeeId = Depends(),
        infor=Depends(get_admin_role),
        db: AsyncSession = Depends(get_db)
):
    try:
        return await get_dtk_history(
            form.employee_id, form.page, form.page_size, form.start_date, form.end_date, db)

    except Exception as e:
        print(e)
        raise e