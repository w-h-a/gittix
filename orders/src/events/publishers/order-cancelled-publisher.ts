import { Publisher, OrderCancelledEvent, Subjects } from '@w-h-a-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}