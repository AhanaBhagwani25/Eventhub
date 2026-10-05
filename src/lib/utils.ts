export const CATEGORIES = [
  "Tech",
  "Music",
  "Sports",
  "Workshop",
  "Arts",
  "Career",
  "Social",
] as const;

// Used when an event has no image. Full class names so Tailwind can find them.
export const CATEGORY_GRADIENTS: Record<string, string> = {
  Tech: "from-ink to-[#3B4A8C]",
  Music: "from-[#5B2A86] to-[#C23B8A]",
  Sports: "from-[#0B7A6B] to-[#2FB36D]",
  Workshop: "from-[#B45309] to-[#F5B400]",
  Arts: "from-[#C23B1A] to-[#F28C5B]",
  Career: "from-[#1E3A5F] to-[#2E86AB]",
  Social: "from-[#7C3AED] to-[#38BDF8]",
};

export function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
    day: String(d.getDate()),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
  };
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatPrice(price: number) {
  return Number(price) === 0 ? "Free" : `₹${Number(price).toLocaleString("en-IN")}`;
}

export function seatsLeft(e: { capacity: number; registered_count?: number }) {
  return e.capacity - (e.registered_count ?? 0);
}

export function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now();
}

// Converts an ISO date to the "YYYY-MM-DDTHH:mm" format <input type="datetime-local"> expects.
export function toInputDateTime(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
