/**
 * Returns an ID that is stable for this browser profile on this device.
 * It intentionally lives in localStorage: clearing browser site data or using
 * another browser/device creates a new, separate MoodCraft profile.
 */
const DEVICE_ID_STORAGE_KEY = 'moodcraft_device_id';

export const getDeviceId = (): string => {
  const existingId = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existingId) return existingId;

  const deviceId = crypto.randomUUID();
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  return deviceId;
};
