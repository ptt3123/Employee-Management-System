from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request_crud import leave_request_delete_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.token.InforFromToken import InforFromToken

delete_request_router = APIRouter(prefix="/staff")

@delete_request_router.delete("/delete-leave-request/{leave_request_id}")
async def delete_request(
        leave_request_id: int,
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):

    await leave_request_delete_crud(employee_infor.id, leave_request_id, db)

    return JSONResponse(
        status_code=200,
        content={
            'success': True,
            'message': f"Leave request with id {leave_request_id} deleted successfully."
        }
    )