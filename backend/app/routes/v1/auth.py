
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.auth import signup, login
from app.schemas.user import UserCreate, UserInDB
from app.schemas.auth import LoginRequest, Token
router = APIRouter()

@router.post("/signup", response_model=Token)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    return await signup(user_in, db)


@router.post("/login", response_model=Token)
async def login_user(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await login(login_data, db)