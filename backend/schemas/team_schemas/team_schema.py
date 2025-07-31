from typing import Optional

from pydantic import BaseModel

class TeamBase(BaseModel):

    class Config:
        from_attributes = True

class CreateTeam(TeamBase):
    name: str
    detail: str

class GetTeam(TeamBase):
    name: Optional[str] = None
    page: int = 1
    page_size: int = 20
class UpdateTeam(TeamBase):
    id: int
    name: Optional[str] = None
    detail: Optional[str] = None