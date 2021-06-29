import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private router: Router, private toastr: ToastrService, private injector: Injector) {}

	handleAuthError(err: HttpErrorResponse): Observable<any> {
		const authService = this.injector.get<AuthService>(AuthService);

		if (err.status === 401 || err.status === 403) {
			authService.logout();
			this.toastr.warning('Unauthorized.');
			return of(err.message);
		}
		throw err;
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const token = localStorage.getItem('token');
		const newRequest = token
			? request.clone({
					headers: request.headers.set('Authorization', 'Bearer ' + token),
			  })
			: request;

		return next.handle(newRequest).pipe(catchError(e => this.handleAuthError(e)));
	}
}
