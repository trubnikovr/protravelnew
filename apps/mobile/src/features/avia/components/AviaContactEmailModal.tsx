import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUpdateCustomerProfile } from '../../profile';
import { getApiErrorMessage } from '../../../shared/api/api-errors';
import { PrimaryButton } from '../../../shared/ui';
import { theme, typography } from '../../../shared/theme/theme';

export function AviaContactEmailModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const update = useUpdateCustomerProfile();
  const normalized = email.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  const save = async () => {
    if (!valid) return;
    try { await update.mutateAsync({ email: normalized }); setEmail(''); onClose(); } catch { /* Error is shown below. */ }
  };
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('search.booking.emailModalTitle')}</Text>
          <Text style={styles.description}>{t('search.booking.emailModalDescription')}</Text>
          <TextInput accessibilityLabel={t('search.booking.emailLabel')} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" onChangeText={setEmail} placeholder={t('search.booking.emailPlaceholder')} placeholderTextColor={theme.colors.textSecondary} style={styles.input} value={email} />
          {update.isError ? <Text style={styles.error}>{getApiErrorMessage(update.error)}</Text> : null}
          <PrimaryButton disabled={!valid} loading={update.isPending} onPress={save} title={t('common.save')} />
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.cancel}><Text style={styles.cancelText}>{t('common.cancel')}</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { alignItems: 'center', backgroundColor: theme.colors.overlay, flex: 1, justifyContent: 'center', padding: theme.sizes.contentPadding },
  card: { alignSelf: 'stretch', backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, padding: theme.spacing.lg },
  title: { ...typography.titleSmall, marginBottom: theme.spacing.sm },
  description: { ...typography.bodySmall, color: theme.colors.textSecondary, marginBottom: theme.spacing.md },
  input: { ...typography.body, borderColor: theme.colors.border, borderRadius: theme.radii.sm, borderWidth: 1, color: theme.colors.text, marginBottom: theme.spacing.md, padding: theme.spacing.md },
  error: { ...typography.bodySmall, color: theme.colors.danger, marginBottom: theme.spacing.md },
  cancel: { alignItems: 'center', padding: theme.spacing.md },
  cancelText: { ...typography.bodySemibold, color: theme.colors.primary },
});
