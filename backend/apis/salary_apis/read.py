from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from cruds.salary_crud import read_by_employee_id
from dependencies.get_infor_from_token import get_infor_from_token
from database import get_db

read_router = APIRouter()

@read_router.get("/read")
async def read_salary(
        infor=Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):
    employee_id = int(infor.id)

    result = await read_by_employee_id(employee_id, db)

    return result