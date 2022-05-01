import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@w-h-a-tickets/common';

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'new concert',
    version: ticket.version + 1,
    price: 999,
    userId: 'djfkd'
  };

  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  // return all
  return { listener, data, msg, ticket };
};

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has the wrong version', async () => {
  const { msg, data, listener, ticket } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {

  }
  expect(msg.ack).not.toHaveBeenCalled();
});