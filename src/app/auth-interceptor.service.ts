import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private us: UserService) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        authorization: this.us.getToken()
      }
    });
    return next.handle(request);
  }
}
