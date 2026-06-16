import { FilmDto, ScheduleDto } from './dto/films.dto';
import { CreateOrderDto } from '../order/dto/order.dto';

export const fixtures = {
  films: [
    {
      id: '11',
      rating: 8.5,
      director: 'Test Director',
      tags: ['drama'],
      title: 'Test Film',
      about: 'About film',
      description: 'Film description',
      image: '/image.jpg',
      cover: '/cover.jpg',
    },
  ] satisfies FilmDto[],

  schedule: [
    {
      id: 'session-1',
      daytime: '2024-01-01T10:00:00',
      hall: 1,
      rows: 5,
      seats: 10,
      price: 350,
      taken: [],
    },
  ] satisfies ScheduleDto[],

  order: {
    email: 'test@example.com',
    phone: '+71234567890',
    tickets: [
      {
        film: '11',
        session: 'session-1',
        daytime: '2024-01-01T10:00:00',
        row: 1,
        seat: 1,
        price: 350,
      },
    ],
  } satisfies CreateOrderDto,
};
