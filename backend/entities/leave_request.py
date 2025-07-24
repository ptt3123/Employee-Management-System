from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from entities.base import Base
from enums import RequestStatus, RequestType

class LeaveRequest(Base):
    __tablename__ = "leave_request"

    id = Column(Integer, primary_key=True, index=True)
    create_date = Column(Date, server_default=func.now())
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    type = Column(Enum(RequestType), nullable=False)
    detail = Column(String(255), nullable=True)
    status = Column(Enum(RequestStatus), nullable=False, server_default=RequestStatus.PENDING)
    update_date = Column(Date, nullable=True, server_onupdate=func.now())

    employee_id = Column(
        Integer, ForeignKey("employee.id", ondelete="CASCADE"), nullable=False)

    manager_id = Column(
        Integer, ForeignKey("employee.id", ondelete="SET NULL"), nullable=True)

    manager = relationship(
        "Employee", foreign_keys=[manager_id], back_populates="approved_requests")
