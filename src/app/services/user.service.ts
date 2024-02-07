import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from '../config/config';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signupUser(payloadData: UserModel) {
    const url = `${apiUrl}/signup`;
    return this.http.post(url, payloadData);
  }

  loginUser(payloadData: UserModel) {
    const url = `${apiUrl}/login`;
    return this.http.post(url, payloadData);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
