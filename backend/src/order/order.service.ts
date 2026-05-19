import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderTicketResultDto } from './dto/order.dto';
import { TicketDto } from './dto/ticket.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(
    order: CreateOrderDto,
  ): Promise<ListResponseDto<OrderTicketResultDto>> {
    this.validateOrder(order);

    const seatsBySession = new Map<string, string[]>();
    const ticketsBySession = new Map<string, TicketDto[]>();

    for (const ticket of order.tickets) {
      const seatKey = `${ticket.row}:${ticket.seat}`;
      const sessionKey = `${ticket.film}:${ticket.session}`;
      const seats = seatsBySession.get(sessionKey) ?? [];

      if (seats.includes(seatKey)) {
        throw new HttpException(
          { error: 'Duplicate seat in order' },
          HttpStatus.BAD_REQUEST,
        );
      }

      seats.push(seatKey);
      seatsBySession.set(sessionKey, seats);

      const sessionTickets = ticketsBySession.get(sessionKey) ?? [];
      sessionTickets.push(ticket);
      ticketsBySession.set(sessionKey, sessionTickets);
    }

    const results: OrderTicketResultDto[] = [];

    for (const [sessionKey, seats] of seatsBySession) {
      const [filmId, sessionId] = sessionKey.split(':');
      const booked = await this.filmsRepository.bookSeats(
        filmId,
        sessionId,
        seats,
      );

      if (!booked) {
        throw new HttpException(
          { error: 'Seat already taken' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const tickets = ticketsBySession.get(sessionKey) ?? [];
      for (const ticket of tickets) {
        results.push({
          id: randomUUID(),
          film: ticket.film,
          session: ticket.session,
          daytime: ticket.daytime,
          row: ticket.row,
          seat: ticket.seat,
          price: ticket.price,
        });
      }
    }

    return new ListResponseDto(results);
  }

  private validateOrder(order: CreateOrderDto): void {
    if (!order.email || !order.phone || !order.tickets?.length) {
      throw new HttpException(
        { error: 'Invalid order data' },
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const ticket of order.tickets) {
      if (
        !ticket.film ||
        !ticket.session ||
        !ticket.daytime ||
        ticket.row === undefined ||
        ticket.seat === undefined ||
        ticket.price === undefined
      ) {
        throw new HttpException(
          { error: 'Invalid ticket data' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
