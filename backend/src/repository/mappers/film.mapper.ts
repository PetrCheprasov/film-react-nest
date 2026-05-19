import { FilmDto, ScheduleDto } from '../../films/dto/films.dto';
import { FilmRecord, ScheduleRecord } from '../schemas/film.schema';

export function toFilmDto(film: FilmRecord): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags,
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

export function toScheduleDto(session: ScheduleRecord): ScheduleDto {
  return {
    id: session.id,
    daytime: session.daytime,
    hall: String(session.hall),
    rows: session.rows,
    seats: session.seats,
    price: session.price,
    taken: session.taken ?? [],
  };
}
