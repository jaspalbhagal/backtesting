from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    email:str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str