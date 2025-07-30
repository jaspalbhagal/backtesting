"use client"

import posthog from "posthog-js"

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_test_key", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") console.log("PostHog loaded")
    },
  })
}

export { posthog }
