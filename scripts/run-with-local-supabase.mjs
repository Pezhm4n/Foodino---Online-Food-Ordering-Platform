import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const status = spawnSync(
  process.execPath,
  [resolve('node_modules/supabase/dist/supabase.js'), 'status', '-o', 'env'],
  { encoding: 'utf8' },
);
if (status.status !== 0) {
  process.stderr.write(status.stderr || 'Local Supabase is unavailable.\n');
  process.exit(status.status ?? 1);
}

const values = Object.fromEntries(status.stdout.split(/\r?\n/).flatMap((line) => {
  const match = /^([A-Z_]+)=(.*)$/.exec(line);
  if (!match) return [];
  const rawValue = match[2];
  const value = rawValue.startsWith('"') && rawValue.endsWith('"')
    ? rawValue.slice(1, -1)
    : rawValue;
  return [[match[1], value]];
}));
const nextCommand = process.argv.slice(2);
if (nextCommand.length === 0) {
  process.stderr.write('Usage: node scripts/run-with-local-supabase.mjs <command> [...args]\n');
  process.exit(2);
}
const portFlag = nextCommand.findIndex((argument) => argument === '--port' || argument === '-p');
const localPort = portFlag >= 0 ? nextCommand[portFlag + 1] : '3000';

const child = spawn(nextCommand[0], nextCommand.slice(1), {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    APP_URL: process.env.APP_URL ?? `http://127.0.0.1:${localPort}`,
    SUPABASE_URL: values.API_URL,
    SUPABASE_PUBLISHABLE_KEY: values.PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: values.SECRET_KEY,
    PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER ?? 'development',
    PAYMENT_CALLBACK_SECRET: process.env.PAYMENT_CALLBACK_SECRET ?? 'local-development-callback-secret-32chars',
    SMTP_CONFIGURED: process.env.SMTP_CONFIGURED ?? 'false',
  },
});
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
