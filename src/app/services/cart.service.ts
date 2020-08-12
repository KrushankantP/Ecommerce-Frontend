import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "./product.service";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {cartModelPublic, cartModelServer} from "../models/cart.model";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {ProductModelServer} from "../models/IProduct";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = environment.baseUrl


  //Data Variable to store the cart information on the client's local storage
  private cartDataClient: cartModelPublic ={
    total:0,
    prodData:[{
      id:0,
      inCart:0
    }]
  };

  //Data Variable to store cart information on the server
  private cartDataServer: cartModelServer={
    total: 0,
    data:[{
      numInCart:0,
      product:undefined
    }]
  }

  // OBSERVABLE for the components to subscribe
    cartTotal$ = new BehaviorSubject<number>(0);
    cartData$ = new BehaviorSubject<cartModelServer>(this.cartDataServer);

  constructor(private _http: HttpClient,
              private _productService: ProductService,
              private _orderService: OrderService,
              private _router: Router) {
      this.cartTotal$.next(this.cartDataServer.total);
      this.cartData$.next(this.cartDataServer);


      // Get the information from local Storage (if any)
      let info: cartModelPublic = JSON.parse(localStorage.getItem('cart'));

        //Check if the info variable is null or has some data in it.
        if(info != null && info !=undefined && info.prodData[0].inCart != 0){

          //Local storage is not empty and has some information
           this.cartDataClient = info;

           //Loop through each entry and put it in the cartDataServer object
            this.cartDataClient.prodData.forEach(p =>{
              this._productService.getSingleProduct(p.id)
                .subscribe((actualProductInfo: ProductModelServer)=>{
                if(this.cartDataServer.data[0].numInCart == 0){
                  this.cartDataServer.data[0].numInCart = p.inCart;
                  this.cartDataServer.data[0].product =actualProductInfo;

                  //TODO create calculateTotal Function and replace it here
                  this.cartDataClient.total = this.cartDataServer.total;
                  localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                }
                else{
                 //CartDataServer already has some entry in it.
                  this.cartDataServer.data.push({
                    numInCart: p.inCart,
                    product: actualProductInfo
                  });

                  //TODO create calculateTotal Function and replace it here
                  this.cartDataClient.total = this.cartDataServer.total;
                  localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                }
                this.cartData$.next({ ...this.cartDataServer});
              });
            });

      }

  }


}
