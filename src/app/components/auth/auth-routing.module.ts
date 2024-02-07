import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectService } from 'src/app/services/redirect-service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectService]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [RedirectService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
