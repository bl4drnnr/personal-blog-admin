import player from 'lottie-web';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutsModule } from '@layouts/layouts.module';
import { ComponentsModule } from '@components/components.module';
import { PagesModule } from '@pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TranslocoRootModule } from './transloco-root.module';

// @TODO Implement credentials functions on the back-end
// @TODO Implement languages on all projects
// @TODO Post translation and language selection
// @TODO Translation of admin panel
// @TODO Translation of blog front
// @TODO SEO optimization of blog front
// @TODO Deployment of all parts of infrastructure
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutsModule,
    ComponentsModule,
    TranslocoRootModule,
    PagesModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideLottieOptions({
      player: () => player
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
