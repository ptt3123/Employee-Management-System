from sqlalchemy import Column, Integer, ForeignKey, Date, Boolean, Time

from entities.base import Base

class DayTimekeeping(Base):
    __tablename__ = "day_timekeeping"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    shift_start = Column(Time, nullable=False)
    shift_end = Column(Time, nullable=False)
    checkin = Column(Time, nullable=True)
    checkout = Column(Time, nullable=True)
    is_checkin_late = Column(Boolean, nullable=True)
    is_checkout_early = Column(Boolean, nullable=True)

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), nullable=False)