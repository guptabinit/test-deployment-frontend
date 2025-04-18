"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Send,
  Star,
  AlertCircle,
  CheckCircle2,
  Home,
  Loader2,
  Coffee,
  Bed,
  Utensils,
  Bath,
  Wifi,
} from "lucide-react";
import { Sidebar } from "../../_components/sidebar";
import { Header } from "../../_components/header";
import { useHotelDataStore } from "@/stores/user/hotelDataStore";
import { useParams } from "next/navigation";
import { Footer } from "../../_components/footer";

// Feedback categories
const feedbackCategories = [
  { id: "room", label: "Room Comfort", icon: Bed },
  { id: "cleanliness", label: "Cleanliness", icon: Bath },
  { id: "service", label: "Staff & Service", icon: Coffee },
  { id: "dining", label: "Food & Dining", icon: Utensils },
  { id: "amenities", label: "Amenities", icon: Wifi },
];

// Rating labels
const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function FeedbackPage() {
  const { hotelId } = useParams();

  const {
    customization,
    isCustomizationLoaded,
    services,
    dialList,
    isDialerLoaded,
  } = useHotelDataStore();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    room: "",
    feedback: "",
  });
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<
    Record<string, number>
  >({});
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("rating");

  // Initialize category ratings
  useEffect(() => {
    const initialRatings: Record<string, number> = {};
    feedbackCategories.forEach((category) => {
      initialRatings[category.id] = 0;
    });
    setCategoryRatings(initialRatings);
  }, []);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  // Handle category rating change
  const handleCategoryRating = (category: string, rating: number) => {
    setCategoryRatings((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    const ratings = Object.values(categoryRatings);
    if (ratings.length === 0 || ratings.every((r) => r === 0)) return 0;

    const validRatings = ratings.filter((r) => r > 0);
    if (validRatings.length === 0) return 0;

    return Math.round(
      validRatings.reduce((sum, rating) => sum + rating, 0) /
        validRatings.length
    );
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (overallRating === 0)
      newErrors.rating = "Please provide an overall rating";
    if (!formState.feedback) newErrors.feedback = "Please share your feedback";
    if (formState.feedback && formState.feedback.length < 10) {
      newErrors.feedback = "Feedback must be at least 10 characters";
    }

    // Email validation if provided
    if (formState.email && !/^\S+@\S+\.\S+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address";
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        hotelId={hotelId as string}
        hotelLogo={customization?.hotelLogo as string}
        isLogoLoaded={isCustomizationLoaded}
      />

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
          <h1 className="text-base font-medium">General Feedback</h1>
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4 flex justify-center"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className="h-8 w-8 text-yellow-400"
                      fill={overallRating >= value ? "#FBBF24" : "none"}
                      stroke={
                        overallRating >= value ? "#FBBF24" : "currentColor"
                      }
                    />
                  ))}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-2 text-2xl font-medium"
                >
                  Thank You for Your Feedback!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6 text-gray-500"
                >
                  We appreciate you taking the time to share your experience
                  with us. Your feedback helps us improve our services.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    href="/user"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8B5A2B] px-6 py-3 text-white transition-all duration-300 hover:bg-[#704A22]"
                  >
                    <Home className="h-4 w-4" />
                    Return Home
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 20 }}
                className="rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("rating")}
                    className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                      activeTab === "rating"
                        ? "border-b-2 border-[#8B5A2B] text-[#8B5A2B]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Ratings
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                      activeTab === "details"
                        ? "border-b-2 border-[#8B5A2B] text-[#8B5A2B]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Details
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="relative">
                    <div
                      className={activeTab === "rating" ? "block" : "hidden"}
                    >
                      <motion.div
                        key="rating-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <motion.div
                          variants={itemVariants}
                          className="text-center"
                        >
                          <h2 className="mb-1 text-lg font-medium text-gray-800">
                            How was your stay?
                          </h2>
                          <p className="text-sm text-gray-500">
                            Your feedback helps us improve our services
                          </p>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <label className="block text-sm font-medium text-gray-700">
                            Overall Experience
                          </label>
                          <div className="flex flex-col items-center">
                            <div className="mb-2 flex gap-2">
                              {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                  key={value}
                                  type="button"
                                  onMouseEnter={() => setHoverRating(value)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  onClick={() => setOverallRating(value)}
                                  className="group relative rounded-full p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                  <Star
                                    className={`h-10 w-10 transition-all duration-200 ${
                                      hoverRating >= value ||
                                      overallRating >= value
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    fill={
                                      hoverRating >= value ||
                                      overallRating >= value
                                        ? "#FBBF24"
                                        : "none"
                                    }
                                    stroke={
                                      hoverRating >= value ||
                                      overallRating >= value
                                        ? "#FBBF24"
                                        : "currentColor"
                                    }
                                  />
                                </button>
                              ))}
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                              {hoverRating > 0
                                ? ratingLabels[hoverRating - 1]
                                : overallRating > 0
                                ? ratingLabels[overallRating - 1]
                                : "Select a rating"}
                            </p>
                            {errors.rating && (
                              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />{" "}
                                {errors.rating}
                              </p>
                            )}
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="space-y-4"
                        >
                          <label className="block text-sm font-medium text-gray-700">
                            Rate Specific Areas
                          </label>
                          {feedbackCategories.map((category) => {
                            const CategoryIcon = category.icon;
                            return (
                              <div
                                key={category.id}
                                className="flex items-center gap-3"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF2E6] text-[#8B5A2B]">
                                  <CategoryIcon className="h-4 w-4" />
                                </div>
                                <span className="w-28 text-sm">
                                  {category.label}
                                </span>
                                <div className="flex flex-1 gap-1">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() =>
                                        handleCategoryRating(category.id, value)
                                      }
                                      className="rounded-full p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                      <Star
                                        className={`h-5 w-5 ${
                                          categoryRatings[category.id] >= value
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                        fill={
                                          categoryRatings[category.id] >= value
                                            ? "#FBBF24"
                                            : "none"
                                        }
                                        stroke={
                                          categoryRatings[category.id] >= value
                                            ? "#FBBF24"
                                            : "currentColor"
                                        }
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label
                            htmlFor="feedback"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Your Feedback{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="feedback"
                            rows={4}
                            value={formState.feedback}
                            onChange={handleChange}
                            className={`w-full rounded-lg border ${
                              errors.feedback
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            } p-3 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]`}
                            placeholder="Please share your experience with us"
                          ></textarea>
                          <div className="mt-1 flex items-center justify-between">
                            {errors.feedback ? (
                              <p className="flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />{" "}
                                {errors.feedback}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                Minimum 10 characters
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              {formState.feedback.length} characters
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="flex justify-between pt-2"
                        >
                          <div></div>
                          <button
                            type="button"
                            onClick={() => setActiveTab("details")}
                            className="flex items-center gap-2 rounded-lg bg-[#8B5A2B] px-4 py-2 text-white transition-all duration-300 hover:bg-[#704A22]"
                          >
                            Next
                          </button>
                        </motion.div>
                      </motion.div>
                    </div>

                    <div
                      className={activeTab === "details" ? "block" : "hidden"}
                    >
                      <motion.div
                        key="details-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <motion.div
                          variants={itemVariants}
                          className="text-center"
                        >
                          <h2 className="mb-1 text-lg font-medium text-gray-800">
                            Your Information
                          </h2>
                          <p className="text-sm text-gray-500">
                            Optional, but helps us follow up if needed
                          </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={formState.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                            placeholder="Your name (optional)"
                          />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formState.email}
                            onChange={handleChange}
                            className={`w-full rounded-lg border ${
                              errors.email
                                ? "border-red-300 bg-red-50"
                                : "border-gray-300"
                            } p-3 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]`}
                            placeholder="Your email (optional)"
                          />
                          {errors.email && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                              <AlertCircle className="h-3 w-3" /> {errors.email}
                            </p>
                          )}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label
                            htmlFor="room"
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Room Number
                          </label>
                          <input
                            type="text"
                            id="room"
                            value={formState.room}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#8B5A2B] focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                            placeholder="Your room number (optional)"
                          />
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="flex justify-between pt-2"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveTab("rating")}
                            className="flex items-center gap-2 rounded-lg border border-[#8B5A2B] px-4 py-2 text-[#8B5A2B] transition-all duration-300 hover:bg-[#FFF2E6]"
                          >
                            Back
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-lg bg-[#8B5A2B] px-4 py-2 text-white transition-all duration-300 hover:bg-[#704A22] disabled:opacity-70"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Submit Feedback
                              </>
                            )}
                          </button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
