import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Film, (film) => film.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id' })
  film: Film;

  @RelationId((schedule: Schedule) => schedule.film)
  filmId: string;

  @Column({ type: 'varchar', length: 64 })
  daytime: string;

  @Column({ type: 'varchar', length: 32 })
  hall: string;

  @Column({ type: 'int' })
  rows: number;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'int' })
  price: number;

  @Column('text', { array: true, default: () => "'{}'" })
  taken: string[];
}
