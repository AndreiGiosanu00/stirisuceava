import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(public authService: AuthService,
              public alertService: AlertService) { }

  ngOnInit(): void {
  }

}
