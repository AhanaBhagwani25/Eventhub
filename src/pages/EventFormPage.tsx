import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { EventWithCount } from "../lib/types";
import { CATEGORIES, toInputDateTime } from "../lib/utils";
import { EmptyState, Field, Spinner } from "../components/ui";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Keep the title under 120 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Describe the event in at least 10 characters")
    .max(2000, "Keep the description under 2000 characters"),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: "Choose a category" }) }),
  location: z.string().trim().min(2, "Enter where the event takes place"),
  starts_at: z.string().min(1, "Choose a date and time"),
  capacity: z
    .number({ invalid_type_error: "Enter the number of seats" })
    .int("Use a whole number")
    .min(1, "Add at least 1 seat"),
  price: z
    .number({ invalid_type_error: "Enter a price (0 for free)" })
    .min(0, "Price can't be negative"),
  image_url: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "Enter a full link starting with https://"),
});
type FormValues = z.infer<typeof schema>;

export default function EventFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [forbidden, setForbidden] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "Tech",
      location: "",
      starts_at: "",
      capacity: 50,
      price: 0,
      image_url: "",
    },
  });

  // In edit mode, load the event and fill the form.
  useEffect(() => {
    if (!isEdit || !id || !user) return;
    supabase
      .from("events_with_counts")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        const e = data as EventWithCount | null;
        if (!e || e.organizer_id !== user.id) {
          setForbidden(true);
        } else {
          setRegisteredCount(e.registered_count);
          reset({
            title: e.title,
            description: e.description,
            category: e.category as FormValues["category"],
            location: e.location,
            starts_at: toInputDateTime(e.starts_at),
            capacity: e.capacity,
            price: Number(e.price),
            image_url: e.image_url ?? "",
          });
        }
        setLoading(false);
      });
  }, [id, user?.id]);

  async function onSubmit(v: FormValues) {
    if (!user) return;
    setFormError(null);

    const startsAt = new Date(v.starts_at);
    if (!isEdit && startsAt.getTime() < Date.now()) {
      setError("starts_at", { message: "Choose a date in the future" });
      return;
    }
    if (isEdit && v.capacity < registeredCount) {
      setError("capacity", {
        message: `${registeredCount} people have already registered. Capacity can't go below that.`,
      });
      return;
    }

    const payload = {
      title: v.title,
      description: v.description,
      category: v.category,
      location: v.location,
      starts_at: startsAt.toISOString(),
      capacity: v.capacity,
      price: v.price,
      image_url: v.image_url || null,
    };

    const { error } = isEdit
      ? await supabase.from("events").update(payload).eq("id", id)
      : await supabase.from("events").insert({ ...payload, organizer_id: user.id });

    if (error) {
      setFormError(error.message);
      return;
    }
    toast(isEdit ? "Changes saved." : "Event published.");
    navigate("/dashboard");
  }

  if (loading) return <Spinner />;
  if (forbidden) {
    return (
      <div className="px-4 py-16">
        <EmptyState
          title="You can't edit this event"
          message="It doesn't exist, or it belongs to another organizer."
          action={
            <Link to="/dashboard" className="btn btn-primary">
              Back to dashboard
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to="/dashboard" className="muted text-sm font-medium underline underline-offset-4">
        Back to dashboard
      </Link>
      <h1 className="mt-3 text-3xl font-bold">{isEdit ? "Edit event" : "Create event"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <Field label="Title" htmlFor="title" error={errors.title?.message}>
          <input id="title" className="input" {...register("title")} />
        </Field>

        <Field label="Description" htmlFor="description" error={errors.description?.message}>
          <textarea id="description" rows={5} className="input" {...register("description")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" htmlFor="category" error={errors.category?.message}>
            <select id="category" className="input" {...register("category")}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date and time" htmlFor="starts_at" error={errors.starts_at?.message}>
            <input id="starts_at" type="datetime-local" className="input" {...register("starts_at")} />
          </Field>
        </div>

        <Field label="Location" htmlFor="location" error={errors.location?.message}>
          <input id="location" className="input" {...register("location")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Seats" htmlFor="capacity" error={errors.capacity?.message}>
            <input
              id="capacity"
              type="number"
              min={1}
              className="input"
              {...register("capacity", { valueAsNumber: true })}
            />
          </Field>
          <Field label="Price in rupees" htmlFor="price" error={errors.price?.message} hint="Enter 0 for a free event.">
            <input
              id="price"
              type="number"
              min={0}
              step="1"
              className="input"
              {...register("price", { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field
          label="Image link (optional)"
          htmlFor="image_url"
          error={errors.image_url?.message}
          hint="Paste a link to a banner image. Without one, a banner designed for the category is used."
        >
          <input id="image_url" type="url" className="input" placeholder="https://" {...register("image_url")} />
        </Field>

        {formError && (
          <p className="text-sm font-medium text-ember dark:text-emberlight" role="alert">
            {formError}
          </p>
        )}

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Publish event"}
          </button>
          <Link to="/dashboard" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
