export const ACCESSIBLE = {
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'AfterFirstUnlockThisDeviceOnly',
};

export const getGenericPassword = jest.fn().mockResolvedValue(false);
export const setGenericPassword = jest.fn().mockResolvedValue(true);
export const resetGenericPassword = jest.fn().mockResolvedValue(true);
