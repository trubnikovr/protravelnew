import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CircleAlert, Info} from 'lucide-react-native';
import {theme, typography} from '../../../shared/theme/theme';
import type {SystemMessage} from '../api/system-messages.api';

export function SystemMessagesBanner({
  messages,
}: {
  messages: SystemMessage[];
}) {
  if (messages.length === 0) return null;

  return (
    <View style={styles.list}>
      {messages.map(message => (
        <MessageBanner key={message.id} message={message} />
      ))}
    </View>
  );
}

function MessageBanner({message}: {message: SystemMessage}) {
  const error = message.type === 'error';
  const Icon = error ? CircleAlert : Info;
  return (
    <View style={[styles.banner, error ? styles.error : styles.info]}>
      <Icon
        color={error ? theme.colors.danger : theme.colors.primaryDark}
        size={20}
      />
      <Text style={[styles.text, error ? styles.errorText : styles.infoText]}>
        {message.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.xs,
    paddingHorizontal: theme.sizes.contentPadding,
    paddingBottom: theme.spacing.xs,
  },
  banner: {
    alignItems: 'center',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  info: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryMuted,
  },
  error: {
    backgroundColor: theme.colors.dangerSoft,
    borderColor: theme.colors.danger,
  },
  text: {
    ...typography.bodySmall,
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  infoText: {
    color: theme.colors.primaryDark,
  },
  errorText: {
    color: theme.colors.danger,
  },
});
