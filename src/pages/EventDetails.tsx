import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { EventWithCount } from "../lib/types";
import {
  formatFullDate,
  formatPrice,
  formatTime,
  isPast,
  seatsLeft,
} from "../lib/utils";
import { EmptyState, Spinner } from "../components/ui";
import { CategoryBadge, EventBanner } from "../components/CategoryBanner";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  // undefined = still loading, null = not found
  const [event, setEvent] = useState<EventWithCount | null | undefined>(undefined);
  const [organizer, setOrganizer] = useState("");
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadEvent = useCallback(async () => {
    const { data } = await supabase
      .from("events_with_counts")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const found = (data as EventWithCount | null) ?? null;
    setEvent(found);
    return found;
  }, [id]);

  useEffect(() => {
    setEvent(undefined);
    loadEvent().then((found) => {
      if (!found) return;
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", found.organizer_id)
        .maybeSingle()
        .then(({ data }) => setOrganizer(data?.full_name ?? ""));
    });
  }, [loadEvent]);

  useEffect(() => {
    if (!user || !id) {
      setRegistrationId(null);
      return;
    }
    supabase
      .from("registrations")
      .select("id")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setRegistrationId(data?.id ?? null));
  }, [user?.id, id]);

  async function register() {
    if (!user || !event) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("registrations")
      .insert({ event_id: event.id, user_id: user.id })
      .select("id")
      .single();
    setBusy(false);
    if (error) {
      toast(error.message, "error");
      await loadEvent();
      return;
    }
    setRegistrationId(data.id);
    toast("You're registered.");
    await loadEvent();
  }

  async function cancel() {
    if (!registrationId) return;
    setBusy(true);
    const { error } = await supabase.from("registrations").delete().eq("id", registrationId);
    setBusy(false);
    if (error) {
      toast(error.message, "error");
      return;
    }
    setRegistrationId(null);
    toast("Registration cancelled.");
    await loadEvent();
  }

  if (event === undefined) return <Spinner />;

  if (event === null) {
    return (
      <div className="px-4 py-16">
        <EmptyState
          title="Event not found"
          message="It may have been removed by the organizer."
          action={
            <Link to="/events" className="btn btn-primary">
              Browse events
            </Link>
          }
        />
      </div>
    );
  }

  const ended = isPast(event.starts_at);
  const left = seatsLeft(event);
  const soldOut = left <= 0;
  const isOwner = user?.id === event.organizer_id;

  let action;
  if (isOwner) {
    action = (
      <Link to={`/dashboard/${event.id}/edit`} className="btn btn-primary w-full">
        Edit event
      </Link>
    );
  } else if (ended) {
    action = (
      <button type="button" className="btn btn-ghost w-full" disabled>
        This event has ended
      </button>
    );
  } else if (!user) {
    action = (
      <Link to="/login" state={{ from: `/events/${event.id}` }} className="btn btn-primary w-full">
        Log in to register
      </Link>
    );
  } else if (registrationId) {
    action = (
      <>
        <p className="mb-3 text-sm font-bold text-pine dark:text-pinelight">You're registered.</p>
        <button type="button" className="btn btn-ghost w-full" onClick={cancel} disabled={busy}>
          {busy ? "Cancelling..." : "Cancel registration"}
        </button>
      </>
    );
  } else if (soldOut) {
    action = (
      <button type="button" className="btn btn-ghost w-full" disabled>
        Sold out
      </button>
    );
  } else {
    action = (
      <button type="button" className="btn btn-primary w-full" onClick={register} disabled={busy}>
        {busy ? "Registering..." : "Register"}
      </button>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/events" className="muted text-sm font-medium underline underline-offset-4">
        Back to events
      </Link>

      <EventBanner
        category={event.category}
        imageUrl={event.image_url}
        className="mt-4 h-56 rounded-xl sm:h-80"
      >
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
          <CategoryBadge category={event.category} className="px-4 py-1.5 text-sm" />
        </div>
      </EventBanner>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{event.title}</h1>
          {organizer && <p className="muted mt-2 text-sm">Hosted by {organizer}</p>}
          <p className="mt-6 max-w-prose whitespace-pre-line leading-relaxed">{event.description}</p>
        </div>

        <aside className="h-fit rounded-xl border border-ink/10 bg-white p-5 lg:sticky lg:top-24 dark:border-paper/10 dark:bg-nightcard">
          <p className="font-display text-3xl font-bold">{formatPrice(event.price)}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {formatFullDate(event.starts_at)}
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {formatTime(event.starts_at)}
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {event.location}
            </li>
            <li className="flex gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {soldOut ? "No seats left" : `${left} of ${event.capacity} seats left`}
            </li>
          </ul>
          <div className="mt-5">{action}</div>
        </aside>
      </div>
    </div>
  );
}
