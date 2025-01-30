import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { of, tap } from 'rxjs';

//cache simples e cagado de bugs, n utilizar
export class SimpleCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map();

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    if (this.cache.has(url)) {
      console.log('already in cache ' + url);
      return of(this.cache.get(url));
    }
    return next.handle().pipe(
      tap((data) => {
        this.cache.set(url, data);
        console.log('now in cache ', url);
      }),
    );
  }
}
