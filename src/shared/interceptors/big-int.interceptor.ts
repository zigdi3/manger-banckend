import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (typeof data === 'object') {
          return JSON.parse(JSON.stringify(data, (key, value) => {
            if (typeof value === 'bigint') {
              return `BigInt(${value.toString()})`;
            }
            return value;
          }));
        }
        return data;
      }),
    );
  }
}
