from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from cruds.salary_crud import update
from dependencies.get_admin_role import get_admin_role
from database import get_db
from schemas.salary import SalaryCreateForm

update_router = APIRouter()

@update_router.post("/update")
async def update_salary(
        form: SalaryCreateForm,
        infor=Depends(get_admin_role),
        db: AsyncSession = Depends(get_db)
):

    await update(form, db)

    return {"message": "success"}