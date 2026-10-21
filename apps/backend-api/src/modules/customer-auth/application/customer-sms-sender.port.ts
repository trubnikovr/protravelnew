export const CUSTOMER_SMS_SENDER = Symbol('CUSTOMER_SMS_SENDER');

export type CustomerSmsDeliveryResult = {
  developmentCode?: string;
};

export interface CustomerSmsSenderPort {
  sendLoginCode(
    phone: string,
    code: string,
  ): Promise<CustomerSmsDeliveryResult>;
}
