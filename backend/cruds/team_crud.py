from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete

from entities import Team
from exceptions.exceptions import ObjectNotFoundException, InvalidPaginationException
from schemas.team_schemas.team_schema import CreateTeam, GetTeam, UpdateTeam


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
        if params.page < 1 or params.page > 100:
            raise InvalidPaginationException

        skip = (params.page - 1) * params.page_size
        stmt = select(Team)
        if params.name:
            stmt = stmt.where(Team.name.ilike(params.name))

        total_team_query = select(func.count()).select_from(stmt.subquery())
        total_team = (await db.execute(total_team_query)).scalar()
        total_pages = (total_team + params.page_size - 1) // params.page_size

        result = await db.execute(stmt.offset(skip).limit(params.page_size))
        teams = result.scalars().all()

        if not teams:
            raise ObjectNotFoundException('teams')
        return {
            'current_page': params.page,
            'total_pages': total_pages,
            'total_team': total_team,
            'teams': [jsonable_encoder(row) for row in teams]
        }
    except Exception as e:
        print(e)
        raise e

async def update_team_crud(params: UpdateTeam, db: AsyncSession):
    try:
        result = await db.execute(
            select(Team).where(Team.id == params.id)
        )
        team = result.scalar_one_or_none()

        if not team:
            raise ObjectNotFoundException('team')

        if params.name:
            team.name = params.name

        if params.detail:
            team.detail = params.detail

        await db.commit()


    except Exception as e:
        await db.rollback()
        raise e

async def delete_team_crud(team_id: int, db: AsyncSession):
    try:
        stmt = delete(Team).where(Team.id == team_id)
        await db.execute(stmt)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise e