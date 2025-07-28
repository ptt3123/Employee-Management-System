from starlette.requests import Request

from exceptions.exceptions import UnauthorizedException


async def verify_tk_infor(request: Request):
    client_ip = request.client.host

    office_ip_prefix = "192.168.30."
    if not client_ip.startswith(office_ip_prefix):
        raise UnauthorizedException
