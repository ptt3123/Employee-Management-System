from fastapi import APIRouter

from apis.team_apis.create_team import create_team_router
from apis.team_apis.get_teams import get_teams_router

team_router = APIRouter(prefix="/team", tags=["Team"])

team_router.include_router(get_teams_router)
team_router.include_router(create_team_router)
