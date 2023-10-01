import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = enviroments.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser():User|undefined {
    if (!this.user) return undefined;
    // return {...this.user}
    return structuredClone(this.user)
  }

  login(email: string, password: string):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap(us => this.user = us),
      tap(us => localStorage.setItem('token', 'lkjhekhfksadf.asdflkjlañsdf.asljcfhlker'))
    );
  }

  logout(){
    this.user = undefined;
    localStorage.clear()
  }

  checkAuthentication():Observable<boolean>{
    const token = localStorage.getItem('token');
    if(!token) return of(false)
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap( user => this.user = user),
      map( user => !!user),
      catchError( err => of(false))
    )

  }

}

