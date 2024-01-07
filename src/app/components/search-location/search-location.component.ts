import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { GlobalService } from "src/app/services/global/global.service";
import { GoogleMapsService } from "src/app/services/google-maps/google-maps.service";
import { LocationService } from "src/app/services/location/location.service";
import { Address } from "../../models/address.model";
import { AddressService } from "src/app/services/address/address.service";

@Component({
  selector: "app-search-location",
  templateUrl: "./search-location.component.html",
  styleUrls: ["./search-location.component.scss"],
})
export class SearchLocationComponent implements OnInit, OnDestroy {
  query: string;
  places: any[] = [];
  placeSub$: Subscription;
  @Input() from: any;
  savedPlaces: Address[] = [];
  addressSub$: Subscription;
  constructor(
    private global: GlobalService,
    private maps: GoogleMapsService,
    private locationService: LocationService,
    private addressServices: AddressService
  ) {}

  ngOnInit() {
    this.placeSub$ = this.maps._places.subscribe((place: any) => {
      this.places = place;
    });
    if (this.from) {
      this.getSavedPlaces();
    }
  }
  async onSearchChange(event: any) {
    console.log(event);
    this.global.showLoader();
    this.query = event.detail.value;
    if (this.query.length > 0) await this.maps.getPlaces(this.query);
    this.global.hideLoader();
  }
  dismiss(val?: any) {
    this.global.modalDismiss(val);
  }
  choosePlace(place: any) {
    console.log(place);
    this.dismiss(place);
  }
  async getSavedPlaces() {
    this.global.showLoader();
    this.addressSub$ = this.addressServices.addresses.subscribe((address) => {
      this.savedPlaces = address;
    });
    await this.addressServices.getAddresses();
    this.global.hideLoader();
  }
  selectSavedPlace(place: any) {
    this.dismiss(place);
  }

  async getCurrentLocation() {
    try {
      this.global.showLoader();
      const position = await this.locationService.getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const result = await this.maps.getAddress(latitude, longitude);
      const places = {
        location_name: result.address_components[0].short_name,
        address: result.formatted_address,
        lat: latitude,
        lng: longitude,
      };
      this.global.hideLoader();
      this.dismiss(places);
    } catch (error) {
      this.global.hideLoader();
      this.global.errorToast(
        "Check whether GPS is enabled & the App has it's permissions",
        5000
      );
    }
  }

  ngOnDestroy() {
    if (this.placeSub$) this.placeSub$.unsubscribe();
    if (this.addressSub$) this.addressSub$.unsubscribe();
  }
}
