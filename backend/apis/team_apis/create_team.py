from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.team_crud import create_team_crud
from database import get_db
from dependencies.get_admin_role import get_admin_role
from schemas.team_schemas.team_schema import CreateTeam

create_team_router = APIRouter()

@create_team_router.post('/create-team')
async def create_team(

        new_team: CreateTeam,
        db: AsyncSession = Depends(get_db),
        get_admin = Depends(get_admin_role),
    ):

    try:
        await create_team_crud(new_team, db)
        return JSONResponse(
            status_code=201,
            content={
                'success': True,
                'message': 'Team created successfully.',
            }
        )
    except Exception as e:
        raise e