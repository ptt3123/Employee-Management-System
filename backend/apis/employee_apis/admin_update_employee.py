from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from cruds.employee_crud import update_employee_crud
from database import get_db
from dependencies.get_admin_role import get_admin_role
from schemas.employee_schemas.employee_schema import EmployeeUpdate
from schemas.token.InforFromToken import InforFromToken

admin_update_employee_router = APIRouter()

@admin_update_employee_router.put('/admin/update-employee/{employee_id}')
async def admin_update_employee(
        employee_id: int,
        update_employee_infor: EmployeeUpdate,
        employee_infor: InforFromToken = Depends(get_admin_role),
        db: AsyncSession = Depends(get_db)
    ):

    try:
        await update_employee_crud(db, employee_id, update_employee_infor)

        return {
            "success": True,
            "message": f"Employee {employee_id} has been updated."
        }
    except Exception as e:
        raise e