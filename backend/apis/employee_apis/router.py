from fastapi import APIRouter

from apis.employee_apis.admin_update_employee import admin_update_employee_router
from apis.employee_apis.create_employee import create_employee_router
from apis.employee_apis.employee_change_password import employee_change_password_router
from apis.employee_apis.get_employees import get_employees_router
from apis.employee_apis.login import login_router

employee_router = APIRouter(prefix="/employee", tags=["Employee"])

employee_router.include_router(get_employees_router)
employee_router.include_router(login_router)
employee_router.include_router(create_employee_router)
employee_router.include_router(employee_change_password_router)
employee_router.include_router(admin_update_employee_router)
