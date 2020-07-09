import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginAdminComponent} from "./login-admin/login-admin.component";
import {AdminPanelComponent} from "./admin-panel/admin-panel.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {AuthGuardService} from "./services/auth-guard.service";
import {LoginGuardService} from "./services/login-guard.service";
import {ArticlePageComponent} from "./article-page/article-page.component";


const routes: Routes = [
  {path: '', component: LandingPageComponent, data: {
      title: 'Știri Suceava - Aici găsești toate știrile din Suceava!',
      description: 'Știri Suceava este o platformă de știri prin care poți accesa toate știrile din județul Suceava. Cu ajutorul algoritmilor de filtrare a știrilor făcut de echipa noastră, platforma oferă știri verificate.',
      ogTitle: 'Știri Suceava - Aici găsești toate știrile din Suceava!',
      ogDescription: 'Știri Suceava este o platformă de știri prin care poți accesa toate știrile din județul Suceava. Cu ajutorul algoritmilor de filtrare a știrilor făcut de echipa noastră, platforma oferă știri verificate.',
      ogImage: 'https://img.svnews.ro/foto/2019/05/30/178716/7616d53af9fe552162181fb95.jpg'
    }},
  {path: 'login-admin', component: LoginAdminComponent, canActivate: [LoginGuardService]},
  {path: 'admin-panel', component: AdminPanelComponent, canActivate: [AuthGuardService]},
  {path: 'articol/:id', component: ArticlePageComponent, data: {
      title: 'Știri Suceava - Aici găsești toate știrile din Suceava!',
      description: 'Știri Suceava este o platformă de știri prin care poți accesa toate știrile din județul Suceava. Cu ajutorul algoritmilor de filtrare a știrilor făcut de echipa noastră, platforma oferă știri verificate.',
      ogTitle: 'Știri Suceava - Aici găsești toate știrile din Suceava!',
      ogDescription: 'Știri Suceava este o platformă de știri prin care poți accesa toate știrile din județul Suceava. Cu ajutorul algoritmilor de filtrare a știrilor făcut de echipa noastră, platforma oferă știri verificate.',
      ogImage: 'https://img.svnews.ro/foto/2019/05/30/178716/7616d53af9fe552162181fb95.jpg'
    }},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
