from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from exceptions.exceptions import ObjectNotFoundException, HasRegisteredSalaryException
from schemas.salary import SalaryCreateForm
from cruds.salary_crud import create, read_by_employee_id
from dependencies.get_admin_role import get_admin_role
from database import get_db

create_router = APIRouter()

@create_router.post("/create")
async def create_salary(
        form: SalaryCreateForm,
        infor = Depends(get_admin_role),
        db: AsyncSession = Depends(get_db)
):
    try:
        employee_id = form.employee_id
        await read_by_employee_id(employee_id, db)

        raise HasRegisteredSalaryException()

    except ObjectNotFoundException as e:

        await create(form, db)
        return {"message": "success"}