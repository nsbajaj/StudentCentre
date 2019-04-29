import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { NavbarComponent } from './navbar.component';
import { ContentComponent } from './content.component';
import { FooterComponent } from './footer.component';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AboutComponent } from './about.component';
import { StudentsComponent } from './students.component';
import { HelpComponent } from './help.component';
import { StudentDetailComponent } from './student-detail.component';
import { AvailablecoursesComponent } from './availablecourses.component';
import { ShoppingcartComponent } from './shoppingcart.component';
import { CartSelectedGridComponent } from './cart-selected-grid.component';
import { CartSelectedListComponent } from './cart-selected-list.component';
import { CartSelectedCellComponent } from './cart-selected-cell.component';
import { JwtModule } from "@auth0/angular-jwt";
import { TokenViewComponent } from './token-view.component';
import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';
import { DataModelManagerService } from './data-model-manager.service';
import { GuardAuthService } from './guard-auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptTokenService } from "./intercept-token.service";
import { FormsModule }   from '@angular/forms';
import { ActivateComponent } from './activate.component';
import { CreateComponent } from './create.component';
import { LogoutComponent } from './logout.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    ContentComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    AboutComponent,
    StudentsComponent,
    HelpComponent,
    StudentDetailComponent,
    AvailablecoursesComponent,
    ShoppingcartComponent,
    CartSelectedGridComponent,
    CartSelectedListComponent,
    CartSelectedCellComponent,
    TokenViewComponent,
    LoginComponent,
    ActivateComponent,
    CreateComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        authScheme: 'JWT'
      }
    })
  ],
  providers: [
    DataModelManagerService,
    AuthService,
    GuardAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptTokenService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
