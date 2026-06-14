import { Test, TestingModule } from '@nestjs/testing';
import { FilmsRepository } from '../repository/films.repository';
import { fixtures } from '../films/films.fixtures';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: { createOrder: jest.Mock };

  beforeEach(async () => {
    service = {
      createOrder: jest.fn().mockResolvedValue({
        total: 1,
        items: [
          {
            id: 'ticket-1',
            ...fixtures.order.tickets[0],
          },
        ],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should create order', async () => {
    expect(controller).toBeDefined();

    const result = await controller.create(fixtures.order);

    expect(service.createOrder).toHaveBeenCalledWith(fixtures.order);
    expect(result).toEqual({
      total: 1,
      items: [
        {
          id: 'ticket-1',
          ...fixtures.order.tickets[0],
        },
      ],
    });
  });
});
