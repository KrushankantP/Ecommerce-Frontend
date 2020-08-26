import { Component, OnInit } from '@angular/core';
import {SocialAuthService, SocialUser} from "angularx-social-login";
import {Router} from "@angular/router";
import {ResponseModel, UserService} from "../../services/user.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  myUser: any;

  constructor(private _authService: SocialAuthService,
              private _router: Router,
              private _userService: UserService) { }

  ngOnInit(): void {

    this._authService.authState.pipe(
      map((user: SocialUser | ResponseModel) => {
        if(user instanceof SocialUser || user.type === 'social')
        return {
          ...user,
          email: 'email@gmail.com'
        };
      })
    ).subscribe((user:SocialUser)=>{
      if(user != null){
        this.myUser = user;
      }else{
        return;
      }
    });

    this._userService.userData$
      .pipe(
        map((user: SocialUser) => {
          if (user instanceof SocialUser) {
            return {
              ...user,
              email: 'test@test.com'
            };
          } else {
            return user;
          }
        })
      )
      .subscribe((data: ResponseModel | SocialUser) => {
        this.myUser = data;
      });
  }

  logout() {
    this._userService.logout();
  }

}
