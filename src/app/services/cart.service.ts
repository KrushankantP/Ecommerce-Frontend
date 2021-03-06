import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "./product.service";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {cartModelPublic, cartModelServer} from "../models/cart.model";
import {BehaviorSubject} from "rxjs";
import {NavigationExtras, Router} from "@angular/router";
import {ProductModelServer} from "../models/IProduct";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";

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
              private _router: Router,
              private _toast: ToastrService,
              private _spinner: NgxSpinnerService) {
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

              this.calculateTotal() // CALCULATE TOTAL AMOUNT

              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            } else {

              //CartDataServer already has some entry in it.
              this.cartDataServer.data.push({
                numInCart: p.inCart,
                product: actualProductInfo
              });

              this.calculateTotal() // CALCULATE TOTAL AMOUNT
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

        this.calculateTotal(); // CALCULATE TOTAL AMOUNT

        this.cartDataClient.prodData[0].inCart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});

        // DISPLAY A TOAST NOTIFICATION FOR PRODUCT ADD TO CART.
        this._toast.success(`${prod.name} added to the cart`,'Product Added', {
          timeOut:1500,
          progressBar:true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });

      }

      // 2. If the cart has some items
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id == prod.id); // -1 or a positive value

        // (A). if that item is already in the cart => index is positive value
        if (index != -1) {
          if (quantity != undefined && quantity <= prod.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ?
              quantity : prod.quantity;
          }
          else {
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ :
              prod.quantity;
          }

          this.cartDataClient.prodData[index].inCart = this.cartDataServer.data[index].numInCart;
          this.calculateTotal() // CALCULATE TOTAL AMOUNT
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          //DISPLAY A TOAST NOTIFICATION for QUANTITY UPDATES.
          this._toast.info(`${prod.name} quantity updated in the cart`,'Product updated', {
            timeOut:1500,
            progressBar:true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });


        } //END OF IF

        // (B). If that item is not in the cart Array.
        else {
          this.cartDataServer.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartDataClient.prodData.push({
            inCart: 1,
            id: prod.id
          });

          //DISPLAY A TOAST NOTIFICATION FOR PRODUCT ADD TO CART.
          this._toast.success(`${prod.name} added to the cart`,'Product Added', {
            timeOut:1500,
            progressBar:true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

          this.calculateTotal() // CALCULATE TOTAL AMOUNT

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

      this.calculateTotal()//CALCULATE TOTAL AMOUNT

      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
    } else {
      data.numInCart--;

      if (data.numInCart < 1) {

        this.deleteProductFromCart(index); //DELETE THE PRODUCT FROM CART

        this.cartData$.next({...this.cartDataServer});
      } else {
        this.cartData$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].inCart = data.numInCart;

        this.calculateTotal()//CALCULATE TOTAL AMOUNT
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  deleteProductFromCart(index: number) {
    if (window.confirm('Are You sure you want to remove the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);

      this.calculateTotal(); // CALCULATE TOTAL AMOUNT

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

  calculateSubTotal(index): Number {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    // @ts-ignore
    subTotal = p.product.price * p.numInCart;

    return subTotal;
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

  checkoutFromCart(userId: number){

    this._http.post(this.baseUrl+ 'orders/payment', null)
      .subscribe((res:{success:boolean}) =>{
        if(res.success){
          this.resetServerData(); // reset the server Data.
          this._http.post(this.baseUrl+'orders/new', {
            userId: userId,
            products: this.cartDataClient.prodData
          }).subscribe((data:OrderResponse)=>{
            this._orderService.getSingleOrder(data.order_id).then(prods =>{
              if(data.success){
                const navigationExtras: NavigationExtras = {
                  state: {
                    message: data.message,
                    products: prods,
                    orderId: data.order_id,
                    total: this.cartDataClient.total
                  }
                };

                this._spinner.hide(); // HIDE SPINNER

                this._router.navigate(['thankyou'], navigationExtras).then( p=>{
                  this.cartDataClient = {total:0, prodData: [{inCart:0, id:0}]};
                  this.cartTotal$.next(0);
                  localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
                });
              }
            });
          });
        }
        else{
          this._spinner.hide()// HIDE SPINNER

          this._router.navigateByUrl('checkout').then();

          //DISPLAY A TOAST NOTIFICATION FOR PRODUCT ADD TO CART.
          this._toast.error(`Sorry, failed to place an order`,'Order Status', {
            timeOut:1500,
            progressBar:true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
      });
  }

  private resetServerData(){
    this.cartDataServer = {
      total: 0,
      data: [{
        numInCart: 0,
        product: undefined
      }]
    };

    this.cartData$.next({...this.cartDataServer});
  }
}
interface OrderResponse {
  order_id : number;
  success : boolean;
  message : string;
  products : [{
    id : string,
    numInCart: string
  }];
}
