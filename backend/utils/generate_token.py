from jose import jwt
from datetime import datetime, timedelta
from config import settings
from enums import EmployeeRole


def generate_access_token(
        employee_id:int,
        employee_role: EmployeeRole,
        employee_name: str
    ) -> str:
    try:
        payload = {
            'sub': str(employee_id),
            'role': employee_role.value,
            'name': employee_name,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        }
        access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return access_token
    except Exception as e:
        raise Exception(f"Error generating access token: {str(e)}")