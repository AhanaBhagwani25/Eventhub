# Interview notes for EventHub

Read through the code once, run the app, and try to explain each point below in your own words.
Reviewers usually ask "why did you do it this way?" more than "what does this do?".

## 30-second summary

"EventHub is a full-stack event platform. Attendees can search events and register for a seat.
Organizers can create and manage events from a dashboard. I used React with TypeScript on the
frontend and Supabase for authentication and the Postgres database. Access rules are enforced in the
database with Row Level Security, and the seat limit is enforced by a database trigger."

## Questions to be ready for

**How does authentication work?**
`AuthContext` calls `supabase.auth.getSession()` on load and listens with `onAuthStateChange`. When the
user changes, it loads their row from `profiles` (name and role). `ProtectedRoute` waits for that, then
redirects to login or checks the role.

**How do you stop an attendee from creating events?**
Two layers. The UI hides the dashboard link, and `ProtectedRoute role="organizer"` blocks the pages. The real protection
is the RLS insert policy on `events`, which checks the profile role in the database. UI checks alone
can be bypassed, so the database check is the one that matters.

**How do you stop overbooking?**
A `BEFORE INSERT` trigger on `registrations` locks the event row (`FOR UPDATE`), counts registrations
and raises an error when full. The lock means two people clicking at the same moment are handled one after the other.
The UI shows the error as a toast.

**Why a view for registration counts?**
RLS lets people see only their own registrations, so counting from the browser would give wrong numbers. The
view `events_with_counts` exposes only the count for each event.

**Why Zod and React Hook Form?**
Zod describes the rules once (types and messages), React Hook Form handles input state and errors with
fewer re-renders. `z.infer` gives the TypeScript type for free.

**How does search work?**
Filters live in the URL (`useSearchParams`), so links can be shared and the back button works. Typing is
debounced by 300ms. The query uses Supabase's `ilike` on title and location, and removes special characters first.

**What would you improve next?**
Image upload with Supabase Storage, email reminders, QR-code tickets, pagination, tests with Vitest and
React Testing Library, and a CI workflow that runs the type check and build.

## Be honest about

Know which parts you understand best and say so. If you used AI help for some code, be ready to say what it does and why you accepted it.
