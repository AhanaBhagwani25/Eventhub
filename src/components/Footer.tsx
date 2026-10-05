import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CATEGORIES } from "../lib/utils";

export default function Footer() {
  const { user, profile } = useAuth();

  const hostLink =
    profile?.role === "organizer"
      ? { to: "/dashboard/new", label: "Create an event" }
      : !user
        ? { to: "/signup", label: "Become an organizer" }
        : null;

  return (
    <footer className="border-t border-ink/10 bg-white dark:border-paper/10 dark:bg-night">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <Calendar className="h-6 w-6 text-primary dark:text-primaryglow" aria-hidden="true" />
            <span className="text-gradient">EventHub</span>
          </Link>
          <p className="muted mt-4 max-w-xs text-sm">
            Your gateway to workshops, gigs, matches and meetups. Find one and save your seat.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Explore</h3>
          <ul className="muted space-y-2 text-sm">
            <li>
              <Link to="/events" className="hover:text-primary">
                Browse events
              </Link>
            </li>
            {user ? (
              <li>
                <Link to="/registrations" className="hover:text-primary">
                  My bookings
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-primary">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-primary">
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Categories</h3>
          <ul className="muted grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link to={`/events?category=${c}`} className="hover:text-primary">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Host</h3>
          <ul className="muted space-y-2 text-sm">
            {hostLink && (
              <li>
                <Link to={hostLink.to} className="hover:text-primary">
                  {hostLink.label}
                </Link>
              </li>
            )}
            {profile?.role === "organizer" && (
              <li>
                <Link to="/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="muted border-t border-ink/10 px-4 py-6 text-center text-sm dark:border-paper/10">
        &copy; {new Date().getFullYear()} EventHub. Built with React, TypeScript, Tailwind and Supabase.
      </div>
    </footer>
  );
}
