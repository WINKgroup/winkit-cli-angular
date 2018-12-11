import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SessionService} from '../services/session.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  /**
   * allows access just to authenticated user
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean> | Promise<boolean> | boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (SessionService.isLoggedIn()) {
      console.log('authenticated');
      return true;
    } else {
      console.log('not authenticated');
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    }
  }

}
