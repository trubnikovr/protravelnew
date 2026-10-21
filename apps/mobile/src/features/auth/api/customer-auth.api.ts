import {apiRequest} from '../../../shared/api/api-client';

export type CustomerAuthSession = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

export type CustomerLoginChallenge = {
  verificationId: string;
  expiresIn: number;
  developmentCode?: string;
};

export function requestLoginCode(
  phone: string,
): Promise<CustomerLoginChallenge> {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({phone}),
  });
}

export function verifyLoginCode(
  verificationId: string,
  code: string,
): Promise<CustomerAuthSession> {
  return apiRequest('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({verificationId, code}),
  });
}

export function refreshCustomerSession(
  refreshToken: string,
): Promise<CustomerAuthSession> {
  return apiRequest('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({refreshToken}),
  });
}
