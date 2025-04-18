export const formatDate = (input: string | Date): string => {
  try {
    if (!input) return "N/A";

    const date = input instanceof Date ? input : new Date(input);

    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};
