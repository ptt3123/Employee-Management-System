from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.employee_crud import get_employees_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from exceptions.exceptions import UnauthorizedException
from schemas.employee_schemas.get_employees import GetEmployees
from schemas.token.InforFromToken import InforFromToken

get_employees_router = APIRouter()

@get_employees_router.get('/get-employees')
async def get_employees(
        params_get_employees: GetEmployees = Depends(),
        db: AsyncSession = Depends(get_db),
        employee_infor: InforFromToken = Depends(get_infor_from_token)
    ):

    try:
        employee_role = employee_infor.employee_role

        if employee_role == 'STAFF':
            raise UnauthorizedException

        employees = await get_employees_crud(db, params_get_employees)

        return JSONResponse(
            status_code=200,
            content= {
                "success": True,
                "message": "Get employees success",
                "data": employees
            }
        )
    except Exception as e:
        print(e)
        raise e