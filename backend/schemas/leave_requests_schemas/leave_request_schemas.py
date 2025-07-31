from typing import Optional
from pydantic import BaseModel, model_validator
from datetime import date
from enums import RequestType, RequestStatus, EmployeeStatus, SortValue


class LeaveRequestBase(BaseModel):
    class Config:
        from_attributes = True


class LeaveRequestCreate(LeaveRequestBase):
    start_date: date
    end_date: date
    type: Optional[RequestType]
    detail: str

    @model_validator(mode='after')
    def validate_dates(self):
        if self.start_date <= date.today():
            raise ValueError('Start date must be after today')

        if self.end_date < self.start_date:
            raise ValueError('End date must be after start date')

        return self


class LeaveRequestUpdate(LeaveRequestBase):
    id: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    type: Optional[RequestType] = None
    detail: Optional[str] = None

    @model_validator(mode='after')
    def validate_dates(self):
        if self.start_date and not self.end_date:
            raise ValueError('Fill start date and end date')

        if not self.start_date and self.end_date:
            raise ValueError('Fill start date and end date')

        if self.start_date and self.start_date <= date.today():
            raise ValueError('Start date must be after today')

        if self.end_date and self.end_date < self.start_date:
            raise ValueError('End date must be after start date')

        return self

class AdminProcessLeaveRequest(BaseModel):
    id: int
    status: RequestStatus

class AdminGetLeaveRequests(BaseModel):
    name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    type: Optional[RequestType] = None
    leave_request_status: Optional[RequestStatus] = RequestStatus.PENDING
    sort_by: Optional[str] = start_date,
    sort_value: Optional[SortValue] = SortValue.DESC
    page: int = 1
    page_size: int = 10

    @model_validator(mode='after')
    def validate_status(self):
        if self.leave_request_status == RequestStatus.WAITING:
            raise ValueError('Leave request must be waiting')

        return self