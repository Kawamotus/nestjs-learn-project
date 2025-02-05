import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const startTime = Date.now();
    return next.handle().pipe(
      //para mostrar os dados da response
      //   tap((data) => {
      //     const finalTime = Date.now();
      //     const elapsedTime = finalTime - startTime;
      //     console.log(data);
      //     console.log('Execução após chamada do método em ' + elapsedTime + 'ms');
      //   }),
      tap(() => {
        const finalTime = Date.now();
        const elapsedTime = finalTime - startTime;
      }),
    );
  }
}
