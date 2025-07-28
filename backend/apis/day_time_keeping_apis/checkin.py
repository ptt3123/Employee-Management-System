from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from cruds.day_time_keeping_crud import checkin, get_today_dtk
from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import NoScheduleRegisteredException, InvalidCheckinCheckoutException

checkin_router = APIRouter()

@checkin_router.post("/checkin")
async def checkin(
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        current_time = datetime.now().time()

        if current_time.hour < 7 & current_time.minute < 45:
            raise InvalidCheckinCheckoutException

        employee_id = int(infor.id)

        entry = await get_today_dtk(employee_id, db)
        if entry is None:
            raise NoScheduleRegisteredException()

        is_late = current_time > entry.shift_start

        await checkin(entry.id, current_time, is_late, db)

    except NoScheduleRegisteredException as e:
        print(e)
        raise HTTPException(status_code=404, detail=str(e))

    except Exception as e:
        print(e)
        raise e