import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";
import { Field } from "../components/ui";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/events";
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Once the session exists, go back to where the person came from.
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user]);

  async function onSubmit(values: FormValues) {
    setFormError(null);
    const error = await signIn(values.email, values.password);
    if (error) setFormError(error);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-bold">Log in</h1>
      <p className="muted mt-2 text-sm">
        New here?{" "}
        <Link to="/signup" className="font-bold underline underline-offset-4">
          Create an account
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className="input" {...register("email")} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="input"
            {...register("password")}
          />
        </Field>

        {formError && (
          <p className="text-sm font-medium text-ember dark:text-emberlight" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
