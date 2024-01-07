import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TabsPage } from "./tabs.page";
import { AuthGuard } from "src/app/gaurds/auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomePageModule),
      },
      {
        path: "cart",
        loadChildren: () =>
          import("./cart/cart.module").then((m) => m.CartPageModule),
      },
      {
        path: "search",
        loadChildren: () =>
          import("./search/search.module").then((m) => m.SearchPageModule),
      },
      {
        path: "account",
        loadChildren: () =>
          import("./account/account.module").then((m) => m.AccountPageModule),
      },
      {
        path: "",
        redirectTo: "/tabs/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "restaurants/:restaurantId",
    loadChildren: () =>
      import("./items/items.module").then((m) => m.ItemsPageModule),
  },
  {
    path: "address",
    loadChildren: () =>
      import("./address/address.module").then((m) => m.AddressPageModule),
  },
  {
    path: "otp-screen",
    loadChildren: () =>
      import("./otp-screen/otp-screen.module").then(
        (m) => m.OtpScreenPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
