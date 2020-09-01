import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoadingService} from "./loading.service";
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth: boolean = false;
  headers = new HttpHeaders();

  constructor(private cookieService: CookieService,
              private http: HttpClient,
              private router: Router,
              public loadingService: LoadingService,
              public alertService: AlertService) { }

  login(user: string, password: string) {
    let body = {
      user: user,
      password: password
    };

    this.loadingService.showLoading();
    this.http.post('http://stirisuceava.ro/api/login', body).subscribe((res: any) => {
      this.cookieService.set('authToken', 'Bearer ' + res.token, 7200 * 1000); // 2 hours
      this.isAuth = true;
      this.router.navigate(['admin-panel']);
      this.loadingService.hideLoading();
    });
  }

  logout() {
    this.loadingService.showLoading();
    this.cookieService.delete('authToken');
    this.isAuth = false;
    this.router.navigate(['']);
    this.loadingService.hideLoading();
  }

  isAuthenticated() {
    return this.isAuth;
  }

  showLoginPage() {
    return !this.isAuth;
  }

  scrape() {
    let headers = new HttpHeaders().set('Authorization', this.cookieService.get('authToken'));
    this.loadingService.showLoading();
    this.http.post('http://stirisuceava.ro/api/scrape', null, {headers: headers}).subscribe((res: any) => {
      this.alertService.setAlert('success', res.response);
      this.loadingService.hideLoading();
    }, (err: any) => {
      this.alertService.setAlert('error', err.error);
      this.loadingService.hideLoading();
    });
  }

  deleteAll() {
    let headers = new HttpHeaders().set('Authorization', this.cookieService.get('authToken'));
    this.loadingService.showLoading();
    this.http.post('http://stirisuceava.ro/api/delete-all', null, {headers: headers}).subscribe((res: any) => {
      this.alertService.setAlert('success', res.response);
      this.loadingService.hideLoading();
    }, (err: any) => {
      this.alertService.setAlert('error', err.error);
    });
  }
}
