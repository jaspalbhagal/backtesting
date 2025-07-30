from fastapi import APIRouter
from app.routes.v1 import auth, backtest

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    auth.router, 
    prefix="/auth", 
    tags=["authentication"]
)

api_router.include_router(
    backtest.router, 
    prefix="/backtest", 
    tags=["/backtest"]
)