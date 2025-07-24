from typing import Optional

from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from enums import EmployeeStatus
from exceptions.exceptions import UnauthorizedException
from schemas.employee_schemas.get_employees import GetEmployees
from schemas.token.InforFromToken import InforFromToken

get_employees_router = APIRouter()

@get_employees_router.get('/get-employees')
async def get_employees(
        params_get_employees: GetEmployees,
        db: AsyncSession = Depends(get_db),
        employee_infor: InforFromToken = Depends(get_infor_from_token)
    ):

    try:
        employee_role = employee_infor.get('role')

        if employee_role == 'STAFF':
            raise UnauthorizedException
    except Exception as e:
        print(e)
        raise e