import { Injectable } from '@nestjs/common';
import type {
  CustomerSmsDeliveryResult,
  CustomerSmsSenderPort,
} from '../application/customer-sms-sender.port';

@Injectable()
export class MockCustomerSmsSender implements CustomerSmsSenderPort {
  sendLoginCode(
    _phone: string,
    code: string,
  ): Promise<CustomerSmsDeliveryResult> {
    return Promise.resolve({ developmentCode: code });
  }
}
