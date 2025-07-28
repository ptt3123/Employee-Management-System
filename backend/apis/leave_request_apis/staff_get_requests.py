from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession

from schemas.leave_requests_schemas.leave_request_schemas import LeaveRequestCreate

staff_get_requests_router = APIRouter()

@staff_get_requests_router.get('/leave-requests')
async def get_leave_requests(request: LeaveRequestCreate, db: AsyncSession):
