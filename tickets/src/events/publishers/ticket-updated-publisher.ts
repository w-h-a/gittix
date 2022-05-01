import { Publisher, Subjects, TicketUpdatedEvent } from '@w-h-a-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}