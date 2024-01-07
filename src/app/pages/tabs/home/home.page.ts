import { Component, OnDestroy, OnInit } from "@angular/core";
import { Address } from "src/app/models/address.model";
import { Restaurant } from "src/app/models/restaurant.model";
import { AddressService } from "src/app/services/address/address.service";
import { ApiService } from "src/app/services/api/api.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { GlobalService } from "src/app/services/global/global.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  banners: any[] = [];
  restaurants: Restaurant[] = [];
  isLoading: boolean = false;
  location = {} as Address;

  constructor(
    private api: ApiService,
    private addressService: AddressService,
    private globalService: GlobalService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log(this.authService.isLoggedIn());
    this.addressService.addressChange.subscribe(
      (address: any) => {
        if (address & address?.lat) {
          if (!this.isLoading) this.isLoading = true;
          this.location = address;
          this.nearByApiCall(address.lat, address.lng);
        }
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.globalService.errorToast();
      }
    );
    this.isLoading = true;
    setTimeout(() => {
      this.banners = this.api.banners;
      this.restaurants = this.api.restaurants;
      this.isLoading = false;
    }, 3000);
  }
  nearByApiCall(lat: any, lng: any) {
    this.restaurants = this.api.restaurants;
  }
}
