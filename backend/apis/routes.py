from fastapi import APIRouter

from apis.employee_apis.router import employee_router

router = APIRouter()

router.include_router(employee_router)