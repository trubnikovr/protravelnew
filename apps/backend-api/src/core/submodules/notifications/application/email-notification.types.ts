export interface EmailNotificationRequest {
  readonly eventId: string;
  readonly recipient: {
    readonly email: string;
    readonly name: string;
  };
  readonly template: 'flight-order-created';
  readonly variables: {
    readonly orderId: string;
  };
}
