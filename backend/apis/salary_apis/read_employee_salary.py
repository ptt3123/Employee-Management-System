from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from cruds.salary_crud import read_by_employee_id
from dependencies.get_admin_role import get_admin_role
from database import get_db

read_employee_router = APIRouter()

@read_employee_router.get("/read-employee")
async def read_employee_salary(
        infor=Depends(get_admin_role),
        employee_id: int = Query(...),
        db: AsyncSession = Depends(get_db)
):

    result = await read_by_employee_id(employee_id, db)

    return result