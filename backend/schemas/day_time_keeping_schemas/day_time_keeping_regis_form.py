from datetime import date, timedelta
from typing import List, Set

from pydantic import BaseModel, field_validator

from schemas.day_time_keeping_schemas.day_time_keeping import DayTimeKeeping

class DayTimeKeepingRegisForm(BaseModel):
    regis_list: List[DayTimeKeeping]

    @field_validator('regis_list')
    @classmethod
    def validate_regis_list(cls, v):

        # Ensure distinct dates
        dates_seen: Set[date] = set()
        for regis in v:
            if regis.date in dates_seen:
                raise ValueError(f"Duplicate date detected: {regis.date}")
            dates_seen.add(regis.date)

        # Ensure all dates are in NEXT week only
        today = date.today()
        current_monday = today - timedelta(days=today.weekday())  # start of this week
        next_monday = current_monday + timedelta(days=7)
        next_saturday = next_monday + timedelta(days=5)

        for regis in v:
            if not (next_monday <= regis.date <= next_saturday):
                raise ValueError(f"Only dates from next week (Mon–Sat) are allowed: {regis.date}")

        return v
