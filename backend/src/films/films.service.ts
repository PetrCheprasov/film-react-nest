import { NotFoundException, Injectable } from '@nestjs/common';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<ListResponseDto<FilmDto>> {
    const items = await this.filmsRepository.findAll();
    return new ListResponseDto(items);
  }

  async getSchedule(filmId: string): Promise<ListResponseDto<ScheduleDto>> {
    const items = await this.filmsRepository.findScheduleByFilmId(filmId);

    if (items === null) {
      throw new NotFoundException({ error: 'Film not found' });
    }

    return new ListResponseDto(items);
  }
}
