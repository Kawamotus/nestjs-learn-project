import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

//um pipe pode ser utilizado numa classe, global ou numa função, cada uma em seu devido lugar, sempre tomar cuidado com o uso de pipes

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      throw new BadRequestException(
        'ParseIntIdPipe espera uma string numérica.',
      );
    }
    if (parsedValue < 0) {
      throw new BadRequestException(
        'ParseIntIdPipe espera um número maior do que zero.',
      );
    }
    return parsedValue;
  }
}
