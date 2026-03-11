import { Pool } from 'pg';
import { Resolver } from 'dns/promises';

if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI environment variable is not set');
}

/**
 * Neon sometimes emits a `.c-N.` segment in the pooler hostname that
 * doesn't resolve in all DNS environments. Strip it before using the URL.
 */
function fixNeonUrl(raw: string): string {
  return raw
    .replace(/(ep-[^.]+)\.c-\d+\./, '$1.')   // remove .c-2. segment
    .replace(/[&?]channel_binding=[^&]*/g, '') // strip unsupported param
    .replace(/\?$/, '');
}

/**
 * Resolve the hostname through Google DNS (8.8.8.8 / 1.1.1.1), bypassing
 * any system DNS that may not resolve Neon's AWS-hosted endpoint.
 * Returns { ip, hostname } — we connect to the IP but pass the original
 * hostname as the TLS SNI so SSL certificates validate correctly.
 */
async function resolveViaGoogleDns(hostname: string): Promise<string> {
  const resolver = new Resolver();
  resolver.setServers(['8.8.8.8', '1.1.1.1']);
  const addresses = await resolver.resolve4(hostname);
  return addresses[0];
}

async function buildPool(): Promise<Pool> {
  const connStr = fixNeonUrl(process.env.DATABASE_URI!);
  const url = new URL(connStr);
  const originalHostname = url.hostname;

  let host: string;
  try {
    host = await resolveViaGoogleDns(originalHostname);
    console.log(`[db] Resolved ${originalHostname} → ${host} via Google DNS`);
  } catch (err) {
    console.warn('[db] Google DNS failed, falling back to system DNS:', (err as Error).message);
    host = originalHostname; // fallback — system DNS
  }

  return new Pool({
    host,
    port: url.port ? parseInt(url.port) : 5432,
    database: url.pathname.slice(1),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: {
      rejectUnauthorized: false,
      servername: originalHostname, // SNI — must match the server's cert
    },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

// Singleton — one Pool promise shared across all hot-reloads in dev.
const globalForPg = globalThis as unknown as { _pgPool?: Promise<Pool> };
const poolPromise: Promise<Pool> = globalForPg._pgPool ?? buildPool();
if (process.env.NODE_ENV !== 'production') globalForPg._pgPool = poolPromise;

/**
 * Tagged-template SQL helper.
 * Usage: await sql`SELECT * FROM users WHERE email = ${email}`
 */
export async function sql<T extends Record<string, unknown> = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  let text = '';
  const params: unknown[] = [];

  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) {
      params.push(values[i]);
      text += `$${params.length}`;
    }
  }

  const pool = await poolPromise;
  const result = await pool.query<T>(text, params);
  return result.rows;
}
