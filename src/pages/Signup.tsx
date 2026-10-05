import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Field } from "../components/ui";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Use at least 6 characters"),
  role: z.enum(["attendee", "organizer"]),
});
type FormValues = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: "attendee", title: "Attend events", text: "Browse and register for events." },
  { value: "organizer", title: "Host events", text: "Publish events and manage registrations." },
] as const;

export default function Signup() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "attendee" },
  });

  useEffect(() => {
    if (user) navigate("/events", { replace: true });
  }, [user]);

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const { error, needsConfirmation } = await signUp(values);
    if (error) setFormError(error);
    else if (needsConfirmation) setConfirmEmail(true);
  }

  if (confirmEmail) {
    return (
      <div className="mx-auto max-w-md px-4 py-14">
        <h1 className="text-3xl font-bold">Check your email</h1>
        <p className="muted mt-3">
          We sent a confirmation link. Open it, then come back and log in.
        </p>
        <Link to="/login" className="btn btn-primary mt-6">
          Go to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="muted mt-2 text-sm">
        Already registered?{" "}
        <Link to="/login" className="font-bold underline underline-offset-4">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          <input id="fullName" autoComplete="name" className="input" {...register("fullName")} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className="input" {...register("email")} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="input"
            {...register("password")}
          />
        </Field>

        <fieldset>
          <legend className="label">What do you want to do?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROLE_OPTIONS.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer gap-3 rounded-lg border border-ink/25 p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:border-paper/25 dark:has-[:checked]:border-primaryglow dark:has-[:checked]:bg-paper/10"
              >
                <input type="radio" value={o.value} className="mt-1" {...register("role")} />
                <span>
                  <span className="block font-bold">{o.title}</span>
                  <span className="muted">{o.text}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {formError && (
          <p className="text-sm font-medium text-ember dark:text-emberlight" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
