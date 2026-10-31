import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme, typography } from '../theme/theme';

type Props = {
  title: string;
  onPress?: () => void;
  light?: boolean;
};

export function SectionHeader({ title, onPress, light = false }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Text numberOfLines={2} style={[styles.title, light && styles.lightText]}>
        {title}
      </Text>
      <Pressable hitSlop={theme.spacing.sm} onPress={onPress}>
        <Text
          numberOfLines={1}
          style={[styles.action, light && styles.lightText]}
        >
          {t('common.showAll')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  title: {
    ...typography.homeSectionTitle,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  action: {
    ...typography.homeSectionAction,
    flexShrink: 0,
  },
  lightText: {
    color: theme.colors.white,
  },
});
