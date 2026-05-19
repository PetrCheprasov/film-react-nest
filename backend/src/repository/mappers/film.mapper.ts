import { plainToInstance } from 'class-transformer';
import { FilmDto, ScheduleDto } from '../../films/dto/films.dto';
import { FilmRecord, ScheduleRecord } from '../schemas/film.schema';

const transformOptions = { excludeExtraneousValues: true };

export function toFilmDto(film: FilmRecord): FilmDto {
  return plainToInstance(FilmDto, film, transformOptions);
}

export function toScheduleDto(session: ScheduleRecord): ScheduleDto {
  return plainToInstance(ScheduleDto, session, transformOptions);
}
