from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request_crud import admin_get_leave_request_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from enums import EmployeeRole
from exceptions.exceptions import UnauthorizedException
from schemas.leave_requests_schemas.leave_request_schemas import AdminGetLeaveRequests
from schemas.token.InforFromToken import InforFromToken

admin_get_requests_router = APIRouter(prefix='/admin')

@admin_get_requests_router.get('/get-requests')
async def admin_get_requests(
        params: AdminGetLeaveRequests = Depends(),
        employee_infor: InforFromToken = Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):
    print(params)
    if employee_infor.employee_role == EmployeeRole.STAFF:
        raise UnauthorizedException

    leave_requests = await admin_get_leave_request_crud(
        params,
        db
    )

    return JSONResponse(
        status_code=200,
        content={
            'success': True,
            'message': 'Get leave requests successfully',
            'data': leave_requests
        }
    )
