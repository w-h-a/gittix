import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  // save the ticket to the db
  await ticket.save();

  // fetch the ticket twice
  const firstRef = await Ticket.findById(ticket.id);
  const secondRef = await Ticket.findById(ticket.id);

  // make two separate changes to the ticket
  firstRef!.set({ price: 10 });
  secondRef!.set({ price: 15 });

  // save the ticket
  await firstRef!.save();

  // save the ticket and expect an error
  try {
    await secondRef!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments version on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});