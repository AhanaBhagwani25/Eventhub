import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { isConfigured } from "./lib/supabase";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyRegistrations from "./pages/MyRegistrations";
import Dashboard from "./pages/Dashboard";
import EventFormPage from "./pages/EventFormPage";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      {!isConfigured && (
        <div className="bg-marigold px-4 py-3 text-center text-sm font-bold text-white" role="alert">
          Supabase isn't connected yet. Copy .env.example to .env, add your project URL and anon
          key, then restart the dev server.
        </div>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="registrations"
          element={
            <ProtectedRoute>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute role="organizer">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/new"
          element={
            <ProtectedRoute role="organizer">
              <EventFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/:id/edit"
          element={
            <ProtectedRoute role="organizer">
              <EventFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
