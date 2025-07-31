from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from database import get_db
from dependencies.get_infor_from_token import get_infor_from_token
from schemas.team_schemas.team_schema import GetTeam
from schemas.token.InforFromToken import InforFromToken

from cruds.team_crud import get_teams_crud

get_teams_router = APIRouter()

@get_teams_router.get('/get-team')
async def get_teams(
        params_get_team: GetTeam = Depends(),
        db: AsyncSession = Depends(get_db),
        token_infor: InforFromToken =  Depends(get_infor_from_token)):
    try:
        teams = await get_teams_crud(params_get_team, db)
        return JSONResponse(
            status_code=200,
            content={
                'success': True,
                'message': 'Get Teams Success',
                'data': teams
            }
        )
    except Exception as e:
        print(e)
        raise e