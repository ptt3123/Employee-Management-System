from sqlalchemy import Column, Integer, ForeignKey

from entities.base import Base

class DayTimekeepingBlackTag(Base):
    __tablename__ = "day_timekeeping_black_tag"

    day_timekeeping_id = Column(
        Integer, ForeignKey("day_timekeeping.id", ondelete="CASCADE"), primary_key=True)

    black_tag_id = Column(
        Integer, ForeignKey("black_tag.id", ondelete="CASCADE"), primary_key=True)
