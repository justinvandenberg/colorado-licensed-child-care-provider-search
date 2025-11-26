const formatRelativeDate = (dateInput: Date | string | number): string => {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // If under 1 hour
  if (diffMinutes < 60) {
    const mins = Math.max(diffMinutes, 1); // avoid "0 minutes"
    return `${mins} min${mins === 1 ? "" : "s"} ago`;
  }

  // If under 24 hours
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  // If over 24 hours
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

export { formatRelativeDate };
