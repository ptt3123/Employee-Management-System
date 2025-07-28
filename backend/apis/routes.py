from fastapi import APIRouter

from apis.employee_apis.router import employee_router
from apis.day_time_keeping_apis.router import dtk_router

router = APIRouter()

router.include_router(employee_router)
router.include_router(dtk_router)