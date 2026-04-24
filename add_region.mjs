import pg from 'pg';
const { Client } = pg;
const client = new Client('postgresql://postgres:QPlGXimX2bcI5ONq@db.ukoadhiwpsepxknpzyvv.supabase.co:5432/postgres');
await client.connect();
await client.query("ALTER TABLE public.diagnostics ADD COLUMN IF NOT EXISTS region text DEFAULT 'BR'");
console.log('Success');
await client.end();
