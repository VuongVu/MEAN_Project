import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Users } from '../models/users';

@Injectable()
export class AuthService {
  authToken: any;
  user: Users;

  private registerUrl = 'http://localhost:3000/api/users/register';
  private authenticateUrl = 'http://localhost:3000/api/users/authenticate';
  private profileUrl = 'http://localhost:3000/api/users/profile';

  constructor(private http: Http) { }

  registerUser(user: Users): Observable<Users> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.registerUrl, user, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  authenticateUser(user: Users) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.post(this.authenticateUrl, user, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getProfile() {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });

    return this.http.get(this.profileUrl, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  storeUserData(token, user: Users) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || { };
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
