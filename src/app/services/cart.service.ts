import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "./product.service";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {cartModelPublic, cartModelServer} from "../models/cart.model";
import {BehaviorSubject} from "rxjs";
import {NavigationExtras, Router} from "@angular/router";
import {ProductModelServer} from "../models/IProduct";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = environment.baseUrl


  //Data Variable to store the cart information on the client's local storage
  private cartDataClient: cartModelPublic = {
    total: 0,
    prodData: [{
      id: 0,
      inCart: 0
    }]
  };

  //Data Variable to store cart information on the server
  private cartDataServer: cartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined
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
    if (info != null && info != undefined && info.prodData[0].inCart != 0) {

      //Local storage is not empty and has some information
      this.cartDataClient = info;

      //Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this._productService.getSingleProduct(p.id)
          .subscribe((actualProductInfo: ProductModelServer) => {
            if (this.cartDataServer.data[0].numInCart == 0) {
              this.cartDataServer.data[0].numInCart = p.inCart;
              this.cartDataServer.data[0].product = actualProductInfo;

              //TODO create calculateTotal Function and replace it here
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {
              //CartDataServer already has some entry in it.
              this.cartDataServer.data.push({
                numInCart: p.inCart,
                product: actualProductInfo
              });

              //TODO create calculateTotal Function and replace it here
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            }
            this.cartData$.next({...this.cartDataServer});
          });
      });
    }
  }

  addProductToCart(id: number, quantity?: number) {
    this._productService.getSingleProduct(id).subscribe(prod => {

      // 1. If the cart is empty
      if (this.cartDataServer.data[0].product == undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity != undefined ? quantity : 1;
        //TODO CALCULATE TOTAL AMOUNT

        this.cartDataClient.prodData[0].inCart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});

        //TODO DISPLAY A TOAST NOTIFICATION
      }

      // 2. if the cart has some items
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id == prod.id); // -1 or a positive value

        // a. if that item is already in the cart => index is positive value
        if (index != -1) {
          if (quantity != undefined && quantity <= prod.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ?
              quantity : prod.quantity;
          } else {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ?
              this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }

          this.cartDataClient.prodData[index].inCart = this.cartDataServer.data[index].numInCart;
          //TODO DISPLAY A TOAST NOTIFICATION

        } //END OF IF

        // b. if that item is not in the cart
        else {
          this.cartDataServer.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartDataClient.prodData.push({
            inCart: 1,
            id: prod.id
          });

          //TODO DISPLAY A TOAST NOTIFICATION

          //TODO CALCULATE TOTAL AMOUNT

          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({...this.cartDataServer});
        } // END OF ELSE
      }
    });
  }

  updateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].inCart = data.numInCart;

      //TODO CALCULATE TOTAL AMOUNT
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    } else {
      data.numInCart--;

      if (data.numInCart < 1) {

        //TODO DELETE THE PRODUCT FROM CART
        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].inCart = data.numInCart;

        //TODO CALCULATE TOTAL AMOUNT
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  deleteProductFromCart(index: number) {
    if (window.confirm('Are You sure you want to remove the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);

      //TODO CALCULATE TOTAL AMOUNT
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total == 0) {
        this.cartDataClient = {total: 0, prodData: [{inCart: 0, id: 0}]};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total == 0) {
        this.cartDataServer = {total: 0, data: [{numInCart: 0, product: undefined}]};
        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
      }
    } else {
      //If the user clicks the cancel button
      return;
    }
  }

  private calculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;
      Total += numInCart * price;
    });

    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

}
