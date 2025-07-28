from fastapi import APIRouter

from apis.employee_apis.router import employee_router
from apis.leave_request_apis.router import leave_request_router
from apis.team_apis.router import team_router

router = APIRouter()

router.include_router(employee_router)
router.include_router(team_router)
router.include_router(leave_request_router)