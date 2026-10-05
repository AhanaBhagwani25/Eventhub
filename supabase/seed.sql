-- Sample events so you can test the app (16 events, every category covered).
--
-- 1. Run supabase/schema.sql first.
-- 2. In the app, sign up with the "Host events" (organizer) option.
-- 3. Paste this whole file into the Supabase SQL Editor and click Run.
--
-- It uses the first organizer account it finds. It is safe to run twice:
-- an event whose title already exists is skipped. Dates are relative to
-- today, so the events always show up as upcoming.

do $$
declare
  org uuid;
begin
  select id into org from public.profiles where role = 'organizer' limit 1;
  if org is null then
    raise exception 'Sign up an organizer account in the app first, then run this seed.';
  end if;

  insert into public.events (organizer_id, title, description, category, location, starts_at, capacity, price)
  select org, v.title, v.description, v.category, v.location, v.starts_at, v.capacity, v.price
  from (values
    -- Tech
    ('Web Dev Hackathon',
     'Build and demo a web project in 24 hours. Teams of up to four. Prizes for the best design, best idea and best use of an API.',
     'Tech', 'Innovation Centre', date_trunc('hour', now()) + interval '14 days 2 hours', 120, 250),
    ('AI and Machine Learning Meetup',
     'Short talks on real projects using machine learning, followed by open discussion. Beginners are welcome.',
     'Tech', 'Seminar Hall, Block A', date_trunc('hour', now()) + interval '6 days 4 hours', 90, 0),

    -- Music
    ('Open Mic Night',
     'Sing, play, recite or just listen. Sign up at the door to perform a five minute slot. Chai and snacks available.',
     'Music', 'Amphitheatre', date_trunc('hour', now()) + interval '5 days 6 hours', 150, 100),
    ('Unplugged Evening: Acoustic Sessions',
     'An evening of acoustic sets from campus bands, with lights, cushions and cold coffee on the lawn.',
     'Music', 'Central Lawn', date_trunc('hour', now()) + interval '12 days 7 hours', 200, 150),

    -- Sports
    ('Inter-College Football Cup',
     'Quarter-finals of the annual cup. Teams from six colleges compete for the trophy. Entry is free for students with an ID card.',
     'Sports', 'University Ground', date_trunc('hour', now()) + interval '8 days 3 hours', 300, 0),
    ('Sunrise 5K Fun Run',
     'A relaxed 5 km run around the campus loop. Water, bananas and a finisher medal for everyone.',
     'Sports', 'Main Gate', date_trunc('hour', now()) + interval '9 days', 250, 50),

    -- Workshop
    ('Intro to React Workshop',
     'A hands-on session where you build a small app from scratch. We cover components, props, state and hooks. Bring a laptop with Node.js installed.',
     'Workshop', 'Computer Lab 2, Main Block', date_trunc('hour', now()) + interval '3 days 1 hour', 40, 0),
    ('Git and GitHub for Beginners',
     'Learn commits, branches, pull requests and how to put your first project on GitHub. Bring a laptop.',
     'Workshop', 'Computer Lab 1, Main Block', date_trunc('hour', now()) + interval '11 days 2 hours', 50, 0),

    -- Arts
    ('Poster and Sketch Exhibition',
     'Student artwork from first-year to final-year, with a live sketching corner. Walk in any time during the day.',
     'Arts', 'Central Gallery', date_trunc('hour', now()) + interval '16 days 1 hour', 200, 0),
    ('Small-Group Photography Walk',
     'A guided walk around the old city with a working photographer. Only three spots, so book early.',
     'Arts', 'Clock Tower Square', date_trunc('hour', now()) + interval '4 days', 3, 200),

    -- Career
    ('Resume and Interview Clinic',
     'Alumni working in software review your resume one-on-one and run short mock interviews. Bring a printed copy of your resume.',
     'Career', 'Seminar Hall, Block B', date_trunc('hour', now()) + interval '10 days 3 hours', 60, 0),
    ('Campus Placement Prep Talk',
     'Recruiters explain what they look for in aptitude tests, technical rounds and HR rounds, with time for questions.',
     'Career', 'Auditorium', date_trunc('hour', now()) + interval '7 days 5 hours', 400, 0),

    -- Social
    ('Freshers Meet',
     'Games, quizzes and an introduction to all campus clubs. A friendly way to meet people from other departments.',
     'Social', 'Student Activity Centre', date_trunc('hour', now()) + interval '20 days 4 hours', 250, 50),
    ('Board Games and Chai Night',
     'Bring a friend or come alone. Chess, Ludo, Uno and many more games, plus chai and snacks.',
     'Social', 'Common Room', date_trunc('hour', now()) + interval '2 days 8 hours', 40, 30),

    -- Past events (use the "Past" filter on the Events page to see these)
    ('Welcome Back Bash',
     'The semester kick-off party with music, food and club stalls.',
     'Social', 'Student Activity Centre', date_trunc('hour', now()) - interval '9 days', 200, 0),
    ('Intro to Python Workshop',
     'A beginner-friendly session on Python basics, with exercises you can finish in class.',
     'Workshop', 'Computer Lab 3, Main Block', date_trunc('hour', now()) - interval '15 days', 40, 0)
  ) as v(title, description, category, location, starts_at, capacity, price)
  where not exists (select 1 from public.events e where e.title = v.title);
end $$;
