
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UserCreate, UserInDB
from app.models.user import User
from app.core import security


async def signup(user_in: UserCreate, db: AsyncSession) -> Token:
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=security.hash_password(user_in.password),
        role=user_in.role,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    data = {
    "sub": str(user.id),
    "email": user.email,
    "role": user.role.value if hasattr(user.role, "value") else user.role,
    }
    token = security.create_access_token(data)
    return Token(access_token=f'Bearer {token}',email=user.email)


async def login(login: LoginRequest, db: AsyncSession) -> Token:
    result = await db.execute(select(User).where(User.email == login.email))
    user = result.scalar_one_or_none()

    if not user or not security.verify_password(login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    data = {
    "sub": str(user.id),
    "email": user.email,
    "role": user.role.value if hasattr(user.role, "value") else user.role,
    }
    token = security.create_access_token(data)
    return Token(access_token=f'Bearer {token}', email=user.email)