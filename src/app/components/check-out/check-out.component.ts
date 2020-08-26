import { Component, OnInit } from '@angular/core';
import {CartService} from "@app/services/cart.service";
import {OrderService} from "@app/services/order.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {cartModelServer} from "@app/models/cart.model";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "@app/services/user.service";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  cartTotal: number;
  cartData: cartModelServer;
  checkoutForm: any;
  userId;

  constructor(private _cartService: CartService,
              private _orderService: OrderService,
              private _userService: UserService,
              private _router: Router,
              private _spinner: NgxSpinnerService,
              private _fb: FormBuilder) {

    this.checkoutForm = this._fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],

    });
  }

  ngOnInit(): void {

  this._cartService.cartData$.subscribe(data=> this.cartData = data);
  this._cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this._userService.userData$.subscribe(data => {
      // @ts-ignore
      this.userId = data.userId || data.id;
      console.log(this.userId);
    });
  }

  onCheckOut() {
    if(this.cartTotal>0){
    this._spinner.show()
    this._cartService.checkoutFromCart(this.userId);// this is hardcoded USer ID, this can be done dynamically later.
    }else{
      return;
    }
  }
}
