import { Injectable } from "@angular/core";
import { CanLoad, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canLoad():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const token = this.authService.isLoggedIn();
    if (token) {
      return true;
    } else {
      this.router.navigateByUrl("/login", { replaceUrl: true });
      return false;
    }
  }
}
