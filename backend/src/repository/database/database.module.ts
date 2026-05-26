import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';

function buildPostgresOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  const driver = configService.get<string>('DATABASE_DRIVER', 'postgres');

  if (driver !== 'postgres') {
    throw new Error(`Unsupported DATABASE_DRIVER "${driver}". Use "postgres".`);
  }

  const username =
    configService.get<string>('DATABASE_USERNAME') ?? 'exampleuser';
  const password = String(
    configService.get<string>('DATABASE_PASSWORD') ?? 'examplepassword',
  );

  const rawUrl = configService.get<string>(
    'DATABASE_URL',
    'postgres://localhost:5432/exampledb',
  );

  let host = 'localhost';
  let port = 5432;
  let database = 'exampledb';

  try {
    const parsed = new URL(rawUrl);
    host = parsed.hostname || host;
    port = parsed.port ? Number(parsed.port) : port;
    database = parsed.pathname.replace(/^\//, '') || database;
  } catch {
    // DATABASE_URL без протокола — используем значения по умолчанию
  }

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
  };
}

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildPostgresOptions(configService),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
