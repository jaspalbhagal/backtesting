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

export default function LoginPage() {
  const [formData, setFormData] = useState({
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
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
      const response = await authApi.login(formData.email, formData.password)

      login({
        email: response.email,
        access_token: response.access_token,
      })

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account",
      })

      router.push("/backtest")
    } catch (error: any) {
      setApiError(error.message || "Failed to sign in")
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
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {apiError && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
