import { Module } from '@nestjs/common';
import { FilmsTypeOrmRepository } from './films.typeorm.repository';
import { FilmsRepository } from './films.repository';

@Module({
  providers: [
    {
      provide: FilmsRepository,
      useClass: FilmsTypeOrmRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
