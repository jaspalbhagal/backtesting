export interface User {
  email: string
  access_token: string
}

export interface BacktestRequest {
  ticker: string
  start_date: string
  end_date: string
  sma_period: number
  if_condition: string
  then_action: "buy" | "sell"
  else_action: "hold" | "exit"
  initial_cash: number
  commission: number
}

export interface BacktestResult {
  total_return_pct: number
  win_rate: number
  total_trades: number
  winning_trades: number
  losing_trades: number
  initial_cash: number
  final_value: number
  equity_curve: Array<{
    date: string
    value: number
    price?: number
    sma?: number
  }>
  trade_history: Array<{
    entry_date: string
    exit_date: string
    pnl: number
    pnl_pct: number
    status: "win" | "loss"
  }>
}

export interface AuthResponse {
  access_token: string
  email: string
}
