import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {SessionService, UserRole} from '../services/session.service';
import {Observable} from 'rxjs/index';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {
  }

  /**
   * allows access just to ADMIN
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean> | Promise<boolean> | boolean}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (SessionService.isLoggedIn() && SessionService.getLoggedInUser().userRole === UserRole.ADMIN) {
      return true;
    } else {
      console.log('not authenticated or not admin');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }

}
