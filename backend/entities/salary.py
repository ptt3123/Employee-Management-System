from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from entities.base import Base
from sqlalchemy.sql import func

class Salary(Base):
    __tablename__ = "salary"

    salary = Column(Integer, nullable=False)
    allowance = Column(Integer, nullable=False)
    reward = Column(Integer, nullable=False)
    create_date = Column(DateTime, server_default=func.now())
    update_date = Column(DateTime, nullable=True, server_onupdate=func.now())
    detail = Column(String(255), nullable=True)

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), primary_key=True)
