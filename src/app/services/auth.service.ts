import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";

interface User {
	user: {
		_id: string;
	};
	token: string;
}

@Injectable({
	providedIn: "root",
})
export class AuthService {
	jwtHelper = new JwtHelperService();
	user: User | undefined;
	constructor(private http: HttpClient, private router: Router) {
		const _id = localStorage.getItem("userId");
		const token = localStorage.getItem("token");
		if (_id && token) {
			this.user = { user: { _id }, token };
		}
	}

	login(username: string, password: string) {
		return this.http.post<User>(environment.apiUrl + "/user/login", { username, password }).pipe(
			tap(user => {
				localStorage.setItem("userId", user.user._id);
				localStorage.setItem("token", user.token);
				this.user = user;
			})
		);
	}

	isLoggedIn() {
		return !this.jwtHelper.isTokenExpired(this.user?.token);
	}

	logout() {
		if (this.isLoggedIn()) {
			//console.log(localStorage.getItem("token"));
			//const headers = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") });
			this.http.post(environment.apiUrl + "/user/logout", {}).subscribe();
			this.user = undefined;
			localStorage.removeItem("userId");
			localStorage.removeItem("token");
			this.router.navigateByUrl("admin/login");
		}
	}
}
