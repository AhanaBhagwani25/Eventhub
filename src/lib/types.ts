export type Role = "attendee" | "organizer";

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
}

export interface EventRow {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  starts_at: string;
  capacity: number;
  price: number;
  image_url: string | null;
  created_at: string;
}

// Rows from the `events_with_counts` view include how many people registered.
export interface EventWithCount extends EventRow {
  registered_count: number;
}

// What EventCard needs. The count is optional (not every query includes it).
export type EventCardData = EventRow & { registered_count?: number };
