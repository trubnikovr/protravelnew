import type { FlightShareSnapshot } from '@modules/flights';
import { SupportedLocale } from '@shared/domain/enums';
import { flightBaggageLabel } from './flight-baggage-label.catalog';

function cabinClassLabel(value: string): string {
  return (
    {
      economy: 'Эконом',
      premium_economy: 'Премиум-эконом',
      business: 'Бизнес',
      first: 'Первый класс',
    }[value] ?? value
  );
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function amountLabel(amount: string, currency: string): string {
  const value = Number(amount) / 100;
  try {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${new Intl.NumberFormat('ru-RU', {
      maximumFractionDigits: 0,
    }).format(value)} ${escapeHtml(currency)}`;
  }
}

function dateLabel(value: string): string {
  const [year, month, day] = value.slice(0, 10).split('-');
  return year && month && day ? `${day}.${month}.${year}` : value;
}

function timeLabel(value: string): string {
  return value.slice(11, 16);
}

function locationLabel(location: { code: string; name: string }): string {
  return location.name
    ? `${escapeHtml(location.name)} (${escapeHtml(location.code)})`
    : escapeHtml(location.code);
}

function durationLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours && remainingMinutes) return `${hours} ч ${remainingMinutes} мин`;
  if (hours) return `${hours} ч`;
  return `${remainingMinutes} мин`;
}

export function renderFlightSharePage(snapshot: FlightShareSnapshot): string {
  const firstSegment = snapshot.itineraries[0]?.segments[0];
  const lastSegment = snapshot.itineraries[0]?.segments.at(-1);
  const routeTitle =
    firstSegment && lastSegment
      ? `${firstSegment.origin.name || firstSegment.origin.code} — ${
          lastSegment.destination.name || lastSegment.destination.code
        }`
      : 'Авиабилет';
  const title = `${routeTitle} — ProTravel`;
  const description = `Информация о рейсе ${routeTitle}. Цена и наличие могут измениться.`;
  const itineraryHtml = snapshot.itineraries
    .map((itinerary, itineraryIndex) => {
      const label =
        snapshot.itineraries.length > 1
          ? snapshot.itineraries.length === 2
            ? itineraryIndex === 0
              ? 'Туда'
              : 'Обратно'
            : `Маршрут ${itineraryIndex + 1}`
          : 'Рейс';
      const first = itinerary.segments[0];
      const last = itinerary.segments.at(-1);
      const endpoints =
        first && last
          ? `<div class="route"><div><span class="time">${escapeHtml(
              timeLabel(first.departureLocal),
            )}</span><span class="place">${locationLabel(
              first.origin,
            )}</span><span class="date">${escapeHtml(
              dateLabel(first.departureLocal),
            )}</span></div><span class="arrow">→</span><div><span class="time">${escapeHtml(
              timeLabel(last.arrivalLocal),
            )}</span><span class="place">${locationLabel(
              last.destination,
            )}</span><span class="date">${escapeHtml(
              dateLabel(last.arrivalLocal),
            )}</span></div></div>`
          : '';
      const segments = itinerary.segments
        .map(
          (segment, segmentIndex) =>
            `<div class="segment"><div class="segment-top"><strong>${escapeHtml(
              timeLabel(segment.departureLocal),
            )} — ${escapeHtml(
              timeLabel(segment.arrivalLocal),
            )}</strong><span>${escapeHtml(
              durationLabel(segment.durationMinutes),
            )}</span></div><div class="segment-route"><span>${locationLabel(
              segment.origin,
            )}</span><span class="arrow">→</span><span>${locationLabel(
              segment.destination,
            )}</span></div><div class="segment-meta">${escapeHtml(
              `${
                segment.carrierName || segment.carrierCode
              } · ${cabinClassLabel(segment.cabinClass)}`,
            )} · ${escapeHtml(segment.flightNumber)} · ${escapeHtml(
              flightBaggageLabel(segment.baggage, SupportedLocale.RU),
            )}</div>${
              segmentIndex < itinerary.segments.length - 1
                ? '<div class="connection">Пересадка</div>'
                : ''
            }</div>`,
        )
        .join('');
      return `<section class="itinerary"><div class="section-title"><h2>${label}</h2><span>${escapeHtml(
        durationLabel(itinerary.durationMinutes),
      )}</span></div>${endpoints}${segments}</section>`;
    })
    .join('');

  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(
    title,
  )}"><meta property="og:description" content="${escapeHtml(
    description,
  )}"><meta name="description" content="${escapeHtml(
    description,
  )}"><title>${escapeHtml(title)}</title><style>
:root{color-scheme:light;--ink:#202a3d;--muted:#667085;--purple:#7554e8;--line:#e8eaf0;--paper:#fff;--back:#f6f8fc}*{box-sizing:border-box}body{margin:0;background:var(--back);color:var(--ink);font:16px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.page{max-width:760px;margin:0 auto;padding:24px 16px 48px}.brand{font-weight:800;color:var(--purple);letter-spacing:.04em;font-size:14px;margin:4px 0 22px}.card{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:22px;margin:0 0 14px;box-shadow:0 6px 24px rgba(38,51,77,.06)}.hero{background:linear-gradient(135deg,#7554e8,#9c83f1);color:white;border:0}.eyebrow{font-size:13px;opacity:.82}.hero h1{font-size:27px;line-height:1.2;margin:8px 0 18px}.route{display:flex;align-items:center;gap:18px}.route>div{display:flex;flex:1;flex-direction:column;min-width:0}.time{font-size:24px;font-weight:750}.place{font-size:14px;margin-top:3px}.date{font-size:12px;opacity:.8;margin-top:3px}.arrow{font-size:22px;opacity:.65}.airline{margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.25);font-size:14px}.section-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.section-title h2{font-size:17px;margin:0}.section-title span,.segment-top span{font-size:13px;color:var(--muted)}.segment{border-top:1px solid var(--line);padding:14px 0 4px}.segment-top,.segment-route{display:flex;align-items:center;justify-content:space-between;gap:10px}.segment-route{font-size:14px;margin-top:8px}.segment-meta{color:var(--muted);font-size:13px;margin-top:8px}.connection{font-size:12px;color:var(--purple);padding:12px 0 0}.price-label{font-size:13px;color:var(--muted)}.price{font-size:26px;font-weight:750;margin-top:4px}.notice{font-size:13px;color:var(--muted);margin:12px 0 0}.share-hint{text-align:center;color:var(--muted);font-size:12px;margin-top:18px}@media(max-width:420px){.card{padding:18px}.hero h1{font-size:23px}.route{gap:10px}.time{font-size:21px}.place{font-size:13px}}
</style></head><body><main class="page"><div class="brand">PROTRAVEL</div><section class="card hero"><div class="eyebrow">Поделились рейсом</div><h1>${escapeHtml(
    routeTitle,
  )}</h1>${
    firstSegment && lastSegment
      ? `<div class="route"><div><span class="time">${escapeHtml(
          timeLabel(firstSegment.departureLocal),
        )}</span><span class="place">${locationLabel(
          firstSegment.origin,
        )}</span><span class="date">${escapeHtml(
          dateLabel(firstSegment.departureLocal),
        )}</span></div><span class="arrow">→</span><div><span class="time">${escapeHtml(
          timeLabel(lastSegment.arrivalLocal),
        )}</span><span class="place">${locationLabel(
          lastSegment.destination,
        )}</span><span class="date">${escapeHtml(
          dateLabel(lastSegment.arrivalLocal),
        )}</span></div></div>`
      : ''
  }<div class="airline">${escapeHtml(
    snapshot.airlineName || snapshot.airlineCode,
  )}</div></section>${itineraryHtml}<section class="card"><div class="price-label">Стоимость на момент отправки</div><div class="price">${amountLabel(
    snapshot.totalAmount,
    snapshot.currency,
  )}</div><p class="notice">Цена и наличие мест могут измениться. Актуальные условия подтвердятся при оформлении билета.</p></section><div class="share-hint">Информация о рейсе · ProTravel</div></main></body></html>`;
}

export function renderUnavailableFlightSharePage(): string {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Ссылка недоступна — ProTravel</title><style>body{margin:0;background:#f6f8fc;color:#202a3d;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:grid;min-height:100vh;place-items:center}.card{background:#fff;border:1px solid #e8eaf0;border-radius:18px;padding:28px;max-width:420px;margin:20px;text-align:center}.brand{color:#7554e8;font-weight:800;letter-spacing:.04em;font-size:14px}h1{font-size:22px;margin:20px 0 8px}p{color:#667085;margin:0}</style></head><body><main class="card"><div class="brand">PROTRAVEL</div><h1>Ссылка недоступна</h1><p>Срок действия ссылки истёк или она была скопирована неверно.</p></main></body></html>`;
}
