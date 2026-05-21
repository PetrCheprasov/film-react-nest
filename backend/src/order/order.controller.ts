import { Body, Controller, Post } from '@nestjs/common';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { CreateOrderDto, OrderTicketResultDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('order')
  create(
    @Body() order: CreateOrderDto,
  ): Promise<ListResponseDto<OrderTicketResultDto>> {
    return this.orderService.createOrder(order);
  }
}
