from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request_crud import update_request_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.leave_requests_schemas.leave_request_schemas import LeaveRequestUpdate
from schemas.token.InforFromToken import InforFromToken

update_request_router = APIRouter(prefix="/staff")

@update_request_router.put('/update-request')
async def update_request(
        request_update: LeaveRequestUpdate,
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):

    try:
        await update_request_crud(employee_infor.id, request_update, db)

        return JSONResponse(
            status_code=200,
            content={
                'success': True,
                'message': 'Request updated successfully'

            }
        )
    except Exception as e:
        raise e