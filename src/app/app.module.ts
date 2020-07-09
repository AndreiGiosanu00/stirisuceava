import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import { ArticlePageComponent } from './article-page/article-page.component';
import { NavComponent } from './nav/nav.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import {MatCardModule} from "@angular/material/card";
import { FooterComponent } from './footer/footer.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminPanelComponent,
    LandingPageComponent,
    LoginAdminComponent,
    ArticlePageComponent,
    NavComponent,
    LoadingSpinnerComponent,
    FooterComponent,
    AlertComponent
  ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'stirisuceava-fe' }),
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatCardModule
    ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
