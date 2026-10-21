import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, type Theme } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/app/navigation/AppNavigator';
import { i18n } from './src/shared/i18n';
import { theme } from './src/shared/theme/theme';
import { AuthSessionProvider } from './src/features/auth';
import { ServerStateProvider } from './src/app/providers/ServerStateProvider';

const navigationTheme: Theme = {
  dark: false,
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.danger,
  },
  fonts: {
    regular: {
      fontFamily: theme.fonts.regular,
      fontWeight: theme.fonts.weights.regular,
    },
    medium: {
      fontFamily: theme.fonts.medium,
      fontWeight: theme.fonts.weights.medium,
    },
    bold: {
      fontFamily: theme.fonts.bold,
      fontWeight: theme.fonts.weights.bold,
    },
    heavy: {
      fontFamily: theme.fonts.bold,
      fontWeight: theme.fonts.weights.extraBold,
    },
  },
};

function App() {
  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <StatusBar
          backgroundColor={theme.colors.background}
          barStyle="dark-content"
        />
        <ServerStateProvider>
          <AuthSessionProvider>
            <NavigationContainer theme={navigationTheme}>
              <AppNavigator />
            </NavigationContainer>
          </AuthSessionProvider>
        </ServerStateProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

export default App;
