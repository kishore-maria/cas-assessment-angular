import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  userForm: FormGroup = {} as FormGroup;

  passMismatchErr = false;

  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.passMismatchErr = false;
  }

  onSignup() {
    if (!this.userForm.valid) return;
    if (this.userForm.value.password !== this.userForm.value.confirmPassword) {
      this.passMismatchErr = true;
      this.userForm.controls['confirmPassword'].setErrors({ passMismatch: true });
      return;
    }
    const userDetails = {
      userName: this.userForm.value.userName,
      password: this.userForm.value.password
    };
    this.subscriptions.push(
      this.userService.signupUser(userDetails).subscribe((res: any) => {
        this.sharedService.openSnackBar(res.message);
        this.router.navigate(['login']);
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
