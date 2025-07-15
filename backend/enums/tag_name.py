from enum import Enum

class TagName(str, Enum):
    LATE_CHECK_IN = "LATE_CHECK_IN"
    SOON_CHECK_OUT = "SOON_CHECK_OUT"
    LACK_WORKING_HOURS = "LACK_WORKING_HOURS"
    INVALID = "INVALID"