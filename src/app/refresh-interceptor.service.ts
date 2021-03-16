import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshInterceptorService implements HttpInterceptor {

  constructor(private us: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        console.log(request.url.includes('refresh'));
        if(request.url.includes('refresh')) {
          return next.handle(request)
        } else {
          return this.us.refresh().pipe(
            // request.headers
            flatMap(_ => next.handle(request))
          )
        }
        
      })
    );
  }
}
