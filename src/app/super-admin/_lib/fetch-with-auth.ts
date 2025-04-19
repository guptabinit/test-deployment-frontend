export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("sKey")

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensure cookies are sent
  });

  if (res.status === 401) {
    window.location.href = "/super-admin/login"; // Redirect to login if unauthorized
  }

  return res;
}
