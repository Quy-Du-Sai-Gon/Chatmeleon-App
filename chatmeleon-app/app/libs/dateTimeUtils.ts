/**
 * Format the given date as "time ago" (e.g., "2 minutes ago", "3 hours ago").
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime(); // Difference in milliseconds

  // Convert milliseconds to seconds
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  // Convert seconds to minutes
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  // Convert minutes to hours
  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // Convert hours to days
  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  // Convert days to weeks
  const weeks = Math.floor(days / 7);

  return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
};

/**
 * Format the given date as a string with text.
 */
export const formatDateWithText = (date: Date): string => {
  return date.toUTCString();
};
