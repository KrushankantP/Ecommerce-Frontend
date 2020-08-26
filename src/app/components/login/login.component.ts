import { Component, OnInit } from '@angular/core';
import {SocialAuthService} from "angularx-social-login";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email:string
  password:string;
  loginMessage:string;
  userRole: number;

  constructor(private _authService: SocialAuthService,
              private _router: Router,
              private _userService: UserService,
              private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._userService.authState$.subscribe(authState=> {
      if(authState){
        this._router.navigateByUrl(this._route.snapshot.queryParams.returnUrl || 'profile');
      }else{
        this._router.navigateByUrl('login');
      }
    });
  }

  signInWithGoogle() {
    this._userService.googleLogin();

  }

  login(form: NgForm) {
  const email = this.email;
  const password = this.password;

  if(form.invalid){
    return;
   }
    form.reset();
    this._userService.loginUser(email, password);
    this._userService.loginMessage$.subscribe(msg => {
      this.loginMessage = msg;
      setTimeout(() => {
        this.loginMessage = '';
      }, 2000);
    });
  }
}
