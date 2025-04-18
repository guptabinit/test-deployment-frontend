"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Utensils } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";

// Define the Zod schema for form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be 6 characters long!"),
});

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors(null);

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/owner/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validatedData),
          credentials: "include", // This is important for handling cookies
        }
      );

      const data = await res.json();
      console.log("data", data, "res", res);
      if (!res.ok) {
        if (res.status != 200) {
          if (data.message === "Incorrect UserName") {
            toast.error("Login Failed", {
              description: "Incorrect email address",
            });
          } else if (data.message === "Invalid credentials") {
            toast.error("Login Failed", {
              description: "Incorrect password",
            });
          } else {
            toast.error("Login Failed", {
              description: data.message || "Login failed",
            });
          }
        } else {
          throw new Error(data.message || "Login failed");
        }
      } else {
        // Login successful
        toast.success("Login Successful", {
          description: "Redirecting to dashboard...",
        });
        router.push("/owner/dashboard");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce((acc, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {} as { [key: string]: string });
        setValidationErrors(errors);
      } else if (err instanceof Error) {
        toast.error("Error", {
          description: err.message,
        });
      } else {
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center justify-center w-full max-w-md px-4">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center">
                <Utensils className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold text-gray-900"
            >
              Hotel Owner Portal
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600 mt-2"
            >
              Access your Onwer dashboard
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="w-full shadow-md border-gray-200">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl text-center font-bold">
                  Hotel Owner
                </CardTitle>
                <CardDescription className="text-center text-gray-500">
                  Sign in to your account
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className="pl-8"
                          required
                        />
                      </div>
                      {validationErrors?.email && (
                        <p className="text-destructive text-xs mt-1">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          className="pl-8"
                          required
                        />
                      </div>
                      {validationErrors?.password && (
                        <p className="text-destructive text-xs mt-1">
                          {validationErrors.password}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex flex-row items-center gap-1 mt-5">
              <p>Powered by</p>
              <Image
                src="/QG_black.png"
                alt="Quickgick"
                width={100}
                height={25}
                className="h-auto"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
