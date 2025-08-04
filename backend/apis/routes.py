from fastapi import APIRouter
from .salary_routes import router as salary_router

router = APIRouter()

# Include salary routes
router.include_router(salary_router)