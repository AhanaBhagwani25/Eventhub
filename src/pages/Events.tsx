import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../lib/utils";
import type { EventWithCount } from "../lib/types";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";
import { EmptyState } from "../components/ui";
import { CategoryArt } from "../components/CategoryBanner";

const WHEN_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "week", label: "Next 7 days" },
  { value: "past", label: "Past events" },
];

export default function Events() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const when = params.get("when") ?? "upcoming";

  const [search, setSearch] = useState(q);
  const [events, setEvents] = useState<EventWithCount[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setParam(key: string, value: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  }

  // Wait 300ms after typing stops before searching.
  useEffect(() => {
    if (search.trim() === q) return;
    const timer = setTimeout(() => setParam("q", search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setEvents(null);
    setError(null);

    const now = new Date();
    let query = supabase.from("events_with_counts").select("*");

    if (when === "past") {
      query = query.lt("starts_at", now.toISOString()).order("starts_at", { ascending: false });
    } else {
      query = query.gte("starts_at", now.toISOString()).order("starts_at", { ascending: true });
      if (when === "week") {
        const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        query = query.lte("starts_at", weekEnd.toISOString());
      }
    }
    if (category) query = query.eq("category", category);

    // Remove characters that have a special meaning in the filter syntax.
    const term = q.replace(/[,()%*]/g, " ").trim();
    if (term) query = query.or(`title.ilike.%${term}%,location.ilike.%${term}%`);

    query.then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError(error.message);
      else setEvents((data ?? []) as EventWithCount[]);
    });

    return () => {
      cancelled = true;
    };
  }, [q, category, when]);

  function clearFilters() {
    setSearch("");
    setParams({}, { replace: true });
  }

  const hasFilters = Boolean(q || category || when !== "upcoming");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {(CATEGORIES as readonly string[]).includes(category) ? (
        <div className="relative h-32 overflow-hidden rounded-xl text-white sm:h-40">
          <CategoryArt category={category} />
          <div className="absolute bottom-4 left-5">
            <h1 className="text-3xl font-bold drop-shadow sm:text-4xl">{category} events</h1>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-bold">Discover Events</h1>
          <p className="muted mt-2">Find your next amazing experience</p>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <label htmlFor="search" className="sr-only">
            Search by title or place
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
            aria-hidden="true"
          />
          <input
            id="search"
            className="input pl-9"
            placeholder="Search by title or place"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="when" className="sr-only">
            When
          </label>
          <select
            id="when"
            className="input"
            value={when}
            onChange={(e) => setParam("when", e.target.value === "upcoming" ? "" : e.target.value)}
          >
            {WHEN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {["", ...CATEGORIES].map((c) => {
          const active = category === c;
          return (
            <button
              key={c || "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setParam("category", c)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-transparent bg-gradient-primary text-white"
                  : "border-ink/15 hover:bg-ink/5 dark:border-paper/20 dark:hover:bg-paper/10"
              }`}
            >
              {c || "All Events"}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {error && <EmptyState title="Couldn't load events" message={error} />}

        {!error && events === null && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && events && events.length === 0 && (
          <EmptyState
            title="No events match"
            message="Try a different word, category or date range."
            action={
              hasFilters ? (
                <button type="button" className="btn btn-ghost" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : undefined
            }
          />
        )}

        {!error && events && events.length > 0 && (
          <>
            <p className="muted mb-4 text-sm" aria-live="polite">
              {events.length} {events.length === 1 ? "event" : "events"}
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
