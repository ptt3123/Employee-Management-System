from fastapi import APIRouter
from fastapi.params import Depends
from pyexpat.errors import messages
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.team_crud import update_team_crud
from database import get_db
from schemas.team_schemas.team_schema import UpdateTeam

update_team_router = APIRouter()

@update_team_router.put("/update-team")
async def update_team(
        team_data: UpdateTeam,
        db: AsyncSession = Depends(get_db)
    ):

    try:
        await update_team_crud(team_data, db)

        return JSONResponse(
            status_code=200,
            content={
                'success': True,
                'message': 'team was updated successfully'
            }
        )

    except Exception as e:
        print(e)
        raise e