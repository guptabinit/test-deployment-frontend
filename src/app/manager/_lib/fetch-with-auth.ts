export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("key")

  if (!token) {
    throw new Error("No authentication token found.")
  }

  const headers = new Headers(options.headers)

  headers.set("Authorization", `Bearer ${token}`)

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", 
  })

  if (res.status === 401) {
    window.location.href = "/manager/login" 
  }

  return res
}

