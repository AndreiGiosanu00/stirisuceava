import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LoadingService} from "../services/loading.service";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit {

  article = {
    title: '',
    imgSrc: '',
    source: '',
    link: '',
    content: '',
    date: ''
  };

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private loadingService: LoadingService,
              private title: Title,
              private meta: Meta) {
    loadingService.showLoading();
    let params = new HttpParams().append('id', this.route.snapshot.paramMap.get('id'));

    http.get('https://stirisuceava.ro/api/article', {params: params}).subscribe((res: any) => {
      this.article = res.article;
      loadingService.hideLoading();

      this.title.setTitle('Știri Suceava - ' + this.article.title);
      this.meta.addTag({name: 'description', content: this.article.title});
      this.meta.addTag({property: 'og:image', content: this.article.imgSrc});
      this.meta.updateTag({name: 'description', content: this.article.title});
      this.meta.updateTag({property: 'og:image', content: this.article.imgSrc});
      this.meta.updateTag({property: 'og:title', content: this.article.title});
      this.meta.updateTag({property: 'og:description', content: 'Știri Suceava - ' + this.article.title});
    });
  }

  ngOnInit(): void {}

}
