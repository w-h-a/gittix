import { Subjects, Publisher, ExpirationCompleteEvent } from '@w-h-a-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}