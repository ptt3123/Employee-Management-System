from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.team_crud import update_team_crud
from database import get_db
from dependencies.get_admin_role import get_admin_role
from schemas.team_schemas.team_schema import UpdateTeam
from schemas.token.InforFromToken import InforFromToken

update_team_router = APIRouter()

@update_team_router.put("/update-team")
async def update_team(
        team_data: UpdateTeam,
        admin_role: InforFromToken= Depends(get_admin_role),
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