from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from exceptions.exceptions import HasRegisteredNextWeekException
from schemas.day_time_keeping_schemas.day_time_keeping_regis_form import DayTimeKeepingRegisForm
from cruds.day_time_keeping_crud import create_list, has_registered_next_week
from dependencies.get_infor_from_token import get_infor_from_token
from database import get_db

create_dtk_regis_form_router = APIRouter()

@create_dtk_regis_form_router.post("/create_dtk_regis_form")
async def create_dtk_regis_form(
        form: DayTimeKeepingRegisForm = Depends(),
        infor = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = int(infor.id)

        await create_list(employee_id, form, db)

        return {"message": "success"}

    except HasRegisteredNextWeekException as e:
        raise HTTPException(status_code=404, detail=e.message)

    except Exception as e:
        raise e