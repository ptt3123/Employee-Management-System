from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.mtk_crud import get_mtk_history
from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import ObjectNotFoundException
from schemas.day_time_keeping_schemas.dtk_query import DTKQuery

read_my_mtk_history_router = APIRouter()

@read_my_mtk_history_router.get("/read_my_mtk_history")
async def get_my_dtk_history(
        form: DTKQuery = Depends(),
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = int(infor.id)

        result = await get_mtk_history(employee_id, form.year, form.month, db)

        if not result:
            raise ObjectNotFoundException("Month time keeping")

        return result

    except Exception as e:
        print(e)
        raise e