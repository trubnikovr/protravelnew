import {i18n, supportedLanguages} from '../src/shared/i18n';
import {resources} from '../src/shared/i18n/resources';

test('ships only the Russian locale', () => {
  expect(Object.keys(resources)).toEqual(['ru']);
  expect(supportedLanguages).toEqual([{code: 'ru', label: 'Русский'}]);
});

test('uses Russian as the active application language', async () => {
  await i18n.changeLanguage('ru');
  expect(i18n.t('tabs.home')).toBe('Главная');
});
