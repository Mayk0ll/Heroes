import { Injectable } from '@angular/core';
import { CanActivate, CanMatch, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth-service.service';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanMatch, CanActivate {
  constructor(
    private authService:AuthService,
    private router:Router
    ) {}

  private checkAuthStatus(): boolean | Observable<boolean>{
    return this.authService.checkAuthentication().pipe(
      tap(auth => {
        if(!auth) this.router.navigate(['/auth/login'])
      })
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



  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   throw new Error('Method not implemented');
  // }

