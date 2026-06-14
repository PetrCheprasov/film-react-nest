import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsService } from './films.service';
import { fixtures } from './films.fixtures';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: {
    findAll: jest.Mock;
    findScheduleByFilmId: jest.Mock;
    bookSeats: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      findAll: jest.fn().mockResolvedValue(fixtures.films),
      findScheduleByFilmId: jest.fn().mockResolvedValue(fixtures.schedule),
      bookSeats: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should find all films', async () => {
    expect(service).toBeDefined();

    const films = await service.findAll();

    expect(films).toEqual({
      total: fixtures.films.length,
      items: fixtures.films,
    });
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return schedule for existing film', async () => {
    const schedule = await service.getSchedule('11');

    expect(schedule).toEqual({
      total: fixtures.schedule.length,
      items: fixtures.schedule,
    });
    expect(repository.findScheduleByFilmId).toHaveBeenCalledWith('11');
  });

  it('should throw when film is not found', async () => {
    repository.findScheduleByFilmId.mockResolvedValue(null);

    await expect(service.getSchedule('missing')).rejects.toThrow(
      NotFoundException,
    );
  });
});
