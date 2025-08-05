from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.mtk_crud import get_mtk_history
from dependencies.get_admin_role import get_admin_role
from exceptions.exceptions import ObjectNotFoundException
from schemas.day_time_keeping_schemas.dtk_query_with_employee_id import DTKWithEmployeeId

read_employee_mtk_history_router = APIRouter()

@read_employee_mtk_history_router.get("/read_employee_mtk_history")
async def get_employee_dtk_history(
        form: DTKWithEmployeeId = Depends(),
        infor=Depends(get_admin_role),
        db: AsyncSession = Depends(get_db)
):
    try:
        result = await get_mtk_history(form.employee_id, form.year, form.month, db)

        if not result:
            raise ObjectNotFoundException("Month time keeping")

        return result

    except Exception as e:
        print(e)
        raise e