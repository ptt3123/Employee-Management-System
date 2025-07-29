from pydantic import BaseModel, field_validator, ValidationInfo
from datetime import date, time

class DayTimeKeeping(BaseModel):
    date: date
    shift_start: time
    shift_end: time

    @field_validator('shift_start', 'shift_end')
    @classmethod
    def validate_shift_times(cls, v, info):
        # If v has tzinfo, remove it to make it offset-naive
        if v.tzinfo is not None:
            v = v.replace(tzinfo=None)

        field_name = info.field_name

        if field_name == 'shift_start':
            if v < time(7, 0):
                raise ValueError("Shift must start after 7:00 AM")

        elif field_name == 'shift_end':
            if v > time(21, 0):
                raise ValueError("Shift must end no later than 9:00 PM")

            shift_start = info.data.get('shift_start')
            if shift_start:
                if shift_start.tzinfo is not None:
                    shift_start = shift_start.replace(tzinfo=None)

                if v <= shift_start:
                    raise ValueError("Shift end time must be after shift start time")

        return v
