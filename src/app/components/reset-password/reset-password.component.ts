import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  [x: string]: any;
  @Output() checkEmail = new EventEmitter();
  @Output() verify_otp = new EventEmitter();
  @Output() set_password = new EventEmitter();
  @Input() model: any;
  otp: any;
  otpConfigLength: any;
  flag: number;
  type: boolean = true;
  constructor() {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form?.valid) return;
    if (this.flag == 1) this.checkEmail.emit(form.value.email);
    else if (this.flag == 2) this.verify_otp.emit(this.otp);
    else this.set_password.emit(form.value.new_password);
  }

  changeType() {
    this.type = !this.type;
  }
  onOtpChange(otp: any) {
    this.otp = otp;
    console.log(otp);
  }
  otpLength(length: any) {
    this.otpConfigLength = length;
  }
  getData() {
    let data: any = {};
    if (this.model?.email == "" && this.model?.otp == "") {
      data = {
        title: "Forgot Password",
        subTitle:
          "Enter your email for verification process, we'll send a verification code to your email",
        button: "SENT OTP",
      };
      this.otp = "";
      this.flag = 1;
    } else if (this.model?.email != "" && this.model?.otp == "") {
      data = {
        title: "Verify Your Email",
        subTitle: "Enter verification code sent to your email",
        button: "Verify",
      };
      this.flag = 2;
    } else {
      data = {
        title: "Reset Password",
        subTitle:
          "Enter your new password, must be at least 8 characters long.",
        button: "SAVE",
      };
      this.flag = 3;
    }
    return data;
  }
}
