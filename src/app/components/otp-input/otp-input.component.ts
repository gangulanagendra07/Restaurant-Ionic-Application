import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-otp-input",
  templateUrl: "./otp-input.component.html",
  styleUrls: ["./otp-input.component.scss"],
})
export class OtpInputComponent implements OnInit {
  // @Input() config: any;
  @Output() onOTPChangeEvent = new EventEmitter();
  @Output() otpLength = new EventEmitter();
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: "otp-input-style",
  };
  constructor() {}

  ngOnInit() {
    this.otpLength.emit(this.config.length);
  }

  onOtpChange(event: any) {
    this.onOTPChangeEvent.emit(event);
  }
}
