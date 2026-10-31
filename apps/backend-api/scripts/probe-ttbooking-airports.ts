import { resolve } from 'node:path';
import { config } from 'dotenv';
import {
  formatTtbookingTime,
  parseTtbookingId,
} from '../src/integrations/ttbooking/ttbooking-context';
import { createTtbookingSignature } from '../src/integrations/ttbooking/ttbooking-signature';

config({ path: resolve(__dirname, '../.env') });

const MOSCOW_AIRPORTS = ['SVO', 'DME', 'VKO', 'ZIA'] as const;
const destination = 'LED';

type DictionaryItem = { code: string; name: string };
type Route = {
  date: string;
  locationBegin: DictionaryItem;
  locationEnd: DictionaryItem;
};

function dateAfter(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.toISOString().slice(0, 10)}T00:00:00`;
}

function route(origin: string, target: string, days: number): Route {
  return {
    date: dateAfter(days),
    locationBegin: { code: origin, name: '' },
    locationEnd: { code: target, name: '' },
  };
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

async function search(label: string, routes: Route[]): Promise<void> {
  const agency = parseTtbookingId(required('TTBOOKING_AGENCY_ID'), 'agency');
  const user = parseTtbookingId(required('TTBOOKING_USER_ID'), 'user');
  const password = required('TTBOOKING_PASSWORD');
  const time = formatTtbookingTime();
  const response = await fetch(required('TTBOOKING_BASE_URL'), {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      context: {
        agency,
        user,
        time,
        hash: createTtbookingSignature({ agency, password, time, user }),
        locale: process.env.TTBOOKING_LOCALE || 'ru',
        command: 'SEARCHFR',
      },
      parameters: {
        route: routes,
        seats: [{ count: 1, passengerType: 'ADULT' }],
        serviceClass: 'ECONOMY',
        skipConnected: false,
        eticketsOnly: true,
        mixedVendors: true,
        preferredAirlines: [],
      },
    }),
    signal: AbortSignal.timeout(
      Number(process.env.TTBOOKING_TIMEOUT_MS || 60_000),
    ),
  });
  const body = (await response.json()) as Record<string, unknown>;
  const respond = body.respond as Record<string, unknown> | undefined;
  const groups = respond?.flightsGroup as Record<string, unknown> | undefined;
  const group = groups?.flightGroup;
  const groupCount = Array.isArray(group) ? group.length : group ? 1 : 0;
  const error = body.error ?? respond?.error ?? body.errors ?? null;
  console.log(JSON.stringify(respond, null, 2))
  process.stdout.write(
    `${JSON.stringify({ label, status: response.status, groupCount, error })}\n`,
  );
}

async function main(): Promise<void> {
  const mode =
    process.argv.find((item) => item.startsWith('--mode='))?.split('=')[1] ??
    'all';
  // if (mode === 'all' || mode === 'metropolitan') {
  //   await search('MOW ↔ LED (metropolitan code)', [
  //     route('MOW', destination, 14),
  //     route(destination, 'MOW', 21),
  //   ]);
  // }
  // if (mode === 'all' || mode === 'pairs') {
  //   for (const airport of MOSCOW_AIRPORTS) {
  //     await search(`${airport} ↔ LED (separate request)`, [
  //       route(airport, destination, 14),
  //       route(destination, airport, 21),
  //     ]);
  //   }
  // }
  if (mode === 'all' || mode === 'routes') {
    await search('SVO/DME/VKO/ZIA as route legs (experimental)', [
      ...MOSCOW_AIRPORTS.map((airport) => route(airport, destination, 14)),
      route(destination, 'SVO', 21),
    ]);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${JSON.stringify({ error: message })}\n`);
  process.exitCode = 1;
});
