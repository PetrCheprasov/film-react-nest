import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;

  abstract findScheduleByFilmId(filmId: string): Promise<ScheduleDto[] | null>;

  abstract bookSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean>;
}
