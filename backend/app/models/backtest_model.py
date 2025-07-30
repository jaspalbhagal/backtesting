from sqlalchemy import Column, Date, Float, Integer, String, Text, JSON , ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.database import Base

class BacktestRun(Base):
    __tablename__ = "backtest_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticker = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    sma_period = Column(Integer, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    if_condition = Column(Text, nullable=False)
    then_action = Column(String, nullable=False)
    else_action = Column(String, nullable=False)
    initial_cash = Column(Integer, nullable=False, default=10000)
    commission = Column(Float, nullable=False, default=0.001)
    final_value=Column(Integer, nullable=False)

    total_return_pct = Column(Float)
    win_rate = Column(Float)
    total_trades = Column(Integer)
    winning_trades = Column(Integer)
    losing_trades = Column(Integer)

    equity_curve = Column(JSON)       
    trade_history = Column(JSON)      
