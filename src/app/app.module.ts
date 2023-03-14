import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { HomeComponent } from '@pages/home/home.component';
import { LoginComponent } from '@pages/login/login.component';
import { PostsComponent } from '@pages/posts/posts.component';
import { ProjectsComponent } from '@pages/projects/projects.component';
import { ProjectComponent } from '@pages/project/project.component';
import { PostComponent } from '@pages/post/post.component';
import { LinkComponent } from '@components/link/link.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GlobalMessageComponent } from '@components/global-message/global-message.component';
import { RegistrationComponent } from '@pages/registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    LoginComponent,
    PostsComponent,
    ProjectsComponent,
    ProjectComponent,
    PostComponent,
    LinkComponent,
    GlobalMessageComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
