from sqlalchemy import Column
from sqlalchemy.orm import relationship
from sqlalchemy.types import String, Integer, Enum, DateTime
from sqlalchemy.sql import func

from entities.base import Base
from enums import EmployeeRole, EmployeeStatus

class Employee(Base):
    __tablename__ = "employee"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(25), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    status = Column(Enum(EmployeeStatus), nullable=False)
    role = Column(Enum(EmployeeRole), nullable=False)
    create_date = Column(DateTime, server_default=func.now())

    information = relationship(
        "EmployeeInformation", uselist=False, cascade="all, delete-orphan")

    salary = relationship("Salary", uselist=False, cascade="all, delete-orphan")

    balance = relationship(
        "Balance", uselist=False, cascade="all, delete-orphan")

    leave_requests = relationship(
        "LeaveRequest",
        foreign_keys="[LeaveRequest.employee_id]",
        cascade="all, delete"
    )

    approved_requests = relationship(
        "LeaveRequest",
        foreign_keys="[LeaveRequest.manager_id]",
        back_populates="manager"
    )

    day_time_keeping = relationship("DayTimekeeping", cascade="all, delete-orphan")

    month_time_keeping = relationship("MonthTimeKeeping", cascade="all, delete-orphan")
