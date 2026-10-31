import { useSyncExternalStore } from 'react';

let unavailable = false;
const listeners = new Set<() => void>();

export function setConnectionUnavailable(value: boolean) {
  if (unavailable === value) return;
  unavailable = value;
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useConnectionUnavailable() {
  return useSyncExternalStore(subscribe, () => unavailable);
}
