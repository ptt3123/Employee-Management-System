from fastapi import APIRouter, Depends
from pyexpat.errors import messages
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request_crud import leave_request_update_status_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.leave_requests_schemas.leave_request_schemas import AdminProcessLeaveRequest
from schemas.token.InforFromToken import InforFromToken

admin_process_request_router = APIRouter(prefix="/admin")

@admin_process_request_router.put("/process-leave-request")
async def process_leave_request(
        process_data: AdminProcessLeaveRequest,
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):
    await leave_request_update_status_crud(
        process_data.id,
        employee_infor,
        process_data.status,
        db
    )

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "messages": "Process leave request done",
        }
    )
