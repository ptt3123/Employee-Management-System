from typing import Optional

from pydantic import BaseModel
from datetime import date

from enums import RequestType, RequestStatus


class LeaveRequestBase(BaseModel):

    class Config:
        from_attributes = True

class LeaveRequestCreate(LeaveRequestBase):

    start_date: date
    end_date: date
    type: Optional[RequestType]
    detail: str