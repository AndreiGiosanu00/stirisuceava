import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {AlertService} from "../services/alert.service";
import {HttpClient} from '@angular/common/http';
import {LoadingService} from '../services/loading.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  articles = [];
  displayedColumns: string[] = ['date', 'link', 'title', 'source', 'edit', 'delete'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(public authService: AuthService,
              public alertService: AlertService,
              public loadingService: LoadingService,
              private http: HttpClient) {
    loadingService.showLoading();
    http.get('https://stirisuceava.ro/api/articles').subscribe((res: any) => {
      this.articles = res;
      this.filterArticles();
      this.dataSource = new MatTableDataSource<any>(this.articles);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      loadingService.hideLoading();
    });
  }

  ngOnInit(): void {}

  filterArticles() {
    this.articles.forEach((article) => {
      if (article.imgSrc.includes('googleusercontent.com') || article.imgSrc.includes('https://corporatebusinessevents.ro/events/wp-content/uploads/2017/03/Monitorul.jpg')) {
        article.imgSrc = './assets/logo.png';
      }
      article.link.slice(0, -1);
    });
    this.articles.sort((a, b) => {
      if (this.stringToDate(b) > this.stringToDate(a)) {
        return 1
      }
      return -1;
    });
    this.loadingService.hideLoading();
  }

  stringToDate(article: any) {
    const months = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie',
      'octombrie', 'noiembrie', 'decembrie'];
    let dateElements = article.date.split(' ', 3);
    let date = (months.indexOf(dateElements[0]) + 1) + '/' + dateElements[1].slice(0, -1) + '/' + dateElements[2];
    let resultDate = new Date(date);
    return resultDate;
  }

}
