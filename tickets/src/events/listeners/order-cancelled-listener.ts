import { Message } from 'node-nats-streaming';
import { Listener, OrderCancelledEvent, Subjects } from '@w-h-a-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    ticket.set({ orderId: undefined });
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
      price: ticket.price
    });
    msg.ack();
  }
}