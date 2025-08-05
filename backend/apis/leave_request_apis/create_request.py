from importlib.resources import contents

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.leave_request_crud import leave_request_create_crud, get_leave_request_period_of_date
from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.leave_requests_schemas.leave_request_schemas import LeaveRequestCreate
from schemas.token.InforFromToken import InforFromToken
from datetime import date

create_request_router = APIRouter()

@create_request_router.post("/create-request")
async def create_request(
        request: LeaveRequestCreate,
        employee_infor: InforFromToken =  Depends(get_infor_from_token),
        db: AsyncSession = Depends(get_db)
    ):

    try:
        leave_request = await get_leave_request_period_of_date(
            request.start_date,
            request.end_date,
            employee_infor.id,
            db
        )

        if leave_request:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "message": "Has request in period date"
                }
            )

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
