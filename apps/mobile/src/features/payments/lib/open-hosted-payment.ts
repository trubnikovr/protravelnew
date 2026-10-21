import { Linking } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { theme } from '../../../shared/theme/theme';

export const PAYMENT_RETURN_URL = 'protravel://payments/result';

export async function openHostedPayment(paymentUrl: string): Promise<void> {
  if (!(await InAppBrowser.isAvailable())) {
    await Linking.openURL(paymentUrl);
    return;
  }
  await InAppBrowser.openAuth(paymentUrl, PAYMENT_RETURN_URL, {
    dismissButtonStyle: 'close',
    preferredBarTintColor: theme.colors.surface,
    preferredControlTintColor: theme.colors.primary,
    toolbarColor: theme.colors.surface,
    navigationBarColor: theme.colors.surface,
    showTitle: true,
    enableUrlBarHiding: true,
    ephemeralWebSession: false,
  });
}
