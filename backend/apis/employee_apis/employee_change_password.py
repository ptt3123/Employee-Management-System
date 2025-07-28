from pydantic import constr

from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.employee_crud import get_current_employee, change_password
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import PasswordIncorrectException
from schemas.token.InforFromToken import InforFromToken
from utils.hash_password import hash_password
from utils.verify_password import verify_password

employee_change_password_router = APIRouter()

@employee_change_password_router.put("/change-password")
async def employee_change_password(
        current_password: str,
        new_password: constr(min_length=6, max_length=12),
        db: AsyncSession = Depends(get_db),
        employee_infor: InforFromToken = Depends(get_infor_from_token),
    ):
    current_employee = await get_current_employee(db, 'id', employee_infor.id)
    if not verify_password(current_password, current_employee.password):
        raise PasswordIncorrectException

    hashed_password = hash_password(new_password)

    await  change_password(db, employee_infor.id, hashed_password)
    return JSONResponse(
        status_code=200,
        content={
            'success': True,
            'message': 'Password changed successfully'
        }
    )
