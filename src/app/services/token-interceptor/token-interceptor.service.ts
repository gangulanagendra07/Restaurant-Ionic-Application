import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "../storage/storage.service";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private storage: StorageService,
    private authService: AuthService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isApiUrl = req.url.startsWith(environment.serverBaseUrl);
    const token = this.authService.isLoggedIn();
    console.log(token);
    if (token && isApiUrl) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req);
    // throw new Error('Method not implemented.');
  }
}
