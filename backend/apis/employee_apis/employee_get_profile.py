from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.employee_crud import get_current_employee
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.token.InforFromToken import InforFromToken

employee_get_profile_router = APIRouter()

@employee_get_profile_router.get('/get-profile')
async def get_profile(
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):

    profile = await get_current_employee(db, 'id', employee_infor.id)

    return JSONResponse(
        status_code=200,
        content={
            'success': True,
            'message': 'Get profile success',
            'data': jsonable_encoder(profile)
        }
    )