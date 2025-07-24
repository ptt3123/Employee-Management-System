from enum import Enum

class RequestType(str, Enum):
    ANNUAL = "ANNUAL"
    PAID = "PAID"
    UNPAID = "UNPAID"
    MATERNITY = "MATERNITY"
    PATERNITY = "PATERNITY"
    OTHER = "OTHER"