import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = 'http://localhost:8080';
  private token: string = localStorage.getItem('token') as string;;
  private refreshToken: string = localStorage.getItem('refreshToken') as string;

  constructor(private http: HttpClient) { }

  public authenticate(credentials: {login: string, password: string}): Observable<boolean> {
    return this.http.post<any>(`${this.basePath}/login`, credentials).pipe(
      tap(response => {
        this.token = response.authToken;
        this.refreshToken = response.refreshToken;
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('token', response.authToken);
      }),
      map(_ => true)
    );
  }

  public getSecretInfo(): Observable<any> {
    return this.http.get(`${this.basePath}/secret`);
  }

  public getInfo(): Observable<any> {
    return this.http.get(`${this.basePath}/info`);
  }

  public getToken(): string {
    return this.token;
  }

  public refresh(): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({refresh: this.refreshToken})
    }
    return this.http.post<any>(`${this.basePath}/refresh`, null, httpOptions).pipe(
      tap(response => {
        this.token = response.authToken;
        this.refreshToken = response.refreshToken;
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('token', response.authToken);
      }),
      map(_ => true)
    );
  }

  public invalidateAuthToken(): void {
    this.http.get(`${this.basePath}/invalidateAuthToken`).subscribe();
  }
}
