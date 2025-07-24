from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from cruds.employee_crud import get_current_employee
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.token.InforFromToken import InforFromToken

employee_change_password = APIRouter()

@employee_change_password.post("/change-password")
async def employee_change_password(
        current_password: str,
        new_password: str,
        db: AsyncSession = Depends(get_db),
        employee_infor: InforFromToken = Depends(get_infor_from_token),
    ):
    current_employee = await get_current_employee(db, 'id', employee_infor.id)
