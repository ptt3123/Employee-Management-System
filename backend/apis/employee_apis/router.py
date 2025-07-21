from fastapi import APIRouter

from apis.employee_apis.create_employee import create_employee_router
from apis.employee_apis.login import login_router

employee_router = APIRouter(prefix="/employee", tags=["employee"])

employee_router.include_router(login_router)
employee_router.include_router(create_employee_router)
