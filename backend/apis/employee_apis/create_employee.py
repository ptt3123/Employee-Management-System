from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.employee_crud import create_employee_crud
from database import get_db
from dependencies.get_admin_role import get_admin_role
from schemas.employee_schemas.employee_schema import EmployeeCreate
from schemas.token.InforFromToken import InforFromToken
from utils.check_exists_field import check_exists_field
from utils.generate_username import generate_username
from utils.hash_password import hash_password

create_employee_router = APIRouter()

@create_employee_router.post('/create-employee')
async def create_employee(
        new_employee: EmployeeCreate,
        db: AsyncSession = Depends(get_db),
        employee_infor: InforFromToken = Depends(get_admin_role),
    ):
    try:
        print(new_employee)
        await check_exists_field(
            db,
            new_employee.email,
            new_employee.phone_number
        )

        username = await generate_username(new_employee.name.strip(), db)
        password = hash_password('123456')

        await create_employee_crud(db, new_employee, username, password)
        return JSONResponse(status_code=201, content={
            'success': True,
            'message': 'add employee successfully'
        })
    except Exception as error:
        raise error