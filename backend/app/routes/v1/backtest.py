from fastapi import APIRouter, HTTPException, Depends
from app.services.backtest import run_backtest_endpoint
from app.schemas.backtest import BacktestRequest, BacktestResultSchema 
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.middleware.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=BacktestResultSchema)

async def backtest_endpoint(request: BacktestRequest,db: AsyncSession = Depends(get_db),user: User = Depends(get_current_user)):
    try:
        result = await run_backtest_endpoint(request,db,user)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
