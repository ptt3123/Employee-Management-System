import bcrypt

def verify_password(input_password, password):
    return bcrypt.checkpw(input_password.encode(), password.encode())