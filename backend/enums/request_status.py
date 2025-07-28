from enum import Enum

class RequestStatus(str, Enum):
    PENDING = "PENDING"
    WAITING = "WAITING"
    REJECTED = "REJECTED"
    APPROVED = "APPROVED"