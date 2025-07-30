"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { TrendingUp, BarChart3, Target } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/backtest")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to /backtest
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Stock Strategy Backtester</h1>
            <div className="space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">Test Your Trading Strategies</h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Build, test, and optimize your rule-based trading strategies with historical data. Get detailed analytics
            and performance metrics to make informed trading decisions.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/signup">
                <Button size="lg" className="w-full">
                  Start Backtesting
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <CardTitle>Rule-Based Strategies</CardTitle>
                <CardDescription>
                  Create custom trading rules using technical indicators like SMA, price conditions, and more.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600" />
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Get comprehensive performance metrics including total return, win rate, and trade-by-trade analysis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-purple-600" />
                <CardTitle>Visual Results</CardTitle>
                <CardDescription>
                  Interactive charts showing portfolio performance, equity curves, and technical indicators over time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Ready to optimize your trading strategy?</h2>
              <p className="mt-4 text-lg text-gray-600">
                Join thousands of traders who use our platform to backtest and improve their strategies.
              </p>
              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg">Create Free Account</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
