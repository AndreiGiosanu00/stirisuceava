import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from '../services/loading.service';
import {Meta, Title} from '@angular/platform-browser';

declare let $: any;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  articles = [];
  limit = 10;
  moreNews: boolean;

  constructor(private http: HttpClient,
              public loadingService: LoadingService,
              private title: Title,
              private meta: Meta) {
    this.loadingService.showLoading();
    http.get('https://stirisuceava.ro/api/articles').subscribe((res: any) => {
      this.articles = res;
      this.moreNews = this.articles.length > 10;
      this.filterArticles();
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Știri Suceava - Aici găsești toate știrile din Suceava!');
    this.meta.updateTag({ name: 'description', content: 'Știri Suceava este o platformă de știri prin care poți accesa ' +
        'toate știrile din județul Suceava. Cu ajutorul algoritmilor de filtrare a știrilor făcut de echipa noastră, platforma ' +
        'oferă știri verificate.' });
  }

  filterArticles() {
    this.articles.forEach((article) => {
      if (article.imgSrc.includes('googleusercontent.com') || article.imgSrc.includes('https://corporatebusinessevents.ro/events/wp-content/uploads/2017/03/Monitorul.jpg')) {
        article.imgSrc = './assets/logo.png';
      }
      article.link.slice(0, -1);
    });

    this.shuffleArray(this.articles);
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

  increaseLimit() {
    if (this.limit <= this.articles.length) {
      this.limit += 10;
      this.moreNews = this.limit < this.articles.length;
    }
  }

  shuffleArray(array: any) {
    let m = array.length, t, i;

    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }
}
