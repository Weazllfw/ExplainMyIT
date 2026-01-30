/**
 * Time utilities
 */

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes === 0) return 'Just now';
      return `${diffMinutes}m ago`;
    }
    return `${diffHours}h ago`;
  }

  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export function getTimeAgoIndicator(date: string | Date): {
  text: string;
  severity: 'fresh' | 'recent' | 'old' | 'very-old';
} {
  const diffDays = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 7) {
    return { text: formatTimeAgo(date), severity: 'fresh' };
  }
  if (diffDays <= 30) {
    return { text: formatTimeAgo(date), severity: 'recent' };
  }
  if (diffDays <= 90) {
    return { text: formatTimeAgo(date), severity: 'old' };
  }
  return { text: formatTimeAgo(date), severity: 'very-old' };
}
