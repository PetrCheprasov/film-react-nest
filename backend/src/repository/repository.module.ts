import { Module } from '@nestjs/common';
import { FilmsMongoRepository } from './films.mongodb.repository';
import { FilmsRepository } from './films.repository';

@Module({
  providers: [
    {
      provide: FilmsRepository,
      useClass: FilmsMongoRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
