import {apiRequest} from '../../../shared/api/api-client';

export type SystemMessageType = 'info' | 'error';

export type SystemMessage = {
  id: string;
  text: string;
  type: SystemMessageType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export function listSystemMessages(): Promise<SystemMessage[]> {
  return apiRequest('/system-messages');
}
