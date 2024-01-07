import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { GlobalService } from "src/app/services/global/global.service";
import { ProfileService } from "src/app/services/profile/profile.service";

@Component({
  selector: "app-otp-screen",
  templateUrl: "./otp-screen.page.html",
  styleUrls: ["./otp-screen.page.scss"],
})
export class OtpScreenPage implements OnInit {
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: "otp-input-style",
  };
  otp: any;
  otpConfigLength: any;
  constructor(
    private global: GlobalService,
    private authService: AuthService,
    private router: Router,
    private profile: ProfileService
  ) {}

  ngOnInit() {}
  onOtpChange(otp: any) {
    this.otp = otp;
    console.log(otp);
  }
  otpLength(length: any) {
    this.otpConfigLength = length;
  }
  resend() {
    this.global.showLoader();
    this.profile
      .resendOtp()
      .then((data: any) => {
        //this.navigate();
        // this.router.navigateByUrl("/tabs/home");
        if (data?.success) {
          this.global.successToast(
            "An OTP sent to your email for email verification"
          );
        }
        this.global.hideLoader();
      })
      .catch((err) => {
        this.global.hideLoader();
        console.log(err);
        let msg = "something went wrong, please try again";
        if (err?.error?.message) {
          msg = err?.error?.message;
        }
        this.global.showAlert(msg);
      });
  }
  verify() {
    if (this.otp.length != this.otpConfigLength)
      return this.global.showAlert("Please enter correct otp");
    this.global.showLoader();
    this.profile
      .verifyEmailOtp({ verification_otp: this.otp })
      .then((data) => {
        //this.navigate();
        // this.router.navigateByUrl("/tabs/home");
        this.global.hideLoader();
      })
      .catch((err) => {
        this.global.hideLoader();
        console.log(err);
        let msg = "Please enter correct OTP";
        if (err?.error?.message) {
          msg = err?.error?.message;
        }
        this.global.showAlert(msg);
      });
  }
}
