import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';

//para funcionar, precisa ser chamado na main ou no modulo (no caso o raiz para todos, atraves dos providers)

//necessário decorator e classe exception filter
//no catch voce insere quais excecoes voce quer, pode ser mais de uma
// para pegar todas de uma vez, da pra usar httpexception, talvez seja bom pra salvar no banco ou algo assim
@Catch(BadRequestException)
//                             serve para tipar a exception
export class MyExceptionFilter<T extends BadRequestException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error =
      typeof exceptionResponse === 'string'
        ? {
            message: exceptionResponse,
          }
        : (exceptionResponse as object);

    response.status(statusCode).json({
      ...error,
      date: new Date().toISOString(),
      path: request.url,
    });
  }
}
