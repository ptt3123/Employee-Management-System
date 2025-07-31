from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request_crud import leave_request_update_status_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from enums import RequestStatus
from schemas.token.InforFromToken import InforFromToken

send_request_router = APIRouter(prefix="/staff")

@send_request_router.put('/send-request')
async def send_request(
        leave_request_id: int,
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):

    await leave_request_update_status_crud(
        leave_request_id, employee_infor, RequestStatus.PENDING, db
    )

    return JSONResponse(
        status_code=200,
        content={
            'success': True,
            'message': 'success',
        }
    )