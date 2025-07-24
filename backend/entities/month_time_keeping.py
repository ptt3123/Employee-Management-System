from sqlalchemy import Column, Integer, ForeignKey, Boolean

from entities.base import Base

class MonthTimeKeeping(Base):
    __tablename__ = "month_time_keeping"

    id = Column(Integer, primary_key=True)
    month = Column(Integer, nullable=False)
    working_hours = Column(Integer, nullable=False)
    working_days = Column(Integer, nullable=False)
    is_full_attendance = Column(Boolean, nullable=False)
    expected_working_days = Column(Integer, nullable=False)

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), nullable=False)
