import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Calendar, Menu, Moon, Sun, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../lib/useTheme";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-primary/10 text-primary dark:bg-primaryglow/15 dark:text-primaryglow"
        : "hover:bg-ink/5 dark:hover:bg-paper/10"
    }`;

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    toast("Signed out.");
    navigate("/");
  }

  const close = () => setOpen(false);

  const links = (
    <>
      <NavLink to="/events" className={linkClass} onClick={close}>
        Explore Events
      </NavLink>
      {user && (
        <NavLink to="/registrations" className={linkClass} onClick={close}>
          My Bookings
        </NavLink>
      )}
      {profile?.role === "organizer" && (
        <NavLink to="/dashboard" className={linkClass} onClick={close}>
          Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-paper/10 dark:bg-night/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold" onClick={close}>
          <Calendar className="h-6 w-6 text-primary dark:text-primaryglow" aria-hidden="true" />
          <span className="text-gradient">EventHub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg p-2 hover:bg-ink/5 dark:hover:bg-paper/10"
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <span className="muted max-w-[10rem] truncate text-sm">
                  {profile?.full_name || user.email}
                </span>
                <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign in
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg p-2 hover:bg-ink/5 md:hidden dark:hover:bg-paper/10"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 px-4 pb-4 pt-2 md:hidden dark:border-paper/10">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links}
          </nav>
          <div className="mt-3 flex gap-2">
            {user ? (
              <button type="button" className="btn btn-ghost w-full" onClick={handleSignOut}>
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost flex-1" onClick={close}>
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary flex-1" onClick={close}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
