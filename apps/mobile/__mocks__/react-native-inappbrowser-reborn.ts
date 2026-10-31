export const InAppBrowser = {
  isAvailable: jest.fn().mockResolvedValue(false),
  open: jest.fn().mockResolvedValue({ type: 'cancel' }),
  close: jest.fn(),
};
