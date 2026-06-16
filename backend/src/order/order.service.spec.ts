import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { fixtures } from '../films/films.fixtures';
import { FilmsRepository } from '../repository/films.repository';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let repository: { bookSeats: jest.Mock };

  beforeEach(async () => {
    repository = {
      bookSeats: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FilmsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should create order', async () => {
    const result = await service.createOrder(fixtures.order);

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      film: fixtures.order.tickets[0].film,
      session: fixtures.order.tickets[0].session,
      daytime: fixtures.order.tickets[0].daytime,
      row: fixtures.order.tickets[0].row,
      seat: fixtures.order.tickets[0].seat,
      price: fixtures.order.tickets[0].price,
    });
    expect(result.items[0].id).toEqual(expect.any(String));
    expect(repository.bookSeats).toHaveBeenCalledWith('11', 'session-1', [
      '1:1',
    ]);
  });

  it('should reject duplicate seats in one order', async () => {
    const order = {
      ...fixtures.order,
      tickets: [fixtures.order.tickets[0], { ...fixtures.order.tickets[0] }],
    };

    await expect(service.createOrder(order)).rejects.toThrow(HttpException);
    expect(repository.bookSeats).not.toHaveBeenCalled();
  });

  it('should reject already taken seats', async () => {
    repository.bookSeats.mockResolvedValue(false);

    await expect(service.createOrder(fixtures.order)).rejects.toThrow(
      HttpException,
    );
  });
});
