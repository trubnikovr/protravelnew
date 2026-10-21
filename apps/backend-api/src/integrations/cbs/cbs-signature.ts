import { createHash } from 'node:crypto';

interface CbsSignatureInput {
  agency: string;
  password: string;
  time: string;
  user: string;
}

export function createCbsSignature(input: CbsSignatureInput): string {
  const signature = [
    `agency=${input.agency}`,
    `password=${input.password}`,
    `time=${input.time}`,
    `user=${input.user}`,
  ].join('&');
  return createHash('md5').update(signature).digest('hex');
}
