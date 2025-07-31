from fastapi import APIRouter

from apis.team_apis.create_team import create_team_router
from apis.team_apis.delete_team import delete_team_router
from apis.team_apis.get_teams import get_teams_router
from apis.team_apis.update_team import update_team_router

team_router = APIRouter(prefix="/team", tags=["Team"])

team_router.include_router(get_teams_router)
team_router.include_router(create_team_router)
team_router.include_router(update_team_router)
team_router.include_router(delete_team_router)