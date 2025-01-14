import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDTO } from './create-message.dto';
import { IsBoolean, IsOptional } from 'class-validator';

//                                    essa lib pega a classe entre parenteses e toda validação e torna os campos opcionais
export class UpdateMessageDTO extends PartialType(CreateMessageDTO) {
  //caso deseje atualizar algum campo extendido, basta reescrever

  @IsBoolean()
  //agora esse decorator se torna obrigatório para transformar em opcional
  @IsOptional()
  readonly read?: boolean;
}
