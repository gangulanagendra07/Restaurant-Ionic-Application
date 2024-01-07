import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Order } from "src/app/models/order.model";
import { AuthService } from "src/app/services/auth/auth.service";
import { CartService } from "src/app/services/cart/cart.service";
import { OrderService } from "src/app/services/order/order.service";
import { StorageService } from "src/app/services/storage/storage.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.page.html",
  styleUrls: ["./account.page.scss"],
})
export class AccountPage implements OnInit, OnDestroy {
  profile: any = {};
  isLoading: boolean;
  orders: Order[] = [];
  ordersSub: Subscription;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private storage: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.ordersSub = this.orderService.orders.subscribe(
      (order) => {
        this.orders = order;
        // if(order instanceof Array) {
        //   this.orders = order;
        // } else {
        //   if(order?.delete) {
        //     this.orders = this.orders.filter(x => x.id != order.id);
        //   } else if(order?.update) {
        //     const index = this.orders.findIndex(x => x.id == order.id);
        //     this.orders[index] = order;
        //   } else {
        //     this.orders = this.orders.concat(order);
        //   }
        // }
      },
      (e) => {
        console.log(e);
      }
    );
    this.getData();
  }

  async getData() {
    this.isLoading = true;
    setTimeout(async () => {
      this.profile = {
        name: "Nagendra Gangula",
        phone: "9109109100",
        email: "technyks@gmail.com",
      };
      await this.orderService.getOrders();
      this.isLoading = false;
    }, 3000);
  }

  logout() {
    this.authService.logout();
  }

  async reorder(order: Order) {
    console.log(order);
    let data = await this.cartService.getCart();
    console.log("data: ", data);
    if (data?.value) {
      this.cartService.alertClearCart(null, null, null, order);
    } else {
      this.cartService.orderToCart(order);
    }
  }

  getHelp(order) {
    console.log(order);
  }

  ngOnDestroy() {
    if (this.ordersSub) this.ordersSub.unsubscribe();
  }
}
