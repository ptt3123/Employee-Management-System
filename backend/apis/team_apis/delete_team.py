from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse

from cruds.team_crud import delete_team_crud
from database import get_db

delete_team_router = APIRouter()

@delete_team_router.delete('/delete-team/{team_id}')
async def delete_team(team_id: int, db: AsyncSession = Depends(get_db)):
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