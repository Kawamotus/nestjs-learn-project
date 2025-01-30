import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      catchError((error) => {
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            throw new NotFoundException('Message not found');
          }

          return new BadRequestException('an error has ocurred');
        });
      }),
    );
  }
}
