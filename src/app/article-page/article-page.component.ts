import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LoadingService} from "../services/loading.service";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit, AfterViewInit {
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
              private meta: Meta,
              private elementRef: ElementRef) {
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

  ngAfterViewInit(): void {
    // Ad push
    let adPush = document.createElement("script");
    adPush.type = "text/javascript";
    adPush.src = "//p411500.clksite.com/adServe/banners?tid=411500_807434_7";
    this.elementRef.nativeElement.appendChild(adPush);
  }

}
