from sqlalchemy import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import String, Integer, Enum, DateTime, Date
from sqlalchemy.sql import func

from entities.base import Base
from enums import EmployeeRole, EmployeeStatus, EmployeePosition

class Employee(Base):
    __tablename__ = "employee"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(25), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    status = Column(Enum(EmployeeStatus), nullable=False)
    role = Column(Enum(EmployeeRole), nullable=False)
    create_date = Column(DateTime, server_default=func.now())
    update_date = Column(DateTime, nullable=True, onupdate=func.now())

    name = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    phone_number = Column(String(10), unique=True, nullable=False)
    address = Column(String(100), nullable=True)
    dob = Column(Date, nullable=True)
    position = Column(Enum(EmployeePosition), nullable=True)

    team_id = Column(
        Integer, ForeignKey("team.id", ondelete="SET NULL"), nullable=True)

    team = relationship("Team", back_populates="employees")

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
