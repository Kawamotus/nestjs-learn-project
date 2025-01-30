import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    //pega o objeto da resposta
    const response = context.switchToHttp().getResponse();

    //adiciona um cabeçalho na response
    response.setHeader('Cabecalho-teste', 'Resposta-teste');

    //isso continua a requisição após o interceptor executar a verificação necessária
    return next.handle();
  }
}
