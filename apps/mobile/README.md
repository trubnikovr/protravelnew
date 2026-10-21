# ProTravel

Мобильное приложение на React Native с TypeScript и React Navigation.

## Стек

- React Native 0.86.2
- React 19.2.3
- React Navigation 7 (`native-stack` + bottom tabs)
- Lucide icons and `react-native-svg`
- i18next and react-i18next (`ru`, `uz-Latn`, `en`)
- New Architecture и Hermes
- iOS 15.1+ и Android 7.0+ (API 24)

## Подготовка окружения

Проект использует Node.js 24, зафиксированный в корневом `.nvmrc`. Команды
ниже запускаются из корня monorepo:

```sh
nvm install
nvm use
npm install
```

Для iOS после изменения нативных зависимостей:

```sh
cd apps/mobile/ios
pod install
cd ../../..
```

Для Android нужен JDK 17. Команда `npm run mobile:android` проверяет версию и
на macOS автоматически находит установленную JDK 17 через `java_home`. На
других системах укажите путь к JDK 17 через `JAVA_HOME`. Для ручного выбора на
macOS используется:

```sh
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

## Запуск

Сначала запустите Metro (Android-команда намеренно не открывает новое окно
терминала):

```sh
npm run mobile:start
```

Затем в другом терминале:

```sh
npm run mobile:ios
# или
npm run mobile:android
```

## Проверки

```sh
npm run typecheck
npm run lint
npm test -- --runInBand --watchman=false
```

## Структура

- `src/app` — запуск приложения и типизированная навигация;
- `src/features` — экраны и UI, сгруппированные по возможностям продукта;
- `src/shared` — единая тема, переиспользуемый UI и дизайн-ассеты;
- `../../docs/mobile` — архитектура, дизайн-система и описание экранов.

Визуальный источник — `design/Travel Mobile App.pdf`, исходные изображения
извлечены из `design/Travel Mobile App.fig`. Все цвета, шрифты, размеры и
интервалы собраны в
`src/shared/theme/theme.ts`. Правила разработки описаны в `AGENTS.md`.

Язык интерфейса определяется по локали устройства и меняется в
«Профиль → Настройки». Словари находятся в
`src/shared/i18n/resources.ts`.
