from datetime import date

from config import settings

from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.balance_crud import get_remaining_annual_leave_days_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from enums import EmployeeRole
from exceptions.exceptions import UnauthorizedException
from schemas.token.InforFromToken import InforFromToken

get_remaining_annual_leave_days_router = APIRouter()

@get_remaining_annual_leave_days_router.get('/remaining_annual_leave_days/{employee_id}')
async def get_remaining_annual_leave_days(
        employee_id: int,
        year: int = date.today().year,
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):
    if employee_infor.employee_role == EmployeeRole.STAFF and employee_id != employee_infor.id:
        raise UnauthorizedException

    balance = await get_remaining_annual_leave_days_crud(
        employee_id,
        year,
        db
    )

    if not balance:
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Get remaining annual leave days successfully.",
                "data": settings.remaining_annual_leave_days
            }
        )

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "message": "Get remaining annual leave days successfully.",
            "data": jsonable_encoder(balance)
        }
    )