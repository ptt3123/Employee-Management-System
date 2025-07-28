from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_db
from cruds.day_time_keeping_crud import checkout, get_today_dtk
from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import NoScheduleRegisteredException, InvalidCheckoutException, \
    InvalidCheckinCheckoutException

checkout_router = APIRouter()

@checkout_router.post("/checkout")
async def checkout(
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        current_time = datetime.now()
        if current_time.hour > 21 & current_time.minute < 15:
            raise InvalidCheckinCheckoutException

        employee_id = int(infor.id)

        entry = await get_today_dtk(employee_id, db)
        if entry is None:
            raise NoScheduleRegisteredException

        is_checkout_soon = current_time < entry.shift_end

        if not entry.checkin:
            raise InvalidCheckoutException

        await checkout(entry.id, current_time, is_checkout_soon, db)

    except Exception as e:
        print(e)
        raise e