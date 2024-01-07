import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import { GlobalService } from "src/app/services/global/global.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"],
})
export class ForgotPasswordPage implements OnInit {
  isLoading: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private global: GlobalService
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.isLoading = true;
    this.authService
      .resetPassword(form.value.email)
      .then((data) => {
        if (data) {
          this.global.showToast("Link sent to your email", "success", "top");
          this.router.navigateByUrl("/login");
        }
        this.isLoading = false;
      })
      .catch((err) => {
        this.isLoading = false;
      });
  }
}
