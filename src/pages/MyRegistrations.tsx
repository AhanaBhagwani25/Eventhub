import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { EventRow } from "../lib/types";
import { isPast } from "../lib/utils";
import EventCard from "../components/EventCard";
import { EmptyState, Spinner } from "../components/ui";

interface RegistrationRow {
  id: string;
  event: EventRow | null;
}

export default function MyRegistrations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<RegistrationRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("registrations")
      .select("id, event:events(*)")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          return;
        }
        const list = ((data ?? []) as unknown as RegistrationRow[]).filter((r) => r.event);
        list.sort(
          (a, b) =>
            new Date(a.event!.starts_at).getTime() - new Date(b.event!.starts_at).getTime()
        );
        setRows(list);
      });
  }, [user?.id]);

  async function cancel(registrationId: string) {
    const { error } = await supabase.from("registrations").delete().eq("id", registrationId);
    if (error) {
      toast(error.message, "error");
      return;
    }
    setRows((list) => (list ? list.filter((r) => r.id !== registrationId) : list));
    toast("Registration cancelled.");
  }

  if (error) {
    return (
      <div className="px-4 py-16">
        <EmptyState title="Couldn't load your registrations" message={error} />
      </div>
    );
  }
  if (rows === null) return <Spinner />;

  const upcoming = rows.filter((r) => !isPast(r.event!.starts_at));
  const past = rows.filter((r) => isPast(r.event!.starts_at));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">My registrations</h1>

      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="You haven't registered for anything yet"
            message="Find an event you like and save your seat."
            action={
              <Link to="/events" className="btn btn-primary">
                Browse events
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-xl font-bold">Upcoming</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((r) => (
                  <EventCard
                    key={r.id}
                    event={r.event!}
                    actions={
                      <button type="button" className="btn btn-ghost" onClick={() => cancel(r.id)}>
                        Cancel registration
                      </button>
                    }
                  />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-bold">Past</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((r) => (
                  <EventCard key={r.id} event={r.event!} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
