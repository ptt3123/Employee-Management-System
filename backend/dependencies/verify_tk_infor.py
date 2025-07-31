from starlette.requests import Request

from exceptions.exceptions import UnauthorizedException


async def verify_tk_infor(request: Request):
    client_ip = request.client.host

    print(client_ip)

    office_ip_prefix = "192.168.30."
    if (not client_ip.startswith(office_ip_prefix)) & (not client_ip.startswith("127.0.0.1")):
        raise UnauthorizedException
