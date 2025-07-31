from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.team_crud import delete_team_crud
from database import get_db
from dependencies.get_admin_role import get_admin_role
from schemas.token.InforFromToken import InforFromToken

delete_team_router = APIRouter()

@delete_team_router.delete('/delete-team/{team_id}')
async def delete_team_controller(
        team_id: int,
        admin_role: InforFromToken = Depends(get_admin_role),
        db: AsyncSession = Depends(get_db)
    ):
    try:
        await delete_team_crud(team_id, db)

        return JSONResponse(
            status_code=200,
            content={
                'success': True,
                'message': 'team deleted'
            }
        )

    except Exception as e:
        print(e)
        raise e