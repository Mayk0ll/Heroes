import { Injectable } from '@angular/core';
import { CanActivate, CanMatch, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth-service.service';

@Injectable({providedIn: 'root'})

export class PublicGuard implements CanMatch, CanActivate {
  constructor(
    private authService:AuthService,
    private router:Router
    ) {}

  private checkAuthStatus(): boolean | Observable<boolean>{
    return this.authService.checkAuthentication().pipe(
      tap(auth => {
        console.log(auth)
        if(auth) this.router.navigate(['/heroes/list'])
      }),
      map( auth => !auth)
    )
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> |  boolean {
    console.log({route, segments})
    return this.checkAuthStatus();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> |  boolean {

    console.log({route, state})
    return this.checkAuthStatus();
  }

}
