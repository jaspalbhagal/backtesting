"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { BacktestForm } from "@/components/backtest/backtest-form"
import { SummaryCard } from "@/components/backtest/summary-card"
import { EquityChart } from "@/components/backtest/equity-chart"
import { AdvancedTradeTable } from "@/components/backtest/trade-history-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { backtestApi } from "@/lib/api"
import { posthog } from "@/lib/posthog"
import type { BacktestRequest, BacktestResult } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"

export default function BacktestPage() {
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { user, logout } = useAuth()
  const { toast } = useToast()

  const handleBacktest = async (data: BacktestRequest) => {
    if (!user) return

    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      // Track the backtest event
      posthog.capture("backtest_run", {
        ticker: data.ticker,
        start_date: data.start_date,
        end_date: data.end_date,
        user_email: user.email,
      })
      let result = {
      "ticker": data.ticker,
      "start_date": data.start_date,
      "end_date": data.end_date,
      "sma_period": data.sma_period,
      "initial_cash": data.initial_cash,
      "commission": data.commission,
      "rule": {
      "if_condition": data.if_condition,
      "then": data.then_action,
      "else_action": data.else_action
      }
      }
      const response = await backtestApi.runBacktest(result, user.access_token)
      setResult(response)

      toast({
        title: "Backtest completed!",
        description: `Analysis for ${data.ticker} is ready`,
      })
    } catch (error: any) {
      setError(error.message || "Failed to run backtest")
      toast({
        title: "Backtest failed",
        description: error.message || "An error occurred while running the backtest",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Stock Strategy Backtester</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Backtest Form */}
            <BacktestForm onSubmit={handleBacktest} isLoading={isLoading} />

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <SummaryCard
                    title="Total Return"
                    value={(`${result.total_return_pct} %`)}
                    className={result.total_return_pct >= 0 ? "border-green-200" : "border-red-200"}
                  />
                  <SummaryCard title="Win Rate" value={(result.win_rate)} />
                  <SummaryCard title="Total Trades" value={result.total_trades} />
                  <SummaryCard title="Winning Trades" value={result.winning_trades} className="border-green-200" />
                  <SummaryCard title="Losing Trades" value={result.losing_trades} className="border-red-200" />
                  <SummaryCard title="Total return" value={result.final_value - result.initial_cash} className="border-red-200" />
                </div>

                {/* Equity Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EquityChart data={result.equity_curve} />
                  </CardContent>
                </Card>

                {/* Trade History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trade History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.trade_history?.length > 0 ? (
                      <AdvancedTradeTable trades={result.trade_history} />
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No trades were executed during this backtest period.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
