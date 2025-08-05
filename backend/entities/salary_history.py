from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from entities.base import Base

class SalaryHistory(Base):
    __tablename__ = "salary_history"

    id = Column(Integer, primary_key=True, index=True)
    total = Column(Integer, nullable=False)
    create_date = Column(DateTime, server_default=func.now())
    confirm_date = Column(DateTime, nullable=True)

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), nullable=False)
