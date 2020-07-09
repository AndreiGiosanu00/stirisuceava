import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _showLoadingSpinner: boolean = false;

  constructor() { }

  public showLoading() {
    this._showLoadingSpinner = true;
  }

  public hideLoading() {
    this._showLoadingSpinner = false;
  }

  get showLoadingSpinner() {
    return this._showLoadingSpinner;
  }
}
