"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputField } from "@/components/ui/input-field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await authApi.signup(formData.username, formData.email, formData.password)

      login({
        email: response.email,
        access_token: response.access_token,
      })

      toast({
        title: "Account created successfully!",
        description: "Welcome to Stock Strategy Backtester",
      })

      router.push("/backtest")
    } catch (error: any) {
      setApiError(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to start backtesting your trading strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiError && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="username"
              label="Username"
              value={formData.username}
              onChange={(value) => updateField("username", value)}
              placeholder="Enter your username"
              required
              error={errors.username}
            />

            <InputField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => updateField("email", value)}
              placeholder="Enter your email"
              required
              error={errors.email}
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => updateField("password", value)}
              placeholder="Enter your password"
              required
              error={errors.password}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
