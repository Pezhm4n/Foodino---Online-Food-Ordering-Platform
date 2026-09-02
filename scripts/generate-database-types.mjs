import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputPath = resolve('src/infrastructure/supabase/database.types.ts');
const result = spawnSync(
  process.execPath,
  [
    resolve('node_modules/supabase/dist/supabase.js'),
    'gen', 'types', 'typescript', '--local', '--schema', 'public', '--schema', 'api',
  ],
  { encoding: 'utf8' },
);

if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout || result.error?.message || 'Supabase type generation failed.');
  process.exit(result.status ?? 1);
}

const generated = `${result.stdout.replace(/\r\n/g, '\n').trimEnd()}\n`;
if (process.argv.includes('--check')) {
  const current = readFileSync(outputPath, 'utf8').replace(/\r\n/g, '\n');
  if (current !== generated) {
    process.stderr.write('Generated Supabase types are out of date. Run npm run db:types.\n');
    process.exit(1);
  }
} else {
  mkdirSync(resolve('src/infrastructure/supabase'), { recursive: true });
  writeFileSync(outputPath, generated, 'utf8');
  process.stdout.write(`Wrote ${outputPath}\n`);
}
