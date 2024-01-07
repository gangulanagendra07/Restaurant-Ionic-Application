import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "src/app/models/user.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private _profile = new BehaviorSubject<User>(null);
  get profile() {
    return this._profile.asObservable();
  }
  URL = environment.serverBaseUrl;
  constructor(private http: HttpClient) {}

  async getProfile() {
    try {
      const profileData: any = await this.http.get(`${this.URL}/user/profile`);
      const data = new User(
        profileData?.email,
        profileData?.phone,
        profileData?.name,
        profileData?._id,
        profileData?.type,
        profileData?.status,
        profileData?.email_verified
      );
      this._profile.next(profileData);
    } catch (error) {
      console.log(error);
    }
  }

  updateProfile(profile: any, params: any) {
    try {
      const data = new User(
        profile.name,
        profile.email,
        profile.phone,
        profile._id
      );
      this._profile.next(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  resendOtp() {
    return this.http
      .get(`${this.URL}/user/send/verification/email`)
      .toPromise();
  }
  verifyEmailOtp(data: any) {
    try {
      const body = new HttpParams({
        fromObject: data.verification_otp,
      });
      return this.http
        .patch(`${this.URL}/user/verify`, { params: body })
        .toPromise();
    } catch (error) {
      throw error;
    }
  }
}
