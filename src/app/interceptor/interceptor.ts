import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpErrorResponse,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { SharedService } from '../services/shared.service';

@Injectable()
export class Interceptor implements HttpInterceptor {

	constructor(
		private userService: UserService,
		private sharedService: SharedService
	) { }

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		this.sharedService.showSpinner.next(true);
		// Get the user's token from your authentication service or wherever it's stored
		const authToken = localStorage.getItem('token');

		// Clone the request and add the Authorization header with the token
		const authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${authToken}`,
			},
		});

		// Pass the modified request to the next handler
		return next.handle(authReq).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					this.userService.logout();
				}
				return throwError(error);
			}),
			finalize(() => {
				this.sharedService.showSpinner.next(false);
			})
		);
	}
}
