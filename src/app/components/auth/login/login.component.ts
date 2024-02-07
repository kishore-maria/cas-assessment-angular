import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup = {} as FormGroup;

  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (!this.loginForm.valid) return;
    const userDetails = {
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password
    };
    this.subscriptions.push(
      this.userService.loginUser(userDetails).subscribe((res: any) => {
        localStorage.setItem('token', res.data.token);
        this.sharedService.openSnackBar(res.message);
        this.router.navigate(['todo']);
      }, err => {
        this.sharedService.openSnackBar(err.error.message);
        console.log(err);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
