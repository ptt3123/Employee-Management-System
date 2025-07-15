from sqlalchemy import Column, Integer, Enum

from entities.base import Base
from enums import TagName

class BlackTag(Base):
    __tablename__ = "black_tag"

    id = Column(Integer, primary_key=True)
    name = Column(Enum(TagName), nullable=False, unique=True)
