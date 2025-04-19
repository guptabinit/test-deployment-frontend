"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, CheckCircle, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LogoutPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const logout = async () => {
      try {
        setStatus("loading");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/manager/logout`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          // Clear client-side tokens
          document.cookie =
            "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
          localStorage.removeItem("authToken");

          // Show success state briefly before redirecting
          setStatus("success");

          // Redirect after a short delay to show the success message
          localStorage.clear()
          setTimeout(() => {
            router.push("/manager/login");
          }, 1500);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setErrorMessage(
            errorData.message || "Logout failed. Please try again."
          );
          setStatus("error");
        }
      } catch (error) {
        console.error("Error during logout:", error);
        setErrorMessage("Network error. Please try again.");
        setStatus("error");
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Logging Out
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Please wait while we log you out..."}
            {status === "success" && "You have been successfully logged out."}
            {status === "error" && "There was a problem logging you out."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">
                Securely ending your session...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Redirecting you to login page...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="text-sm text-destructive">{errorMessage}</p>
              <button
                onClick={() => router.push("/manager/login")}
                className="flex items-center space-x-2 mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <LogOut className="h-4 w-4" />
                <span>Return to Login</span>
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
