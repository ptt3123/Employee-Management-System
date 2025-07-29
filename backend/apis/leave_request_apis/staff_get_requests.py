from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request_crud import staff_get_leave_requests_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.token.InforFromToken import InforFromToken

staff_get_requests_router = APIRouter(prefix="/staff")

@staff_get_requests_router.get('/get-leave-requests')
async def get_leave_requests(
        page: int = 1,
        page_size: int = 10,
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
):

    try:
        leave_requests = await staff_get_leave_requests_crud(
            page,
            page_size,
            employee_infor.id,
            db
        )

        return JSONResponse(
            status_code=200,
            content={
                'data': leave_requests
            }
        )
    except Exception as e:
        raise e