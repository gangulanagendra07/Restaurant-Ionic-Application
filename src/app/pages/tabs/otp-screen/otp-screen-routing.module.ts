import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpScreenPage } from './otp-screen.page';

const routes: Routes = [
  {
    path: '',
    component: OtpScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpScreenPageRoutingModule {}
