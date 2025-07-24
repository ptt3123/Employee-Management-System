from sqlalchemy import Column, Integer, DateTime, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship

from entities.base import Base

class DayTimekeeping(Base):
    __tablename__ = "day_timekeeping"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    shift_start = Column(DateTime, nullable=False)
    shift_end = Column(DateTime, nullable=False)
    checkin = Column(DateTime, nullable=True)
    checkout = Column(DateTime, nullable=True)
    is_checkin_late = Column(Boolean, nullable=True)
    is_checkout_early = Column(Boolean, nullable=True)
    is_enough_time = Column(Boolean, nullable=True)

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), nullable=False)