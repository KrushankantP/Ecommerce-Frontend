import { Component, OnInit } from '@angular/core';
import {CartService} from "../../services/cart.service";
import {OrderService} from "../../services/order.service";
import {Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {cartModelServer} from "../../models/cart.model";

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  cartTotal: number;
  cartData: cartModelServer;


  constructor(private _cartService: CartService,
              private _orderService: OrderService,
              private _router: Router,
              private _spinner: NgxSpinnerService) { }

  ngOnInit(): void {

  this._cartService.cartData$.subscribe(data=> this.cartData = data);
  this._cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  onCheckOut() {
    this._spinner.show()
    this._cartService.checkoutFromCart(1);// this is hardcoded USer ID, this can be done dynamically later.
  }
}
