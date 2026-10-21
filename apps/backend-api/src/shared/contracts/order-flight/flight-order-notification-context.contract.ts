export interface FlightOrderNotificationContextContract {
  orderId: string;
  customerId: string;
  contact: {
    email: string;
    name: string;
  };
}
