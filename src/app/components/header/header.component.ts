import { Component, OnInit } from '@angular/core';
import {cartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData: cartModelServer;
  cartTotal: number;

  constructor(public _cartService: CartService) { }

  ngOnInit(): void {
    this._cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this._cartService.cartData$.subscribe(data=> this.cartData = data);
  }

}
