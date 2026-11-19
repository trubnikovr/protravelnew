import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';

const services = [
  { name: 'backend', args: ['run', 'backend:dev'] },
  { name: 'dashboard', args: ['run', 'dashboard:dev'] },
];
const children = new Set();
let stopping = false;

function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) {
    if (!child.pid) continue;
    if (process.platform === 'win32') child.kill();
    else {
      try { process.kill(-child.pid, 'SIGTERM'); } catch (error) {
        if (error.code !== 'ESRCH') throw error;
      }
    }
  }
}

for (const { name, args } of services) {
  const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, {
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  children.add(child);
  for (const [stream, output] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
    createInterface({ input: stream }).on('line', line => output.write(`[${name}] ${line}\n`));
  }
  child.on('error', error => {
    console.error(`[${name}] ${error.message}`);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    children.delete(child);
    if (!stopping) {
      console.error(`[${name}] завершился (${signal ?? code}); останавливаем остальные сервисы`);
      stop(code || 1);
    }
  });
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
