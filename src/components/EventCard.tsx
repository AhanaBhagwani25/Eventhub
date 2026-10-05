import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import type { EventCardData } from "../lib/types";
import { formatPrice, formatShortDate, isPast, seatsLeft } from "../lib/utils";
import { CategoryBadge, EventBanner } from "./CategoryBanner";

// Vertical card: category banner on top, details below, "View Details" button at the bottom.
export default function EventCard({
  event,
  actions,
}: {
  event: EventCardData;
  actions?: ReactNode;
}) {
  const ended = isPast(event.starts_at);
  const hasCount = event.registered_count !== undefined;
  const left = seatsLeft(event);

  let badge: string | null = null;
  let seatsText = `${event.capacity} seats`;
  if (ended) {
    badge = "Ended";
    seatsText = "Event ended";
  } else if (hasCount && left <= 0) {
    badge = "Sold out";
    seatsText = "No seats left";
  } else if (hasCount && left <= 5) {
    badge = `Only ${left} left`;
    seatsText = `${left} seats left`;
  } else if (hasCount) {
    seatsText = `${left} seats left`;
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white transition-all duration-300 focus-within:ring-2 focus-within:ring-primary hover:-translate-y-1 hover:shadow-large dark:border-paper/10 dark:bg-nightcard dark:focus-within:ring-primaryglow">
      <EventBanner category={event.category} imageUrl={event.image_url} className="h-48 shrink-0">
        <div className="absolute left-3 top-3">
          <CategoryBadge category={event.category} />
        </div>
        {badge && (
          <span className="absolute right-3 top-3 rounded-full bg-marigold px-3 py-1 text-xs font-bold text-white">
            {badge}
          </span>
        )}
      </EventBanner>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-xl font-bold">
          {/* The ::after stretches this link over the whole card */}
          <Link to={`/events/${event.id}`} className="after:absolute after:inset-0">
            {event.title}
          </Link>
        </h3>
        <p className="muted mt-2 line-clamp-2 text-sm">{event.description}</p>

        <div className="mt-4 space-y-2 text-sm">
          <p className="muted flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
            {formatShortDate(event.starts_at)}
          </p>
          <p className="muted flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{event.location}</span>
          </p>
          <div className="flex items-center justify-between">
            <span className="muted flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
              {seatsText}
            </span>
            <span className="font-bold text-primary dark:text-primaryglow">
              {formatPrice(event.price)}
            </span>
          </div>
        </div>

        <span className="btn btn-primary mt-5 w-full" aria-hidden="true">
          View Details
        </span>
        {actions && <div className="relative z-10 pt-3">{actions}</div>}
      </div>
    </article>
  );
}
