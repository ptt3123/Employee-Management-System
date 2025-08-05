from fastapi import APIRouter

from apis.month_time_keeping_apis.read_my_mtk_history import read_my_mtk_history_router
from apis.month_time_keeping_apis.read_employee_mtk_history import read_employee_mtk_history_router

mtk_router = APIRouter(prefix="/mtk", tags=["Month_time_keeping"])

mtk_router.include_router(read_my_mtk_history_router)
mtk_router.include_router(read_employee_mtk_history_router)