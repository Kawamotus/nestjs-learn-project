import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDTO {
  // o decorator valida de acordo com ele, isso após ativar o app.useGlobalPipes(new ValidationPipe()); e instalar class-validator e class-transformer
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  readonly text: string;

  @IsPositive()
  readonly fromId: number;

  @IsPositive()
  readonly toId: number;
}
