import { SupportedLocale } from '@shared/domain/enums';

const messages: Record<SupportedLocale, Record<string, string>> = {
  [SupportedLocale.RU]: {
    HTTP_400: 'Некорректный запрос',
    HTTP_401: 'Требуется авторизация',
    HTTP_403: 'Недостаточно прав для выполнения операции',
    HTTP_404: 'Ресурс не найден',
    HTTP_409: 'Конфликт с текущим состоянием ресурса',
    HTTP_422: 'Запрос не может быть обработан',
    HTTP_429: 'Слишком много запросов',
    HTTP_500: 'Внутренняя ошибка сервера',
    FLIGHT_SEARCH_INVALID: 'Параметры поиска авиабилетов некорректны',
    FLIGHT_SEARCH_ADULT_REQUIRED: 'Для поиска нужен хотя бы один взрослый',
    FLIGHT_SEARCH_INFANTS_EXCEED_ADULTS:
      'Количество младенцев не может превышать количество взрослых',
    FLIGHT_SEARCH_PASSENGER_LIMIT_EXCEEDED:
      'В одном поиске может быть не более 9 пассажиров',
    FLIGHT_SEARCH_SAME_AIRPORT:
      'Аэропорты отправления и назначения должны отличаться',
    FLIGHT_SEARCH_DATE_INVALID: 'Дата вылета указана неверно',
    FLIGHT_SEARCH_DATE_IN_PAST: 'Дата вылета не может быть в прошлом',
    FLIGHT_SEARCH_DATES_NOT_CHRONOLOGICAL:
      'Даты маршрута должны идти в хронологическом порядке',
    FLIGHT_PROVIDER_UNAVAILABLE:
      'Сервис поиска авиабилетов временно недоступен',
    FLIGHT_PROVIDER_TIMEOUT: 'Поиск авиабилетов занял слишком много времени',
    FLIGHT_PROVIDER_RATE_LIMITED:
      'Сервис поиска временно ограничил количество запросов',
    FLIGHT_PROVIDER_AUTH_FAILED: 'Ошибка подключения к поставщику авиабилетов',
    FLIGHT_OFFER_UNAVAILABLE: 'Предложение больше недоступно',
    FLIGHT_BOOKING_FAILED: 'Не удалось создать бронирование авиабилета',
    FLIGHT_OFFER_NOT_FOUND: 'Предложение авиабилета не найдено',
  },
  [SupportedLocale.UZ]: {
    HTTP_400: "So'rov noto'g'ri",
    HTTP_401: 'Avtorizatsiya talab qilinadi',
    HTTP_403: 'Amalni bajarish uchun huquqlar yetarli emas',
    HTTP_404: 'Resurs topilmadi',
    HTTP_409: 'Resursning joriy holati bilan ziddiyat yuz berdi',
    HTTP_422: "So'rovni qayta ishlab bo'lmaydi",
    HTTP_429: "So'rovlar soni juda ko'p",
    HTTP_500: 'Serverning ichki xatosi',
    FLIGHT_SEARCH_INVALID: "Aviachiptalarni qidirish parametrlari noto'g'ri",
    FLIGHT_SEARCH_ADULT_REQUIRED:
      "Qidiruv uchun kamida bitta katta yo'lovchi kerak",
    FLIGHT_SEARCH_INFANTS_EXCEED_ADULTS:
      "Chaqaloqlar soni katta yo'lovchilar sonidan oshmasligi kerak",
    FLIGHT_SEARCH_PASSENGER_LIMIT_EXCEEDED:
      "Bitta qidiruvda 9 nafardan ortiq yo'lovchi bo'lishi mumkin emas",
    FLIGHT_SEARCH_SAME_AIRPORT:
      "Jo'nash va borish aeroportlari har xil bo'lishi kerak",
    FLIGHT_SEARCH_DATE_INVALID: "Uchish sanasi noto'g'ri ko'rsatilgan",
    FLIGHT_SEARCH_DATE_IN_PAST: "Uchish sanasi o'tmishda bo'lishi mumkin emas",
    FLIGHT_SEARCH_DATES_NOT_CHRONOLOGICAL:
      'Yo‘nalish sanalari xronologik tartibda bo‘lishi kerak',
    FLIGHT_PROVIDER_UNAVAILABLE:
      'Aviachiptalarni qidirish xizmati vaqtincha ishlamayapti',
    FLIGHT_PROVIDER_TIMEOUT: "Aviachiptalarni qidirish juda ko'p vaqt oldi",
    FLIGHT_PROVIDER_RATE_LIMITED:
      "Qidiruv xizmati so'rovlar sonini vaqtincha chekladi",
    FLIGHT_PROVIDER_AUTH_FAILED:
      'Aviachiptalar yetkazib beruvchisiga ulanishda xatolik yuz berdi',
    FLIGHT_OFFER_UNAVAILABLE: 'Taklif endi mavjud emas',
    FLIGHT_BOOKING_FAILED: 'Aviachiptani bron qilib bo‘lmadi',
    FLIGHT_OFFER_NOT_FOUND: 'Aviachipta taklifi topilmadi',
  },
  [SupportedLocale.EN]: {
    HTTP_400: 'Invalid request',
    HTTP_401: 'Authentication required',
    HTTP_403: 'Insufficient permissions',
    HTTP_404: 'Resource not found',
    HTTP_409: 'Resource state conflict',
    HTTP_422: 'Request cannot be processed',
    HTTP_429: 'Too many requests',
    HTTP_500: 'Internal server error',
    FLIGHT_SEARCH_INVALID: 'Flight search parameters are invalid',
    FLIGHT_SEARCH_ADULT_REQUIRED:
      'At least one adult is required to search for flights',
    FLIGHT_SEARCH_INFANTS_EXCEED_ADULTS:
      'The number of infants cannot exceed the number of adults',
    FLIGHT_SEARCH_PASSENGER_LIMIT_EXCEEDED:
      'A flight search can include no more than 9 passengers',
    FLIGHT_SEARCH_SAME_AIRPORT:
      'Origin and destination airports must be different',
    FLIGHT_SEARCH_DATE_INVALID: 'The departure date is invalid',
    FLIGHT_SEARCH_DATE_IN_PAST: 'The departure date cannot be in the past',
    FLIGHT_SEARCH_DATES_NOT_CHRONOLOGICAL:
      'Route dates must be in chronological order',
    FLIGHT_PROVIDER_UNAVAILABLE:
      'The flight search service is temporarily unavailable',
    FLIGHT_PROVIDER_TIMEOUT: 'The flight search request timed out',
    FLIGHT_PROVIDER_RATE_LIMITED:
      'The flight search service temporarily limited requests',
    FLIGHT_PROVIDER_AUTH_FAILED: 'Could not connect to the flight provider',
    FLIGHT_OFFER_UNAVAILABLE: 'The flight offer is no longer available',
    FLIGHT_BOOKING_FAILED: 'Could not create the flight booking',
    FLIGHT_OFFER_NOT_FOUND: 'Flight offer not found',
  },
};

export function errorMessage(
  code: string,
  locale: SupportedLocale,
): string | null {
  return messages[locale][code] ?? messages[SupportedLocale.RU][code] ?? null;
}
