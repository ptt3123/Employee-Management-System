from sqlalchemy import Column, Integer, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship

from entities.base import Base

class DayTimekeeping(Base):
    __tablename__ = "day_timekeeping"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    checkin = Column(DateTime, nullable=True)
    checkout = Column(DateTime, nullable=True)

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), nullable=False)

    black_tags = relationship(
        "BlackTag",
        secondary="day_timekeeping_black_tag",
        lazy="select"
    )
