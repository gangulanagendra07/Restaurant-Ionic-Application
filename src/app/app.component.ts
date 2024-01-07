import { Component } from "@angular/core";
import { AuthService } from "./services/auth/auth.service";
import { StorageService } from "./services/storage/storage.service";
// import { register } from 'swiper/element/bundle';

// register();

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(private auth: AuthService, private storage: StorageService) {
    this.auth
      .getToken()
      .then((token) => {
        this.auth.storeTokenWithSubjects(token);
        const tokenExpired = this.auth.isTokenExpired(token);
        if (tokenExpired) {
          this.storage.removeStorage("maza_kat_token");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
