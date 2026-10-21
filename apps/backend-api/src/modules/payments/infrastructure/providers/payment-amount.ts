export function minorToMajorNumber(minorAmount: string): number {
  const padded = minorAmount.padStart(3, '0');
  return Number(`${padded.slice(0, -2)}.${padded.slice(-2)}`);
}

export function majorNumberToMinor(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('Provider payment amount is invalid');
  }
  return amount
    .toFixed(2)
    .replace('.', '')
    .replace(/^0+(?=\d)/, '');
}
