import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {ProductModelServer, ServerResponse} from "../../models/IProduct";
import {Router} from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  product: ProductModelServer[]=[];

  constructor(private _productService: ProductService,
              private _router:Router) { }

  ngOnInit(): void {

    this._productService.getAllProducts(9).subscribe((prods:ServerResponse) => {
      this.product = prods.products;
      console.log(this.product);
    })

  }

  selectProduct(id: number) {
    this._router.navigate(['/product', id]).then();
  }
}
