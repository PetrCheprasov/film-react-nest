import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { AppConfig } from '../app.config.provider';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { toFilmDto, toScheduleDto } from './mappers/film.mapper';
import { FilmsRepository } from './films.repository';
import { FilmRecord, FilmSchema } from './schemas/film.schema';

@Injectable()
export class FilmsMongoRepository
  extends FilmsRepository
  implements OnModuleInit, OnModuleDestroy
{
  private readonly filmModel: mongoose.Model<FilmRecord>;

  constructor(@Inject('CONFIG') private readonly config: AppConfig) {
    super();
    this.filmModel =
      mongoose.models.Film ?? mongoose.model<FilmRecord>('Film', FilmSchema);
  }

  async onModuleInit(): Promise<void> {
    await FilmsMongoRepository.connect(this.config);
  }

  async onModuleDestroy(): Promise<void> {
    await mongoose.disconnect();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean().exec();
    return films.map(toFilmDto);
  }

  async findScheduleByFilmId(filmId: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel.findOne({ id: filmId }).lean().exec();
    if (!film) {
      return null;
    }
    return film.schedule.map(toScheduleDto);
  }

  async bookSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    for (const seat of seats) {
      const result = await this.filmModel.updateOne(
        {
          id: filmId,
          schedule: {
            $elemMatch: {
              id: sessionId,
              taken: { $nin: [seat] },
            },
          },
        },
        { $push: { 'schedule.$[session].taken': seat } },
        {
          arrayFilters: [{ 'session.id': sessionId }],
        },
      );

      if (result.modifiedCount === 0) {
        return false;
      }
    }

    return true;
  }

  static async connect(config: AppConfig): Promise<void> {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.database.url);
    }
  }
}
