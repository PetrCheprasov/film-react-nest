import { plainToInstance } from 'class-transformer';
import { FilmDto, ScheduleDto } from '../../films/dto/films.dto';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { FilmRecord, ScheduleRecord } from '../schemas/film.schema';

const transformOptions = { excludeExtraneousValues: true };

export function toFilmDto(film: Film | FilmRecord): FilmDto {
  return plainToInstance(FilmDto, film, transformOptions);
}

export function toScheduleDto(session: Schedule | ScheduleRecord): ScheduleDto {
  return plainToInstance(ScheduleDto, session, transformOptions);
}
