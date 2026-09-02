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

const isWindows = process.platform === 'win32';
const command = isWindows && (nextCommand[0] === 'npm' || nextCommand[0] === 'npx')
  ? `${nextCommand[0]}.cmd`
  : nextCommand[0];
const isBatchFile = isWindows && (command.endsWith('.cmd') || command.endsWith('.bat'));

const isProduction = process.env.NODE_ENV === 'production' || nextCommand.some((argument) => argument === 'build' || argument === 'start');

const child = spawn(command, nextCommand.slice(1), {
  stdio: 'inherit',
  shell: isBatchFile,
  env: {
    ...process.env,
    APP_URL: process.env.APP_URL ?? `http://127.0.0.1:${localPort}`,
    SUPABASE_URL: values.API_URL,
    SUPABASE_PUBLISHABLE_KEY: values.PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: values.SECRET_KEY,
    PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER ?? (isProduction ? 'disabled' : 'development'),
    PAYMENT_CALLBACK_SECRET: process.env.PAYMENT_CALLBACK_SECRET ?? 'local-development-callback-secret-32chars',
    RATE_LIMIT_ADAPTER: process.env.RATE_LIMIT_ADAPTER ?? (isProduction ? 'trusted-reverse-proxy' : undefined),
    SMTP_CONFIGURED: process.env.SMTP_CONFIGURED ?? (isProduction ? 'true' : 'false'),
  },
});
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
