from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.employee_crud import employee_update_profile_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.employee_schemas.update_profile import UpdateProfile
from schemas.token.InforFromToken import InforFromToken

employee_update_profile_router = APIRouter()

@employee_update_profile_router.put("/update-profile")
async def update_profile(
        update_data: UpdateProfile,
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):

    await employee_update_profile_crud(update_data, employee_infor.id, db)

    return JSONResponse(status_code=200, content={'success': True, 'message': 'updated profile'})