import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Abel' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  password: string;
}
