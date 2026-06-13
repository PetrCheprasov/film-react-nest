import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { toFilmDto, toScheduleDto } from './mappers/film.mapper';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsTypeOrmRepository extends FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();
    return films.map(toFilmDto);
  }

  async findScheduleByFilmId(filmId: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedules'],
    });

    if (!film) {
      return null;
    }

    return film.schedules.map(toScheduleDto);
  }

  async bookSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const schedule = await manager.findOne(Schedule, {
        where: { id: sessionId, filmId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!schedule) {
        return false;
      }

      const taken = schedule.taken ?? [];

      if (seats.some((seat) => taken.includes(seat))) {
        return false;
      }

      schedule.taken = [...taken, ...seats];
      await manager.save(schedule);
      return true;
    });
  }
}
