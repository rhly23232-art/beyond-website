import 'server-only';
import postgres from 'postgres';
import type { ContactPayload } from '@/lib/contact';

/**
 * Postgres storage for contact inquiries. Works with any Postgres provider
 * (Neon, Supabase, Railway, RDS, local) through DATABASE_URL.
 * The table is created automatically on first use (see db/schema.sql).
 */

type Sql = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as { __beyondSql?: Sql; __beyondSchema?: Promise<void> };

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getSql(): Sql {
  if (!globalForDb.__beyondSql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    const local = /localhost|127\.0\.0\.1/.test(url);
    globalForDb.__beyondSql = postgres(url, {
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false, // compatible with transaction poolers (Supabase / PgBouncer)
      ssl: local ? false : url.includes('sslmode=') ? undefined : 'require',
      onnotice: () => {},
    });
  }
  return globalForDb.__beyondSql;
}

export const SCHEMA_SQL = `
create table if not exists contact_submissions (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  name        text        not null,
  email       text        not null,
  phone       text,
  services    text[]      not null default '{}',
  message     text        not null,
  status      text        not null default 'new',
  ip_hash     text,
  user_agent  text
);
create index if not exists contact_submissions_created_at_idx on contact_submissions (created_at desc);
`;

function ensureSchema() {
  if (!globalForDb.__beyondSchema) {
    const sql = getSql();
    globalForDb.__beyondSchema = sql.unsafe(SCHEMA_SQL).then(() => undefined);
    globalForDb.__beyondSchema.catch(() => {
      globalForDb.__beyondSchema = undefined; // retry on the next request
    });
  }
  return globalForDb.__beyondSchema;
}

export async function insertSubmission(
  data: ContactPayload,
  meta: { ipHash?: string; userAgent?: string },
): Promise<number> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    insert into contact_submissions (name, email, phone, services, message, ip_hash, user_agent)
    values (
      ${data.name},
      ${data.email},
      ${data.phone || null},
      ${data.services as string[]},
      ${data.message},
      ${meta.ipHash ?? null},
      ${meta.userAgent?.slice(0, 300) ?? null}
    )
    returning id
  `;
  return Number(rows[0].id);
}

export type SubmissionRow = {
  id: number;
  created_at: Date;
  name: string;
  email: string;
  phone: string | null;
  services: string[];
  message: string;
  status: string;
};

export async function listSubmissions(limit = 200): Promise<SubmissionRow[]> {
  await ensureSchema();
  const sql = getSql();
  return sql<SubmissionRow[]>`
    select id, created_at, name, email, phone, services, message, status
    from contact_submissions
    order by created_at desc
    limit ${limit}
  `;
}

export async function updateSubmissionStatus(id: number, status: 'new' | 'handled') {
  await ensureSchema();
  const sql = getSql();
  await sql`update contact_submissions set status = ${status} where id = ${id}`;
}
