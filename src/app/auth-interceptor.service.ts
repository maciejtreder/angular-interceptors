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
    let authToken = this.us.getAuthToken();
    if (!!authToken) {
      request = request.clone({
        setHeaders: {
          auth: authToken
        }
      });
    }
    return next.handle(request);
  }
}
