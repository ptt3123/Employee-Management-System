from sqlalchemy import Column, Integer, ForeignKey
from entities.base import Base

class Balance(Base):
    __tablename__ = "balance"

    id = Column(Integer, primary_key=True, index=True)
    balance = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), nullable=False)

