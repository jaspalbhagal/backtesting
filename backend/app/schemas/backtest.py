from pydantic import BaseModel
from typing import List,Optional
from uuid import UUID
from datetime import date

class RuleModel(BaseModel):
    if_condition: str = "price > sma" 
    then: str = "buy"
    else_action: str = "hold"

class BacktestRequest(BaseModel):
    ticker: str
    start_date: str
    end_date: str
    sma_period: int
    initial_cash: int = 10000
    commission: float=0.001
    rule: RuleModel

class EquityPoint(BaseModel):
    date: str
    value: float
    price: float
    sma: float

class TradeRecord(BaseModel):
    entry_date: str
    exit_date: str
    pnl: float
    pnl_pct: float
    status: str


class BacktestResponse(BaseModel):
    total_return_pct: float
    win_rate: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    final_value: int
    equity_curve: List[EquityPoint]
    trade_history: List[TradeRecord]


class BacktestResultSchema(BaseModel):
    id: UUID
    ticker: str
    start_date: date
    end_date: date
    sma_period: int
    if_condition: str
    then_action: str
    else_action: str
    initial_cash: int
    commission: float
    final_value: int

    total_return_pct: Optional[float]
    win_rate: Optional[float]
    total_trades: Optional[int]
    winning_trades: Optional[int]
    losing_trades: Optional[int]

    equity_curve: List[EquityPoint]
    trade_history: List[TradeRecord]

    class Config:
        orm_mode = True