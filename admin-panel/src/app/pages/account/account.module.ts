import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { LayoutsModule } from '@layouts/layouts.module';

const components = [DashboardComponent, SettingsComponent];

const routes: Routes = [
  {
    path: 'account/dashboard',
    component: DashboardComponent
  },
  {
    path: 'account/settings',
    component: SettingsComponent
  },
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [...components],
  imports: [RouterModule.forRoot(routes), CommonModule, LayoutsModule],
  exports: [...components]
})
export class AccountModule {}
