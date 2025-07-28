from pydantic import BaseModel, model_validator, conint
from datetime import date

class DTKQuery(BaseModel):
    start_date: date
    end_date: date
    page: conint(ge=0) = 1
    page_size: conint(ge=10, le=15) = 10

    @model_validator(mode='after')
    def validate_dates(self) -> 'DTKQuery':
        if self.start_date > self.end_date:
            raise ValueError("start_date must be earlier than or equal to end_date")
        return self
