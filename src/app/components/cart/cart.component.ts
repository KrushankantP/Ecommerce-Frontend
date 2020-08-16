import { Component, OnInit } from '@angular/core';
import {cartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartData: cartModelServer;
  cartTotal: number;
  subTotal: number;

  constructor(public _cartService: CartService) { }

  ngOnInit(): void {
    this._cartService.cartData$.subscribe((data:cartModelServer) => this.cartData = data);
    this._cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  ChangeQuantity(index: number, increase: boolean) {
    this._cartService.updateCartItems(index, increase);

  }
}
