"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { z } from "zod" // Import Zod

// Define the Zod schema for form validation
const formSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export default function SetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const router = useRouter()
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState({ userName: "" })
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  })
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string } | null>(null)

  useEffect(() => {
    if (!token) {
      setIsValid(false)
    } else {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/validate-token?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          setIsValid(data.valid)
          setUser(data.user)
        })
        .catch(() => setIsValid(false))
    }
  }, [token])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userName: user.userName || "",
    }))
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Clear validation errors when user starts typing
    setValidationErrors(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    setValidationErrors(null)

    try {
      // Validate form data
      const validatedData = formSchema.parse(formData)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...validatedData, token }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Something went wrong")

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/quickgick/expire-token?token=${token}`)

      setSuccess("Password set successfully! Redirecting...")
      setTimeout(() => router.push("/owner/login"), 2000)
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors = err.errors.reduce(
          (acc, error) => {
            acc[error.path[0]] = error.message
            return acc
          },
          {} as { [key: string]: string },
        )
        setValidationErrors(errors)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  if (isValid === null) return <p>Checking token...</p>
  if (!isValid) return <p>Invalid or expired token!</p>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Set Your Password</h2>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                placeholder="Enter your username"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {validationErrors?.userName && <p className="text-red-500 text-xs mt-1">{validationErrors.userName}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {validationErrors?.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-black text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

