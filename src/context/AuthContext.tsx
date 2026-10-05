import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile, Role } from "../lib/types";

interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (input: SignUpInput) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  // Which user's profile we have finished fetching (null = none yet).
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  // 1. Restore the session, then keep it in sync.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setSessionLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // 2. Load the profile (name + role) whenever the signed-in user changes.
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileUserId(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setProfile((data as Profile | null) ?? null);
        setProfileUserId(user.id);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const loading = sessionLoading || (user !== null && profileUserId !== user.id);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }, []);

  const signUp = useCallback(async ({ fullName, email, password, role }: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // The database trigger reads these values to create the profile row.
      options: { data: { full_name: fullName, role } },
    });
    if (error) return { error: error.message, needsConfirmation: false };
    return { error: null, needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
