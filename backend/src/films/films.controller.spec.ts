import { Test, TestingModule } from '@nestjs/testing';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { fixtures } from './films.fixtures';

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(fixtures.films),
            findScheduleByFilmId: jest
              .fn()
              .mockResolvedValue(fixtures.schedule),
            bookSeats: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should find all films', async () => {
    expect(controller).toBeDefined();

    const findResult = await controller.findAll();

    expect(findResult).toEqual({
      total: fixtures.films.length,
      items: fixtures.films,
    });
  });

  it('should find one schedule', async () => {
    expect(controller).toBeDefined();

    const findResult = await controller.getSchedule('11');

    expect(findResult).toEqual({
      total: fixtures.schedule.length,
      items: fixtures.schedule,
    });
  });
});
