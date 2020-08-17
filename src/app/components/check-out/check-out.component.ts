import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {OrderService} from "../../services/order.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {cartModelServer} from "../../models/cart.model";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  cartTotal: number;
  cartData: cartModelServer;
  showSpinner: Boolean;
  checkoutForm: any;

  constructor(private _cartService: CartService,
              private _orderService: OrderService,
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
  }

  onCheckOut() {
    this._spinner.show()
    this._cartService.checkoutFromCart(1);// this is hardcoded USer ID, this can be done dynamically later.
  }
}
