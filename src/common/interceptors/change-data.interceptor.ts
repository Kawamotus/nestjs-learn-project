import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ChangeDataInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      //retorna o que estiver aqui na response da requisição
      map((data) => {
        return data;
      }),
    );
  }
}
