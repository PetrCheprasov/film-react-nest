import { plainToInstance } from 'class-transformer';
import { FilmDto, ScheduleDto } from '../../films/dto/films.dto';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';

const transformOptions = { excludeExtraneousValues: true };

export function toFilmDto(film: Film): FilmDto {
  return plainToInstance(FilmDto, film, transformOptions);
}

export function toScheduleDto(session: Schedule): ScheduleDto {
  return plainToInstance(ScheduleDto, session, transformOptions);
}
