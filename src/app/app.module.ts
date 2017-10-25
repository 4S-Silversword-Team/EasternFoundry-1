import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CorporateProfileComponent } from './pages/corporate-profile/corporate-profile.component';
import { CorporateProfileEditComponent } from './pages/corporate-profile-edit/corporate-profile-edit.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { ProfileCreateComponent } from './pages/profile-create/profile-create.component';
import { AllProfilesComponent } from './pages/all-profiles/all-profiles.component';
import { PastPerformanceComponent } from './pages/past-performance/past-performance.component';
import { PastPerformanceEditComponent } from './pages/past-performance-edit/past-performance-edit.component';
import { NoContentComponent } from './pages/no-content/no-content.component';
import { MyPastPerformancesComponent } from './pages/my-pastperformances/my-pastperformances.component';
import { SearchComponent } from './pages/search/search.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MessageComponent } from './pages/message/message.component';

import { ComponentNameComponent } from './component-name/component-name.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RatingModule } from 'ng2-bootstrap/rating';
import { CarouselModule } from 'ng2-bootstrap/carousel';
import { BsDropdownModule } from 'ng2-bootstrap/dropdown';
import { ButtonsModule } from 'ng2-bootstrap/buttons';
import { ChartsModule } from 'ng2-charts';
import { SelectModule } from 'ng2-select';

import { ROUTES } from './app.routes';
import { BentBarsChartComponent } from './components/bent-bars-chart/bent-bars-chart.component';
import { ColorCommentBoxComponent } from './components/color-comment-box/color-comment-box.component';
import { ExpChartComponent } from './components/exp-chart/exp-chart.component';
import { CareerComponent } from './components/career/career.component';
import { BarchartComponent } from './components/barchart/barchart.component';
import { AvailablebarComponent } from './components/availablebar/availablebar.component';
import { SelectorComponent } from './components/selector/selector.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { ChartModule } from 'angular-highcharts';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    ProfileEditComponent,
    ProfileCreateComponent,
    AllProfilesComponent,
    CorporateProfileComponent,
    PastPerformanceComponent,
    PastPerformanceEditComponent,
    AdminComponent,
    NoContentComponent,
    BentBarsChartComponent,
    ColorCommentBoxComponent,
    ExpChartComponent,
    CareerComponent,
    BarchartComponent,
    AvailablebarComponent, SelectorComponent, CompaniesComponent, CorporateProfileEditComponent, MyPastPerformancesComponent,
    SearchComponent,
    ComponentNameComponent,
    MessageComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RatingModule.forRoot(),
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    SelectModule,
    ChartsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    NguiAutoCompleteModule,
    RouterModule.forRoot(ROUTES, {useHash: true}),
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
