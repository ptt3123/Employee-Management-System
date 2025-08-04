from fastapi import APIRouter
from fastapi.params import Depends
from starlette.responses import JSONResponse

from dependencies.get_admin_role import get_admin_role
from schemas.token.InforFromToken import InforFromToken

from config import settings

update_remaining_annual_leave_days_router = APIRouter(prefix="/admin")

@update_remaining_annual_leave_days_router.post("/update-remaining-annual-leave-days")
async def update_remaining_annual_leave_days(
        update_remaining_annual_days: int,
        employee_infor: InforFromToken = Depends(get_admin_role)
    ):

    settings.remaining_annual_leave_days = update_remaining_annual_days

    return JSONResponse(
        status_code=200,
        content={
            'success': True,
            'message': 'Updated remaining annual leave-days successfully',
            'data': {
                "new_remaining_annual_leave_days": settings.remaining_annual_leave_days,
            }
        }
    )