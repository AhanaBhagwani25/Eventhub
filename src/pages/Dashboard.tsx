import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { EventWithCount } from "../lib/types";
import { dateParts, formatPrice, formatTime } from "../lib/utils";
import { EmptyState, Spinner } from "../components/ui";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<EventWithCount[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("events_with_counts")
      .select("*")
      .eq("organizer_id", user.id)
      .order("starts_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setEvents((data ?? []) as EventWithCount[]);
      });
  }, [user?.id]);

  async function remove(event: EventWithCount) {
    const ok = window.confirm(
      `Delete "${event.title}"? Everyone registered will lose their spot.`
    );
    if (!ok) return;
    const { error } = await supabase.from("events").delete().eq("id", event.id);
    if (error) {
      toast(error.message, "error");
      return;
    }
    setEvents((list) => (list ? list.filter((e) => e.id !== event.id) : list));
    toast("Event deleted.");
  }

  if (error) {
    return (
      <div className="px-4 py-16">
        <EmptyState title="Couldn't load your events" message={error} />
      </div>
    );
  }
  if (events === null) return <Spinner />;

  const totalRegistrations = events.reduce((sum, e) => sum + e.registered_count, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="muted mt-1 text-sm">
            {events.length} {events.length === 1 ? "event" : "events"} and {totalRegistrations}{" "}
            {totalRegistrations === 1 ? "registration" : "registrations"} so far.
          </p>
        </div>
        <Link to="/dashboard/new" className="btn btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="You haven't created an event yet"
            message="Add a title, date, place and seat limit. It goes live as soon as you save."
            action={
              <Link to="/dashboard/new" className="btn btn-primary">
                Create your first event
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-ink/10 overflow-hidden rounded-xl border border-ink/10 bg-white dark:divide-paper/10 dark:border-paper/10 dark:bg-nightcard">
          {events.map((e) => {
            const d = dateParts(e.starts_at);
            return (
              <li key={e.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Link
                    to={`/events/${e.id}`}
                    className="font-display text-lg font-bold hover:underline"
                  >
                    {e.title}
                  </Link>
                  <p className="muted mt-0.5 text-sm">
                    {d.weekday}, {d.day} {d.month} at {formatTime(e.starts_at)} in {e.location}
                  </p>
                </div>
                <p className="text-sm sm:w-40">
                  <span className="font-bold">
                    {e.registered_count} / {e.capacity}
                  </span>{" "}
                  <span className="muted">registered</span>
                  <span className="muted block">{formatPrice(e.price)}</span>
                </p>
                <div className="flex gap-2">
                  <Link to={`/dashboard/${e.id}/edit`} className="btn btn-ghost">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Edit
                  </Link>
                  <button type="button" className="btn btn-ghost" onClick={() => remove(e)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
