import { StyleSheet } from 'react-native';
import { theme, typography } from '../../../shared/theme/theme';

export const aviaSearchFormStyles = StyleSheet.create({
  scrollView: { flex: 1 },
  backdropDismiss: { ...StyleSheet.absoluteFill },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  formTopSpacer: {
    height: 178,
  },
  formCard: {
    ...theme.shadows.floating,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.sm,
    marginHorizontal: theme.sizes.contentPadding,
    overflow: 'hidden',
  },
  routeFields: {
    position: 'relative',
  },
  swapButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    position: 'absolute',
    right: theme.spacing.xs,
    top: 44,
    width: 38,
    zIndex: 2,
  },
  swapIcon: {
    height: 24,
    width: 24,
  },
  dateRow: {
    flexDirection: 'row',
  },
  submitButton: {
    marginHorizontal: theme.sizes.contentPadding,
    marginTop: theme.spacing.md,
  },
  modalBackdrop: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalKeyboardView: { flex: 1 },
  modalSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    maxHeight: '92%',
    padding: theme.sizes.contentPadding,
  },
  passengersSheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    maxHeight: '92%',
    padding: theme.sizes.contentPadding,
    paddingBottom: theme.spacing.xxl,
  },
  passengerRow: {
    alignItems: 'center',
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 68,
  },
  passengerText: { flex: 1 },
  passengerLabel: { ...typography.bodySemibold },
  passengerHint: { ...typography.bodySmall },
  passengerCount: {
    ...typography.bodySemibold,
    minWidth: 38,
    textAlign: 'center',
  },
  counterButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.divider,
    borderRadius: theme.radii.pill,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  counterButtonPrimary: { backgroundColor: theme.colors.primary },
  counterButtonDisabled: { opacity: 0.4 },
  classTitle: {
    ...typography.bodySemibold,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  classOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  modalHandle: {
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    height: 4,
    marginBottom: theme.spacing.md,
    width: 42,
  },
  modalTitle: {
    ...typography.titleSmall,
    marginBottom: theme.spacing.sm,
  },
  calendar: { marginBottom: theme.spacing.sm },
  searchInput: {
    ...typography.body,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
    minHeight: theme.sizes.inputHeight,
    paddingHorizontal: theme.spacing.md,
  },
  placeResults: { flexShrink: 1 },
  modalState: {
    marginVertical: theme.spacing.md,
  },
  modalStateText: {
    ...typography.bodySmall,
    marginVertical: theme.spacing.md,
    textAlign: 'center',
  },
  modalOption: {
    alignItems: 'center',
    borderBottomColor: theme.colors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 52,
  },
  modalOptionText: {
    ...typography.body,
    flex: 1,
  },
  modalOptionCode: {
    ...typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  modalCancel: {
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  modalCancelText: {
    ...typography.bodySemibold,
    color: theme.colors.primary,
  },
});
