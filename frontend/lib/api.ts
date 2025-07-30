const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.detail || "An error occurred")
  }

  return response.json()
}

export const authApi = {
  signup: async (username: string, email: string, password: string) => {
    return apiRequest<{ access_token: string; email: string }>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    })
  },

  login: async (email: string, password: string) => {
    return apiRequest<{ access_token: string; email: string }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },
}

export const backtestApi = {
  runBacktest: async (data: any, token: string) => {
    return apiRequest<any>("/api/v1/backtest/", {
      method: "POST",
      headers: {
        Authorization: `${token}`,
      },
      body: JSON.stringify(data),
    })
  },
}
