import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private products: ProductResponseModel[] =[];
  private baseUrl = environment.baseUrl

  constructor(private _http: HttpClient) { }


  getSingleOrder(orderId: number){
    return this._http.get<ProductResponseModel[]>(this.baseUrl + '/orders' + orderId).toPromise();
  }
}

interface ProductResponseModel {
 id: number;
 title:string;
 description:string;
 price: number;
 quantityOrdered: number;
 image:string;
}
