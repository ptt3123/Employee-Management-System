from fastapi import APIRouter

from apis.salary_apis.update import update_router
from apis.salary_apis.create import create_router
from apis.salary_apis.read import read_router
from apis.salary_apis.read_employee_salary import read_employee_router

salary_router = APIRouter(prefix="/salary", tags=["Salary"])

salary_router.include_router(update_router)
salary_router.include_router(create_router)
salary_router.include_router(read_router)
salary_router.include_router(read_employee_router)