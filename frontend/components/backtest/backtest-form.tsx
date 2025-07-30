"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputField } from "@/components/ui/input-field"
import { SelectField } from "@/components/ui/select-field"
import type { BacktestRequest } from "@/types"

interface BacktestFormProps {
  onSubmit: (data: BacktestRequest) => void
  isLoading: boolean
}

export function BacktestForm({ onSubmit, isLoading }: BacktestFormProps) {
  const [formData, setFormData] = useState<BacktestRequest>({
    ticker: "AAPL",
    start_date: "2023-01-01",
    end_date: "2024-01-01",
    sma_period: 20,
    if_condition: "price > sma",
    then_action: "buy",
    else_action: "hold",
    initial_cash: 10000,
    commission: 0.001,
  })

  const [errors, setErrors] = useState<Partial<BacktestRequest>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<BacktestRequest> = {}

    if (!formData.ticker.trim()) {
      newErrors.ticker = "Ticker is required"
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required"
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required"
    }

    if (formData.start_date && formData.end_date && formData.start_date >= formData.end_date) {
      newErrors.end_date = "End date must be after start date"
    }

    if (formData.sma_period <= 0) {
      newErrors.sma_period = "SMA period must be positive"
    }

    if (formData.initial_cash <= 0) {
      newErrors.initial_cash = "Initial cash must be positive"
    }

    if (formData.commission < 0) {
      newErrors.commission = "Commission cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const updateField = (field: keyof BacktestRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backtest Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="ticker"
              label="Ticker Symbol"
              value={formData.ticker}
              onChange={(value) => updateField("ticker", value.toUpperCase())}
              placeholder="e.g., AAPL"
              required
              error={errors.ticker}
            />

            <InputField
              id="sma_period"
              label="SMA Period"
              type="number"
              value={formData.sma_period.toString()}
              onChange={(value) => updateField("sma_period", Number.parseInt(value) || 0)}
              placeholder="20"
              required
              error={errors.sma_period?.toString()}
            />

            <InputField
              id="start_date"
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(value) => updateField("start_date", value)}
              required
              error={errors.start_date}
            />

            <InputField
              id="end_date"
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(value) => updateField("end_date", value)}
              required
              error={errors.end_date}
            />

            <InputField
              id="initial_cash"
              label="Initial Cash"
              type="number"
              value={formData.initial_cash.toString()}
              onChange={(value) => updateField("initial_cash", Number.parseFloat(value) || 0)}
              placeholder="10000"
              required
              error={errors.initial_cash?.toString()}
            />

            <InputField
              id="commission"
              label="Commission Rate"
              type="number"
              step="0.001"
              value={formData.commission.toString()}
              onChange={(value) => updateField("commission", Number.parseFloat(value) || 0)}
              placeholder="0.001"
              required
              error={errors.commission?.toString()}
            />
          </div>

          <div className="space-y-4">
            <InputField
              id="if_condition"
              label="If Condition"
              value={formData.if_condition}
              onChange={(value) => updateField("if_condition", value)}
              placeholder="e.g., price > sma"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                id="then_action"
                label="Then Action"
                value={formData.then_action}
                onChange={(value) => updateField("then_action", value)}
                options={[
                  { value: "buy", label: "Buy" },
                  { value: "sell", label: "Sell" },
                ]}
                required
              />

              <SelectField
                id="else_action"
                label="Else Action"
                value={formData.else_action}
                onChange={(value) => updateField("else_action", value)}
                options={[
                  { value: "hold", label: "Hold" },
                  { value: "exit", label: "Exit" },
                ]}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Running Backtest..." : "Run Backtest"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
