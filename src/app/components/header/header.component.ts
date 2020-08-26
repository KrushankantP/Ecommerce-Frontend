import { Component, OnInit } from '@angular/core';
import {cartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData: cartModelServer;
  cartTotal: number;
  authState: boolean;

  constructor(public _cartService: CartService,
              private _userService: UserService) { }

  ngOnInit(): void {
    this._cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this._cartService.cartData$.subscribe(data=> this.cartData = data);

    this._userService.authState$.subscribe(authState => this.authState = authState)
  }

}
