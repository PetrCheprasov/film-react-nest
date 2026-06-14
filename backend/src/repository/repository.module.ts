import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../app-config.module';
import { DatabaseModule } from './database/database.module';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmsMongoRepository } from './films.mongodb.repository';
import { FilmsRepository } from './films.repository';
import { FilmsTypeOrmRepository } from './films.typeorm.repository';

const isMongo = process.env.DATABASE_DRIVER === 'mongodb';

@Module({
  imports: isMongo
    ? [AppConfigModule]
    : [DatabaseModule, TypeOrmModule.forFeature([Film, Schedule])],
  providers: [
    {
      provide: FilmsRepository,
      useClass: isMongo ? FilmsMongoRepository : FilmsTypeOrmRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
