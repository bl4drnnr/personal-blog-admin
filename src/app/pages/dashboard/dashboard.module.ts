import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '@pages/account/account.component';

const routes: Routes = [
  {
    path: 'account/dashboard',
    component: AccountComponent
  }
];

const components = [AccountComponent];

@NgModule({
  declarations: [...components],
  imports: [RouterModule.forRoot(routes), CommonModule, NgOptimizedImage],
  exports: [...components]
})
export class DashboardModule {}
