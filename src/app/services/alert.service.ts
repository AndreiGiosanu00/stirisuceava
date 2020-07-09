import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  type = 'info';
  message = '';
  show: boolean = false;

  constructor() { }

  setAlert(type: string, message: string) {
    this.type = type;
    this.message = message;
    this.showAlert();
  }

  showAlert() {
    this.show = true;
  }

  hideAlert() {
    this.show = false;
  }
}
