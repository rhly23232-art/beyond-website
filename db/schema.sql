-- BEYOND — contact inquiries
-- The app creates this table automatically on the first submission.
-- Run it manually only if your database user lacks CREATE privileges.

create table if not exists contact_submissions (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  name        text        not null,
  email       text        not null,
  phone       text,
  services    text[]      not null default '{}',
  message     text        not null,
  status      text        not null default 'new',   -- 'new' | 'handled'
  ip_hash     text,                                  -- salted SHA-256, never the raw IP
  user_agent  text
);

create index if not exists contact_submissions_created_at_idx
  on contact_submissions (created_at desc);
