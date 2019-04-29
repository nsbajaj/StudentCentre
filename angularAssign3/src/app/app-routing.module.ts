import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AboutComponent } from './about.component';
import { StudentsComponent } from './students.component';
import { HelpComponent } from './help.component';
import { StudentDetailComponent } from './student-detail.component';
import { AvailablecoursesComponent } from './availablecourses.component';
import { ShoppingcartComponent } from './shoppingcart.component';
import { TokenViewComponent } from './token-view.component';
import { LoginComponent } from './login.component';
import { ActivateComponent } from './activate.component';
import { CreateComponent } from './create.component';
import { GuardAuthService } from './guard-auth.service';
import { LogoutComponent } from './logout.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'students/:id', component: StudentDetailComponent, canActivate: [GuardAuthService] },
  { path: 'availablecourses', component: AvailablecoursesComponent },
  { path: 'cart', component: ShoppingcartComponent },
  { path: 'help', component: HelpComponent },
  { path: 'token', component: TokenViewComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'activate', component: ActivateComponent },
  { path: 'create', component: CreateComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
