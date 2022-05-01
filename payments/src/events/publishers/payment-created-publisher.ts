import { Subjects, Publisher, PaymentCreatedEvent } from '@w-h-a-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}