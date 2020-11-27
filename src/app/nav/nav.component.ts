import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AlertService} from '../services/alert.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input() logOut: boolean = false;

  constructor(public authService: AuthService,
              public alertService: AlertService) { }

  ngOnInit(): void {
  }

}
