import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RestaurantComponent } from "./restaurant/restaurant.component";
import { IonicModule } from "@ionic/angular";
import { LoadingRestaurantComponent } from "./loading-restaurant/loading-restaurant.component";
import { EmptyScreenComponent } from "./empty-screen/empty-screen.component";
import { SearchLocationComponent } from "./search-location/search-location.component";
import { OtpInputComponent } from "./otp-input/otp-input.component";
import { NgOtpInputModule } from "ng-otp-input";

@NgModule({
  declarations: [
    RestaurantComponent,
    LoadingRestaurantComponent,
    EmptyScreenComponent,
    SearchLocationComponent,
    OtpInputComponent,
  ],
  imports: [CommonModule, IonicModule, NgOtpInputModule],
  exports: [
    RestaurantComponent,
    LoadingRestaurantComponent,
    EmptyScreenComponent,
    SearchLocationComponent,
    OtpInputComponent,
  ],
  // declare only components which are not defined in templates
  entryComponents: [SearchLocationComponent],
})
export class ComponentsModule {}
