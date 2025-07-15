from entities.base import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Team(Base):
    __tablename__ = "team"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(25), nullable=False, unique=True)
    detail = Column(String(255), nullable=True)

    employees = relationship("EmployeeInformation", back_populates="team")
