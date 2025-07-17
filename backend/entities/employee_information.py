from entities.base import Base
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship

from enums import EmployeePosition

class EmployeeInformation(Base):
    __tablename__ = "employee_information"

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), primary_key=True)

    name = Column(String(50), nullable=False)
    email = Column(String(50), unique=True, nullable=False)
    phone_number = Column(String(10), unique=True, nullable=False)
    address = Column(String(100), nullable=True)
    dob = Column(Date, nullable=True)
    position = Column(Enum(EmployeePosition), nullable=True)

    team_id = Column(
        Integer, ForeignKey("team.id", ondelete="CASCADE"), nullable=True )

    team = relationship("Team", back_populates="employees")