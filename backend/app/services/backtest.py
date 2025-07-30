# services/backtest.py
import asyncio
import backtrader as bt
from datetime import date
import yfinance as yf
import pandas as pd
from app.schemas.backtest import BacktestResponse, BacktestRequest
from fastapi import  HTTPException
from app.strategies.dynamic_strategy import DynamicStrategy
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.backtest_model import BacktestRun
from datetime import datetime, date
from app.models.user import User

def run_backtest_sync(request: BacktestRequest) -> BacktestResponse:
    """Run backtest with dynamic rules"""
    try:
        # Download data
        data = yf.download(
            request.ticker, 
            start=request.start_date, 
            end=request.end_date, 
            progress=False,
            auto_adjust=False
        )
        if data.empty:
            raise HTTPException(status_code=400, detail="No data found for ticker")
        
        # Handle MultiIndex columns
       
        data.columns = [col[0].lower() for col in data.columns]

        # Create data feed
        datafeed = bt.feeds.PandasData(
            dataname=data,
            datetime=None,
            open=0, high=1, low=2, close=3, volume=4, openinterest=-1
        )
        
        # Setup Cerebro
        cerebro = bt.Cerebro()
        cerebro.adddata(datafeed)
        cerebro.addstrategy(
            DynamicStrategy,
            sma_period=request.sma_period,
            if_condition=request.rule.if_condition,
            then_action=request.rule.then,
            else_action=request.rule.else_action
        )
        
        # Set initial cash and commission
        initial_cash = request.initial_cash
        cerebro.broker.setcash(initial_cash)
        cerebro.broker.setcommission(commission=request.commission)
        
        # Add analyzers
        cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name='trades')
        cerebro.addanalyzer(bt.analyzers.Returns, _name='returns')
        
        # Run backtest
        results = cerebro.run()
        strategy = results[0]
        
        # Extract results
        final_value = cerebro.broker.getvalue()
        total_return = ((final_value - initial_cash) / initial_cash) * 100
        
        # Get analyzer results
        trade_analyzer = strategy.analyzers.trades.get_analysis()
        total_trades = trade_analyzer.get('total', {}).get('closed', 0)
        winning_trades = trade_analyzer.get('won', {}).get('total', 0)
        losing_trades = trade_analyzer.get('lost', {}).get('total', 0)
        
        win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
        
        # Format trade history
        trade_history = []
        for trade in strategy.trades_list:
            trade_history.append({
                'entry_date': date.fromordinal(int(trade['entry_date'])).isoformat(),
                'exit_date': date.fromordinal(int(trade['exit_date'])).isoformat(),
                'pnl': trade['pnl'],
                'pnl_pct': trade['pnl_pct'],
                'status': trade['status']
            })
        return BacktestResponse(
            total_return_pct=round(total_return, 2),
            win_rate=round(win_rate, 2),
            total_trades=total_trades,
            winning_trades=winning_trades,
            losing_trades=losing_trades,
            equity_curve=strategy.equity_curve,
            trade_history=trade_history,
            final_value=int(final_value)
            # final_value=final_value
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest failed: {str(e)}")


async def run_backtest_endpoint(payload: BacktestRequest, db: AsyncSession,user: User):
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, run_backtest_sync, payload)
        combined_data = {
        "ticker": payload.ticker,
        "start_date": datetime.strptime(payload.start_date, "%Y-%m-%d").date() if isinstance(payload.start_date, str) else payload.start_date,
        "end_date": datetime.strptime(payload.end_date, "%Y-%m-%d").date() if isinstance(payload.end_date, str) else payload.end_date,
        "sma_period": payload.sma_period,
        "if_condition": payload.rule.if_condition,
        "then_action": payload.rule.then,
        "else_action": payload.rule.else_action,
        "user_id" : user.id,
        "initial_cash": payload.initial_cash,
        "commission":payload.commission,
        **result.model_dump()
        }
        new_run = BacktestRun(**combined_data)
        db.add(new_run)
        await db.commit()
        return new_run
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"DB Error: {str(e)}")

    