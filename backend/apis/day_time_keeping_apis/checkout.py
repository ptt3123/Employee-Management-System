from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_db
from cruds.day_time_keeping_crud import checkout, get_today_dtk
from dependencies.get_infor_from_token import get_infor_from_token
from dependencies.verify_tk_infor import verify_tk_infor
from exceptions.exceptions import NoScheduleRegisteredException, InvalidCheckoutException, \
    InvalidCheckinCheckoutException

checkout_router = APIRouter()

@checkout_router.post("/checkout")
async def checkout_post(
        check = Depends(verify_tk_infor),
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    try:
        current_time = datetime.now().time()
        if current_time.hour > 21 & current_time.minute > 15:
            raise InvalidCheckinCheckoutException

        employee_id = int(infor.id)

        entry = await get_today_dtk(employee_id, db)
        if entry is None:
            raise NoScheduleRegisteredException

        if entry.checkout:
            raise InvalidCheckinCheckoutException("checkout is already registered")

        if not entry.checkin:
            raise InvalidCheckoutException

        is_checkout_soon = current_time < entry.shift_end

        await checkout(entry.id, current_time, is_checkout_soon, db)

        if is_checkout_soon:
            message = f"You checkout soon at {current_time.strftime("%H:%M")}."
        else:
            message = f"You checkout successfully at {current_time.strftime("%H:%M")}."

        return {
            "success": True,
            "message": message
        }

    except Exception as e:
        print(e)
        raise e