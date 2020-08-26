import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ProductComponent} from "./components/product/product.component";
import {CartComponent} from "./components/cart/cart.component";
import {ThankyouComponent} from "./components/thankyou/thankyou.component";
import {CheckOutComponent} from "./components/check-out/check-out.component";
import {LoginComponent} from "./components/login/login.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProfileGuard} from "./guard/profile.guard";
import {RegisterComponent} from "./components/register/register.component";
import {HomeLayoutComponent} from "./components/home-layout/home-layout.component";
import {AdminComponent} from "@app/components/admin/admin.component";



const routes: Routes = [
  {
    path: '', component: HomeLayoutComponent,
    children: [
      {
        path: '', component: HomeComponent
      },
      {
        path: 'product/:id', component: ProductComponent
      },
      {
        path: 'cart', component: CartComponent
      },
      {
        path: 'checkout', component: CheckOutComponent, canActivate: [ProfileGuard]
      },
      {
        path: 'thankyou', component: ThankyouComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard]
      },
      {
        path: 'register', component: RegisterComponent
      },
      {
        path: 'admin', component: AdminComponent
      },
    ]
  },
    // Wildcard Route if no route is found == 404 NOTFOUND page
    {
        path: '**', pathMatch: 'full', redirectTo: ''
    }

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
