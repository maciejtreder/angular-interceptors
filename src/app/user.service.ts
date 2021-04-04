import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = 'http://localhost:8080';
  private authToken: string = localStorage.getItem('authToken') as string;;

  constructor(private http: HttpClient) { }

  public authenticate(credentials: {login: string, password: string}): Observable<boolean> {
    return this.http.post<any>(`${this.basePath}/login`, credentials).pipe(
      tap(response => {
        this.authToken = response.authToken;
        localStorage.setItem('authToken', response.authToken);
      }),
      map(_ => true)
    );
  }

  public getSecretInfo(): Observable<any> {
    return this.http.get(`${this.basePath}/secret`);
  }

  public getUser(): any {
    if (!!this.authToken) {
      const parts = this.authToken.split(".");
      return JSON.parse(atob(parts[1]));
    }
    return {name: "unauthorized user"};
  }

  public getAuthToken(): string {
    return this.authToken;
  }

  public refresh(): Observable<boolean> {
    return this.http.post<any>(`${this.basePath}/refresh`, null, { withCredentials: true }).pipe(
      tap(response => {
        this.authToken = response.authToken;
        localStorage.setItem('authToken', response.authToken);
      }),
      map(_ => true)
    );
  }

  public invalidateAuthToken(): void {
    this.http.get(`${this.basePath}/invalidateAuthToken`).subscribe();
  }
}
