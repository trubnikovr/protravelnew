import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const generatedVersionDirectory = fileURLToPath(
  new URL('../src/shared/api/generated/v1', import.meta.url),
);

rmSync(generatedVersionDirectory, { force: true, recursive: true });
