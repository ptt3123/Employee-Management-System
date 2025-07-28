from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request import leave_request_create_crud
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.leave_requests_schemas.leave_request_schemas import LeaveRequestCreate
from schemas.token.InforFromToken import InforFromToken

create_request_router = APIRouter()

@create_request_router.post("/create-request")
async def create_request(
        request: LeaveRequestCreate,
        employee_infor: InforFromToken =  Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):

    try:
        await leave_request_create_crud(request, employee_infor.id, db)

        return JSONResponse(
            status_code=201,
            content={
                "success": True,
                "message": "add leave_request successfully",
            }
        )
    except Exception as e:
        print(e)
        raise e
