import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { GlobalService } from "src/app/services/global/global.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"],
})
export class SignupPage implements OnInit {
  type: boolean = true;
  isLogin: boolean;
  constructor(
    private authService: AuthService,
    private router: Router,
    private global: GlobalService
  ) {}

  ngOnInit() {}

  changeType() {
    this.type = !this.type;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.signUp(form);
  }
  signUp(form: NgForm) {
    this.isLogin = true;
    console.log(form);
    // let formData = {
    //   email: form.value.email
    // }
    this.authService
      .signup(form.value)
      .then((data) => {
        //this.navigate();
        this.router.navigateByUrl("/tabs/home");

        this.isLogin = false;
        form.reset();
        this.global.successToast(
          "An OTP sent to your email for email verification"
        );
      })
      .catch((err) => {
        this.isLogin = false;
        console.log(err);
        let msg = "Could not signup, please try again";
        if (err?.error?.message) {
          msg = err?.error?.message;
        }
        this.global.showAlert(msg);
      });
  }
  navigate() {
    this.router.navigateByUrl("/tabs/otp-screen");
  }
}
