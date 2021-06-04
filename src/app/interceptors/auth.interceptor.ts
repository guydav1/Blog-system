import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private router: Router, private authService: AuthService) {}

	handleAuthError(err: HttpErrorResponse): Observable<any> {
		if (err.status === 401 || err.status === 403) {
			this.authService.logout();
			console.log("in if handleAuthError");
			return of(err.message);
		}
		throw throwError(err);
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const token = localStorage.getItem("token");
		const newRequest = token
			? request.clone({
					headers: request.headers.set("Authorization", "Bearer " + token),
			  })
			: request;

		return next.handle(newRequest).pipe(catchError(e => this.handleAuthError(e)));
	}
}
