from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request import get_current_leave_request_crud
from database import get_db
from schemas.leave_requests_schemas.leave_request_schemas import LeaveRequestCreate

staff_get_request_router = APIRouter()

@staff_get_request_router.get('/get-request')
async def get_leave_request(
        leave_request_id: int,
        db: AsyncSession = Depends(get_db)
    ):

    leave_request = await get_current_leave_request_crud(leave_request_id, db)

    return JSONResponse(
        status_code=200,
        content={
            'success': True,
            'message': 'Get leave request successfully',
            'data': jsonable_encoder(leave_request)
        }
    )