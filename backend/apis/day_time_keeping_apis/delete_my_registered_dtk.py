from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.day_time_keeping_crud import delete_registered_schedule_next_week
from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import NoScheduleRegisteredException

delete_router = APIRouter()

@delete_router.delete("/delete_registered_schedule_next_week")
async def checkin_post(
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = int(infor.id)

        flag = await delete_registered_schedule_next_week(employee_id, db)
        if not flag:
            raise NoScheduleRegisteredException

        return {
            "success": True,
            "message": f"Registered schedule of employee {employee_id} has been removed."
        }

    except Exception as e:
        print(e)
        raise e