import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { IonModal, ModalController } from "@ionic/angular";
import { toArray } from "rxjs/operators";
import { AuthService } from "src/app/services/auth/auth.service";
import { GlobalService } from "src/app/services/global/global.service";
import { OverlayEventDetail } from "@ionic/core/components";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  // iconName: string = "eye-outline";
  // type: string = "password";
  type: boolean = true;
  isLogin: boolean = false;
  name: string = "";
  email: string = "";
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild("forgot_pwd_modal") forgot_pwd_modal: ModalController;
  message =
    "This modal example uses triggers to automatically open a modal when the button is clicked.";
  reset_password_Model = {
    email: "",
    otp: "",
    new_password: "",
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private global: GlobalService
  ) {}
  ngOnInit() {
    this.isLoggedIn();
  }
  async isLoggedIn() {
    try {
      this.global.showLoader();
      const token = await this.authService.getToken();
      if (token) this.navigate();
      this.global.hideLoader();
      console.log(token);
    } catch (err) {
      console.log(err);
      this.global.hideLoader();
    }
  }

  changeType() {
    this.type = !this.type;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.login(form);
  }
  login(form: any) {
    this.isLogin = true;
    console.log(form);
    this.authService
      .login(form.value.email, form.value.password)
      .then((data) => {
        this.navigate();
        this.isLogin = false;
        form.reset();
      })
      .catch((err) => {
        this.isLogin = false;
        console.log(err);
        let msg = "Could not login, please try again";
        if (err?.error?.err) {
          msg = err?.error?.err;
        }
        this.global.showAlert(msg);
      });
  }
  navigate() {
    this.router.navigateByUrl("/tabs");
  }
  // Modal Implementation
  cancel() {
    this.modal.dismiss(null, "cancel");
  }

  confirm() {
    this.modal.dismiss(this.name, "confirm");
  }

  onWillDismiss(event: Event) {
    console.log(event);
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === "confirm") {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
  sendEmailOtp(email: any) {
    this.email = email;
    this.global.showLoader();
    this.authService
      .resetPasswordSendOtp(email)
      .then((data) => {
        this.reset_password_Model = { ...this.reset_password_Model, email };
        this.global.hideLoader();
      })
      .catch((err) => {
        console.log(err);
        let msg = "something went wrong, Please try again.!";
        if (err?.error?.err) {
          msg = err?.error?.err;
        }
        this.global.showAlert(msg);
        this.global.hideLoader();
      });
  }
  verityResetOtp(otp: any) {
    this.global.showLoader();
    this.authService
      .verifyResetPasswordOtp(this.email, otp)
      .then((data) => {
        this.reset_password_Model = { ...this.reset_password_Model, otp };
        this.global.hideLoader();
      })
      .catch((err) => {
        console.log(err);
        let msg = "something went wrong, Please try again.!";
        if (err?.error?.err) {
          msg = err?.error?.err;
        }
        this.global.showAlert(msg);
        this.global.hideLoader();
      });
    this.reset_password_Model = { ...this.reset_password_Model, otp };
  }
  resetPassword(new_password: any) {
    this.global.showLoader();
    this.reset_password_Model = { ...this.reset_password_Model, new_password };
    this.authService
      .resetPassword(this.reset_password_Model)
      .then((data) => {
        this.global.successToast(
          "Password updated successfully, please login now"
        );
        this.global.hideLoader();
      })
      .catch((err) => {
        console.log(err);
        let msg = "something went wrong, Please try again.!";
        if (err?.error?.err) {
          msg = err?.error?.err;
        }
        this.global.showAlert(msg);
        this.global.hideLoader();
      });

    this.forgot_pwd_modal.dismiss();
  }
  reset(event: any) {
    this.reset_password_Model = {
      email: "",
      otp: "",
      new_password: "",
    };
  }
}
