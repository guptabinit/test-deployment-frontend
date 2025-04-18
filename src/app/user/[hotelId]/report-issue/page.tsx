"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Sidebar } from "../../_components/sidebar";
import { Footer } from "../../_components/footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Send,
  Upload,
  AlertCircle,
  CheckCircle2,
  Home,
  X,
  Camera,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Header } from "../../_components/header";
import {
  containerVariants,
  itemVariants,
} from "../_animation-constants/variants";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";

const reportCategories = [
  { id: "maintenance", label: "Maintenance Issue", icon: "🔧" },
  { id: "cleanliness", label: "Cleanliness Concern", icon: "🧹" },
  { id: "noise", label: "Noise Complaint", icon: "🔊" },
  { id: "missing", label: "Missing Item", icon: "🔍" },
  { id: "service", label: "Service Feedback", icon: "👨‍💼" },
  { id: "safety", label: "Safety Concern", icon: "⚠️" },
  { id: "other", label: "Other", icon: "📝" },
];

export default function ReportPage() {
  const { hotelId } = useParams();

  const [formState, setFormState] = useState({
    category: "",
    room: "",
    description: "",
    contact: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));

    // Clear error when field is edited
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, file: "File size exceeds 5MB limit" }));
        return;
      }

      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear file error if exists
      if (errors.file) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setUploadedImage(null);
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.category) newErrors.category = "Please select a category";
    if (!formState.room) newErrors.room = "Please enter your room number";
    if (!formState.description)
      newErrors.description = "Please describe the issue";
    if (formState.description && formState.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
      }, 1500);
    }
  };

  const { customization } = useHotelDataStore();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header hotelId={hotelId as string} hotelLogo="" isLogoLoaded />
      <Sidebar />

      <main
        className="flex-1"
        style={{
          backgroundColor: customization?.hotelColors?.backgroundColor,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="sticky top-16 z-30 flex items-center gap-2 bg-cream/70 backdrop-blur-md px-4 py-3 shadow-sm"
        >
          <Link
            href="/user"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brown transition-all duration-200 hover:bg-[#8B5A2B]/90 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-medium">Report an Issue</h1>
        </motion.div>

        <div className="container mx-auto max-w-2xl px-4 py-6">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                >
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-2 text-2xl font-medium"
                >
                  Report Submitted
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 text-gray-500"
                >
                  Thank you for your report. Our staff will address it promptly
                  and get back to you if needed.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                  <Link
                    href="/user"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8B5A2B] px-6 py-3 text-white transition-all duration-300 hover:bg-[#704A22]"
                  >
                    <Home className="h-4 w-4" />
                    Return Home
                  </Link>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#8B5A2B] px-6 py-3 text-[#8B5A2B] transition-all duration-300 hover:bg-[#FFF2E6]"
                  >
                    <Send className="h-4 w-4" />
                    Submit Another Report
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 20 }}
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      value={formState.category}
                      onChange={handleChange}
                      className={`w-full appearance-none rounded-lg border ${
                        errors.category
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      } p-3 pr-10 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]`}
                    >
                      <option value="">Select a category</option>
                      {reportCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.category && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.category}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="room"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Room Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="room"
                    value={formState.room}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.room
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } p-3 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]`}
                    placeholder="Enter your room number"
                  />
                  {errors.room && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.room}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formState.description}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      errors.description
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    } p-3 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]`}
                    placeholder="Please describe the issue in detail"
                  ></textarea>
                  <div className="mt-1 flex items-center justify-between">
                    {errors.description ? (
                      <p className="flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" /> {errors.description}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Minimum 10 characters
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {formState.description.length} characters
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload Photo (Optional)
                  </label>

                  {uploadedImage ? (
                    <div className="relative rounded-lg border border-gray-300 p-2">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <p
                          className="truncate text-xs text-gray-500"
                          title={uploadedFileName}
                        >
                          {uploadedFileName}
                        </p>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                          errors.file
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-[#8B5A2B] hover:bg-[#FFF8F2]"
                        } p-6 transition-colors duration-300`}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="rounded-full bg-[#FFF2E6] p-3">
                            <Upload className="h-6 w-6 text-[#8B5A2B]" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                              Click to upload
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Simulate camera capture
                              alert("Camera functionality would open here");
                            }}
                            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
                          >
                            <Camera className="h-3 w-3" /> Take Photo
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
                          >
                            <ImageIcon className="h-3 w-3" /> Browse Files
                          </button>
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                  )}

                  {errors.file && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> {errors.file}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="contact"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Contact Information
                  </label>
                  <input
                    type="text"
                    id="contact"
                    value={formState.contact}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                    placeholder="Phone or email for follow-up (optional)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    We'll only contact you if we need more information
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#8B5A2B] py-3 text-white transition-all duration-300 hover:bg-[#704A22] disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Report
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-500">
                    <span className="text-red-500">*</span> Required fields
                  </p>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
