import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CustomerSmsDeliveryResult, CustomerSmsSenderPort } from '../application/customer-sms-sender.port';

@Injectable()
export class SmspilotCustomerSmsSender implements CustomerSmsSenderPort {
  constructor(private readonly config: ConfigService) {}

  async sendLoginCode(phone: string, code: string): Promise<CustomerSmsDeliveryResult> {
    const body = new URLSearchParams({
      apikey: this.config.getOrThrow<string>('SMSPILOT_API_KEY'),
      send: `Код входа Caravantur: ${code}`,
      to: phone.replace(/^\+/, ''),
      format: 'json',
    });
    const sender = this.config.get<string>('SMSPILOT_FROM');
    if (sender) body.set('from', sender);

    try {
      const response = await fetch('https://smspilot.ru/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
        body,
        signal: AbortSignal.timeout(this.config.getOrThrow<number>('SMSPILOT_TIMEOUT_MS')),
      });
      if (!response.ok) throw new Error('SMS provider HTTP error');
      const result: unknown = await response.json();
      if (!result || typeof result !== 'object' || 'error' in result || !('send' in result) || !Array.isArray(result.send) || result.send.length !== 1) {
        throw new Error('SMS provider rejected the message');
      }
      const message: unknown = result.send[0];
      if (!message || typeof message !== 'object' || !('server_id' in message) || !message.server_id || !('status' in message) || String(message.status) !== '0') {
        throw new Error('SMS provider rejected the message');
      }
      return {};
    } catch {
      throw new BadGatewayException({ code: 'CUSTOMER_SMS_SEND_FAILED', message: 'Unable to send verification code' });
    }
  }
}
