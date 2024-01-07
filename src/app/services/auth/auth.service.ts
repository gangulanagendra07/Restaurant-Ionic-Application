import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from } from "rxjs";
import { StorageService } from "../storage/storage.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { User } from "src/app/models/user.model";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _token$ = new BehaviorSubject<string>(null);

  get token() {
    return this._token$.asObservable();
  }

  SERVER_BASE_URL = environment.serverBaseUrl;
  constructor(
    private storage: StorageService,
    private http: HttpClient,
    private router: Router
  ) {}

  storeTokenWithSubjects(value: string) {
    this._token$.next(value);
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const data = {
        email: email,
        password: password,
      };
      const paramsData = new HttpParams({
        fromObject: data,
      });
      console.log(data);
      const response: any = await this.http
        .get(`${this.SERVER_BASE_URL}/user/login`, { params: paramsData })
        .toPromise();
      this.setUserData(response?.token);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async signup(formValues: any): Promise<any> {
    try {
      const data = {
        email: formValues.email,
        name: formValues.name,
        phone: formValues.phone,
        type: "user",
        status: "active",
        password: formValues.password,
      };
      console.log(data);
      const response: any = await this.http
        .post(`${this.SERVER_BASE_URL}/user/signup`, data)
        .toPromise();
      this.setUserData(response?.token);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async getToken() {
    return (await this.storage.getStorage("maza_kat_token")).value;
  }
  isLoggedIn() {
    // return from(this.getToken());
    console.log(this._token$.value);
    return this._token$.value;
  }
  setUserData(token: string, user?: any) {
    // const data = {
    //   email: user.email,
    //   type: user.type,
    // };
    this.storage.setStorage("maza_kat_token", token);
    this.storeTokenWithSubjects(token);
    //this.storage.setStorage("maza_kat_user_data", JSON.stringify(data));
  }
  isTokenExpired(token: any) {
    const decodeToken: any = this.decodeToken(token);
    if (!decodeToken && !decodeToken?.exp) {
      return true;
    }
    return Date.now() >= decodeToken.exp * 1000;
  }

  decodeToken(token: any): any {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async resetPasswordSendOtp(email: string) {
    try {
      const data = { email: email };
      const paramsData = new HttpParams({
        fromObject: data,
      });
      console.log(data);
      const response: any = await this.http
        .get(`${this.SERVER_BASE_URL}/user/send/reset/password/token`, {
          params: paramsData,
        })
        .toPromise();
      return response;
    } catch (err) {
      throw err;
    }
  }

  async verifyResetPasswordOtp(email: any, otp: any) {
    try {
      const data = {
        email,
        reset_password_token: otp,
      };
      const paramsData = new HttpParams({
        fromObject: data,
      });
      const response: any = await this.http
        .get(`${this.SERVER_BASE_URL}/user/verify/resetPasswordToken`, {
          params: paramsData,
        })
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
  logout() {
    this.storage.removeStorage("maza_kat_token");
    this._token$.next(null);
    this.router.navigateByUrl("/login", { replaceUrl: true });
  }

  async resetPassword(data: any) {
    try {
      const response: any = await this.http
        .patch(`${this.SERVER_BASE_URL}/user/resetpassword`, data)
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
