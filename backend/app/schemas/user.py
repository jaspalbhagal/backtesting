from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models.enums import UserRole
from uuid import UUID

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.USER 

class UserInDB(UserBase):
    id: UUID
    role: UserRole
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True