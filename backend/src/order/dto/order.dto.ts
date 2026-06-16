import { Type, Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  Matches,
  ValidateNested,
} from 'class-validator';
import { TicketDto } from './ticket.dto';

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    const digits = value.replace(/\D/g, '');

    if (digits.length === 11 && digits.startsWith('7')) {
      return `+${digits}`;
    }

    return value;
  })
  @Matches(/^\+7\d{10}$/)
  phone: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderTicketResultDto {
  id: string;
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}
