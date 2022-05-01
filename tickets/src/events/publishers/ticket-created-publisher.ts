import { Publisher, Subjects, TicketCreatedEvent } from '@w-h-a-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
