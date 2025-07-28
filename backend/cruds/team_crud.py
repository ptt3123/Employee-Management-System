from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from entities import Team
from schemas.team_schemas.team_schema import CreateTeam, GetTeam


async def create_team_crud(new_team: CreateTeam, db: AsyncSession):
    try:
        team = Team(
            name=new_team.name,
            detail=new_team.detail
        )

        db.add(team)
        await db.commit()
        await db.refresh(team)
    except Exception as e:
        await db.rollback()
        print(e)
        raise e

async def get_teams_crud(params: GetTeam, db: AsyncSession):
    try:
        skip = (params.page - 1) * params.page_size
        stmt = select(Team)
        if params.name:
            stmt = stmt.where(Team.name == params.name)

        total_team_query = select(func.count()).select_from(stmt.subquery())
        total_team = (await db.execute(total_team_query)).scalar()
        total_pages = (total_team + params.page_size - 1) // params.page_size

        result = await db.execute(stmt.offset(skip).limit(params.page_size))
        teams = result.scalars().all()
        return {
            'current_page': params.page,
            'total_pages': total_pages,
            'total_team': total_team,
            'teams': teams
        }
    except Exception as e:
        print(e)
        return []