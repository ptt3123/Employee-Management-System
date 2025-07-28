from fastapi import APIRouter

delete_team_router = APIRouter()

@delete_team_router.delete('/delete-team')
async def delete_team(team_id: int):
    try:
        await delete_team_crud(team_id)

        return {
            'success': True,
            'message': 'team deleted'
        }

    except Exception as e:
        print(e)
        raise e