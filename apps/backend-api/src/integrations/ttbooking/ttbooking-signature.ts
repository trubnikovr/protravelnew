import { createHash } from 'node:crypto';

interface TtbookingSignatureInput {
  agency: number | string;
  password: string;
  time: string;
  user: number | string;
}

export function createTtbookingSignature(
  input: TtbookingSignatureInput,
): string {
  const signature = [
    `agency=${input.agency}`,
    `password=${input.password}`,
    `time=${input.time}`,
    `user=${input.user}`,
  ].join('&');
  return createHash('md5').update(signature).digest('hex');
}
