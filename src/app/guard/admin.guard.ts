import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _userService: UserService,
              private _router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this._userService.userRole === 777) {
      return true;
    } else {
      if (this._userService.auth) {
        this._router.navigate(['profile']).then();
      } else {
        this._router.navigate(['login'], {queryParams: {returnUrl: state.url}}).then();
      }
      return false;
    }

  }

}
