import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck, Sparkles, Ticket, Megaphone } from "lucide-react";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../lib/utils";
import type { EventWithCount } from "../lib/types";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";
import { EmptyState } from "../components/ui";
import { categoryTheme } from "../components/CategoryBanner";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero-events.jpg";

export default function Home() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [q, setQ] = useState("");
  const [events, setEvents] = useState<EventWithCount[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("events_with_counts")
      .select("*")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(6)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setEvents((data ?? []) as EventWithCount[]);
      });
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/events?q=${encodeURIComponent(term)}` : "/events");
  }

  let cta: { to: string; label: string } | null = null;
  if (!user) cta = { to: "/signup", label: "Create an account" };
  else if (profile?.role === "organizer") cta = { to: "/dashboard/new", label: "Create an event" };
  else cta = { to: "/events", label: "Browse events" };

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-hero dark:bg-gradient-hero-dark">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-in space-y-6">
            <h1 className="text-5xl font-extrabold leading-[1.08] md:text-6xl">
              Discover Amazing
              <span className="text-gradient block">Events Near You</span>
            </h1>
            <p className="muted max-w-lg text-lg">
              Workshops, gigs, matches and meetups from your campus and city. Pick one and save your
              seat.
            </p>

            <form onSubmit={onSearch} role="search" className="flex max-w-lg gap-2">
              <label htmlFor="home-search" className="sr-only">
                Search events
              </label>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
                  aria-hidden="true"
                />
                <input
                  id="home-search"
                  className="input h-12 pl-9"
                  placeholder="Search by title or place"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary h-12 px-6">
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              <Link to="/events" className="btn btn-primary btn-lg">
                Explore Events
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              {!user && (
                <Link to="/signup" className="btn btn-ghost btn-lg">
                  Create Account
                </Link>
              )}
            </div>
          </div>

          <div className="animate-scale-in relative">
            <div
              className="absolute inset-0 rounded-full bg-gradient-primary opacity-25 blur-3xl"
              aria-hidden="true"
            />
            <img
              src={heroImage}
              alt="A crowd cheering at a live event"
              className="relative w-full rounded-2xl shadow-large"
            />
          </div>
        </div>
      </section>

      {/* Why EventHub */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Why Choose EventHub</h2>
          <p className="muted mx-auto mt-3 max-w-2xl">
            The easiest way to discover, book, and host events.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Ticket,
              title: "Easy Booking",
              text: "Save your seat in one click and manage everything from My Bookings.",
            },
            {
              icon: ShieldCheck,
              title: "No Overbooking",
              text: "Seat limits are enforced by the database, so a full event stays full.",
            },
            {
              icon: Megaphone,
              title: "Host Your Own",
              text: "Publish an event, set a seat limit, and see who has registered.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-ink/10 p-6 transition-colors hover:border-primary dark:border-paper/10 dark:hover:border-primaryglow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primaryglow/15 dark:text-primaryglow">
                <f.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
              <p className="muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-ink/[0.03] dark:bg-paper/[0.03]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-3xl font-bold">Browse by category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {CATEGORIES.map((c) => {
              const t = categoryTheme(c);
              const Icon = t.Icon;
              return (
                <Link
                  key={c}
                  to={`/events?category=${c}`}
                  className="group relative flex h-28 flex-col justify-end overflow-hidden rounded-xl p-3 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-large"
                  style={{ backgroundImage: `linear-gradient(135deg, ${t.from}, ${t.via} 55%, ${t.to})` }}
                >
                  <Icon
                    className="absolute -right-2 -top-2 h-16 w-16 text-white/25 transition-transform group-hover:scale-110"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <span className="relative font-display text-base font-bold drop-shadow">{c}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 font-semibold text-marigold">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Featured
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">Upcoming Events</h2>
          </div>
          <Link to="/events" className="btn btn-ghost">
            View All
          </Link>
        </div>

        {error && (
          <EmptyState
            title="Couldn't load events"
            message={`${error}. Check your Supabase setup in the README.`}
          />
        )}

        {!error && events === null && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && events && events.length === 0 && (
          <EmptyState
            title="No upcoming events yet"
            message="Organizers can publish the first one in a couple of minutes."
          />
        )}

        {!error && events && events.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {/* Call to action */}
      {cta && (
        <section className="bg-gradient-primary">
          <div className="mx-auto max-w-6xl px-4 py-20 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-white/90">
              Join EventHub today and never miss out on amazing experiences.
            </p>
            <Link
              to={cta.to}
              className="btn btn-lg bg-marigold text-white shadow-lg hover:bg-marigold/90"
            >
              {cta.label}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
