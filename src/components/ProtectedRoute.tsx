import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../lib/types";
import { EmptyState, Spinner } from "./ui";

export default function ProtectedRoute({
  role,
  children,
}: {
  role?: Role;
  children: ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && profile?.role !== role) {
    return (
      <div className="px-4 py-16">
        <EmptyState
          title="This page is for organizers"
          message="Your account is set up to attend events. Create an organizer account to host your own."
          action={
            <Link to="/events" className="btn btn-primary">
              Browse events
            </Link>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
