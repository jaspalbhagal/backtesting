import backtrader as bt
from typing import Dict
class DynamicStrategy(bt.Strategy):
    params = (
        ('sma_period', 10),
        ('if_condition', 'price > sma'),
        ('then_action', 'buy'),
        ('else_action', 'hold'),
    )
    
    def __init__(self):
        # Initialize SMA
        self.sma = bt.indicators.SimpleMovingAverage(
            self.data.close, period=self.params.sma_period
        )
        
        # Track trades and equity
        self.trades_list = []
        self.equity_curve = []
        self.order_count = 0
        
        # Debug logging
        self.debug_log = []
        
    def next(self):
        # Skip if SMA not ready
        if len(self.data) < self.params.sma_period:
            return
            
        # Get current values
        price = self.data.close[0]
        sma = self.sma[0]
        current_date = self.data.datetime.date(0).isoformat()
        current_value = self.broker.getvalue()
        
        # Store equity curve data
        self.equity_curve.append({
            'date': current_date,
            'value': round(current_value, 2),
            'price': round(price, 2),
            'sma': round(sma, 2)
        })
        
        # Evaluate condition safely
        try:
            # Create safe evaluation context
            context = {
                'price': price,
                'sma': sma,
                'position_size': self.position.size
            }
            
            condition_result = self._evaluate_condition(
                self.params.if_condition, context
            )
            
            # Log for debugging
            self.debug_log.append(f"Date: {current_date}, Price: {price:.2f}, SMA: {sma:.2f}, Condition: {condition_result}, Position: {self.position.size}")
            
            # Execute actions based on condition
            if condition_result:
                self._execute_action(self.params.then_action)
            else:
                self._execute_action(self.params.else_action)
                
        except Exception as e:
            self.debug_log.append(f"Error on {current_date}: {str(e)}")
    
    def _evaluate_condition(self, condition_str: str, context: Dict) -> bool:
        """Safely evaluate condition string"""
        try:
            # Replace common terms
            safe_condition = condition_str.lower()
            safe_condition = safe_condition.replace('price', str(context['price']))
            safe_condition = safe_condition.replace('sma', str(context['sma']))
            
            # Simple parsing for basic conditions
            if '>' in safe_condition:
                left, right = safe_condition.split('>')
                return float(left.strip()) > float(right.strip())
            elif '<' in safe_condition:
                left, right = safe_condition.split('<')
                return float(left.strip()) < float(right.strip())
            elif '==' in safe_condition:
                left, right = safe_condition.split('==')
                return float(left.strip()) == float(right.strip())
            else:
                return False
                
        except Exception:
            return False
    
    def _execute_action(self, action: str):
        """Execute trading action"""
        action = action.lower().strip()
        
        if action == 'buy' and not self.position:
            self.buy()
            
        elif action == 'sell' and self.position:
            self.sell()
            
        elif action == 'exit' and self.position:
            self.close()
            
        # 'hold' does nothing
    
    def notify_order(self, order):
        if order.status == order.Completed:
            self.order_count += 1
            action = "BUY" if order.isbuy() else "SELL"
            self.debug_log.append(f"Order executed: {action} at ${order.executed.price:.2f}")
    
    def notify_trade(self, trade):
        if trade.isclosed:
            pnl = trade.pnlcomm
            pnl_pct = ((pnl*100) / trade.price) if trade.price else 0
            self.trades_list.append({
                'entry_date': trade.dtopen,
                'exit_date': trade.dtclose,
                'pnl': round(pnl, 2),
                'pnl_pct': round(pnl_pct, 2),
                'status': 'win' if pnl > 0 else 'loss'
            })