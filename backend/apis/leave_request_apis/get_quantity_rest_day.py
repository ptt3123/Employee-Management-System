from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request_crud import get_quantity_rest_day_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from enums import EmployeeRole
from exceptions.exceptions import UnauthorizedException
from schemas.token.InforFromToken import InforFromToken

get_quantity_rest_day_router = APIRouter()

@get_quantity_rest_day_router.get('/get_quantity_rest_day')
async def get_quantity_rest_day(
        employee_id: int,
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db:AsyncSession = Depends(get_db)
    ):
    if employee_infor.employee_role == EmployeeRole.STAFF:
        if employee_infor.id != employee_id:
            raise UnauthorizedException

    result = await get_quantity_rest_day_crud(employee_id, db)

    return JSONResponse(
        status_code=200,
        content={
            'data': result
        }
    )
