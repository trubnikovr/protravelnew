import { execFileSync, spawnSync } from 'node:child_process';
import process from 'node:process';

const REQUIRED_JAVA_MAJOR = 17;

function readJavaMajor(javaHome) {
  const javaExecutable = javaHome
    ? `${javaHome}/bin/java`
    : process.platform === 'win32'
      ? 'java.exe'
      : 'java';

  const result = spawnSync(javaExecutable, ['-version'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return parseJavaMajor(`${result.stdout ?? ''}${result.stderr ?? ''}`);
}

function parseJavaMajor(output) {
  const version = output.match(/version\s+"([^"]+)"/)?.[1];
  if (!version) return null;
  const normalized = version.startsWith('1.') ? version.slice(2) : version;
  return Number.parseInt(normalized, 10);
}

function resolveJavaHome() {
  if (readJavaMajor(process.env.JAVA_HOME) === REQUIRED_JAVA_MAJOR) {
    return process.env.JAVA_HOME;
  }

  if (process.platform === 'darwin') {
    try {
      return execFileSync('/usr/libexec/java_home', [
        '-v',
        String(REQUIRED_JAVA_MAJOR),
      ], {
        encoding: 'utf8',
      }).trim();
    } catch {
      // The actionable error below is shared by every platform.
    }
  }

  if (readJavaMajor() === REQUIRED_JAVA_MAJOR) return undefined;

  throw new Error(
    `Android requires JDK ${REQUIRED_JAVA_MAJOR}. Set JAVA_HOME to a JDK ${REQUIRED_JAVA_MAJOR} installation.`,
  );
}

const javaHome = resolveJavaHome();
const reactNativeExecutable =
  process.platform === 'win32' ? 'react-native.cmd' : 'react-native';
const forwardedArguments = process.argv.slice(2);
const result = spawnSync(
  reactNativeExecutable,
  ['run-android', '--no-packager', ...forwardedArguments],
  {
    env: {
      ...process.env,
      ...(javaHome ? { JAVA_HOME: javaHome } : {}),
    },
    stdio: 'inherit',
  },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
