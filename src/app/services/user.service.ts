import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "angularx-social-login";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  auth: boolean = false;
  private baseUrl = environment.baseUrl;
  private user;

  authState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth);
  userData$ = new BehaviorSubject<SocialUser | ResponseModel>(null);

  constructor(private _authService: SocialAuthService,
              private _httpClient: HttpClient) {

    _authService.authState.subscribe((user:SocialUser)=>{
      if(user != null){
        this.auth = true;
        this.authState$.next(this.auth); // this will emit the data from the social user
        this.userData$.next(user);// this will emit the data as ResponseModel.
      }
    })

  }

  //Login user with Email and password

  loginUser(email:string, password:string){
    this._httpClient.post( this.baseUrl + 'auth/login', {email,password})
      .subscribe((data: ResponseModel) => {
        this.auth = data.auth;
        this.authState$.next(this.auth);
        this.userData$.next(data);
      })
  }

  //Google Authentication

  googleLogin(){
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logout(){
    this._authService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
  }
}

interface ResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname:string;
  photoUrl: string;
  userId: number;
}





