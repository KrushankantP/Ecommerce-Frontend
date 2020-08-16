import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {CartService} from "../../services/cart.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {map} from "rxjs/operators";

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  id: number;
  product;
  thumbImages: any[] = [];
  @ViewChild('quantity') quantityImport;

  constructor(private _productService:ProductService,
              private _cartService: CartService,
              private _acRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._acRoute.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.id
        })
      )
      .subscribe(prodId => {
        this.id =prodId;
        this._productService.getSingleProduct(this.id).subscribe(prod=>{
          this.product = prod;
          console.log(this.product);

          if(prod.images != null){
            this.thumbImages = prod.images.split(';');
          }
        })
      })

  }

  ngAfterViewInit(): void {
    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }

  }
  increase() {
      let value = parseInt(this.quantityImport.nativeElement.value);

      if(this.product.quantity >=1) {
        value++;

        if (value > this.product.quantity) {
          value = this.product.quantity;
        }
      }
      else{
        return;
      }
      this.quantityImport.nativeElement.value =value.toString();
  }
  decrease() {

    let value = parseInt(this.quantityImport.nativeElement.value);

    if(this.product.quantity > 0) {
      value--;

      if (value <= 1) {
        value = 1;
      }
    }
    else{
      return;
    }
    this.quantityImport.nativeElement.value =value.toString();
  }


  addToCart(id: number) {
    this._cartService.addProductToCart(id, this.quantityImport.nativeElement.value);
  }
}
