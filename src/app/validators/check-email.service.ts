import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, switchMap} from "rxjs/operators";
import {Observable, timer} from "rxjs";
import {environment} from "../../environments/environment";
import {AbstractControl, AsyncValidatorFn} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CheckEmailService {
   baseUrl = environment.baseUrl;
  constructor(private _httpClient: HttpClient) {
  }

  searchEmail(text) {
    return timer(2000)
      .pipe(
        switchMap(() => this._httpClient.get(this.baseUrl +'users/validate/' + text)),
      ); // PIPE ENDS HERE
  }


  emailValidate(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      console.log(control.value);
      return this.searchEmail(control.value)
        .pipe(
          map((res: { message: string, status: boolean, user: object }) => {
            if (res.status) {
              return {taken: true};
            }
            return null;
          })
        ); // PIPE ENDS HERE
    };
  }
}
