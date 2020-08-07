import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ServerResponse} from "../models/IProduct";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.baseUrl

  constructor(private _http:HttpClient) { }

  //This is to fetch all products from the backend server.
  getAllProducts(numberOfResults=10): Observable<ServerResponse>{
    return this._http.get<ServerResponse>(this.baseUrl +'products', {
      params:{
        limit: numberOfResults.toString()
      }
    })
  }
}
