import { Hero } from './../interfaces/hero.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from "rxjs";
import { enviroments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl = enviroments.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
  }

  getHeroById(id: string):Observable<Hero | undefined> {

    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        catchError( error => of (undefined))
      );
  }

  getSuggestios( query: string ):Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
  }

  addHero( hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero)
  }

  updateHero( hero: Hero): Observable<Hero>{
    if(!hero.id) throw Error('heroe no existe')
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero)
  }

  deleteHero( hero: Hero): Observable<boolean>{
    return this.http.delete(`${this.baseUrl}/heroes/${hero.id}`).pipe(
      map(resp => true),
      catchError( err => of(false)),
    )
  }


}
