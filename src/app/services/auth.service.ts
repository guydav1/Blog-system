import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Observable } from 'rxjs';
import { map, retry, take, tap } from 'rxjs/operators';
import { Role, User as ServiceUser } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

interface User {
	user: Partial<ServiceUser>;
	token: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	public userObservable;
	jwtHelper = new JwtHelperService();
	private readonly _userSubject: ReplaySubject<User['user']> = new ReplaySubject(1);

	constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
		this.userObservable = this._userSubject.asObservable();
		if (this.isLoggedIn()) {
			this.http.get<User>(environment.apiUrl + '/user/login/token').subscribe(
				res => {
					this._userSubject.next(res.user);
				},
				err => this.logout()
			);
		}
	}

	login(username: string, password: string) {
		return this.http.post<User>(environment.apiUrl + '/user/login', { username, password }).pipe(
			tap(user => {
				localStorage.setItem('userId', user.user._id ?? '');
				localStorage.setItem('token', user.token);
				this._userSubject.next(user.user);
				this.toastr.success('Logged In');
			})
		);
	}

	register(newUser: Partial<ServiceUser>) {
		return this.http.post<User>(environment.apiUrl + '/user/register', newUser).pipe(
			tap(user => {
				localStorage.setItem('userId', user.user._id ?? '');
				localStorage.setItem('token', user.token);
				this._userSubject.next(user.user);
				this.toastr.info('Account Created');
			})
		);
	}

	isLoggedIn() {
		const token = localStorage.getItem('token');
		return (token && !this.jwtHelper.isTokenExpired(token)) as boolean;
	}

	logout() {
		if(this.isLoggedIn()) {
			this.http.post(environment.apiUrl + '/user/logout', {}).subscribe();
		}
		this._userSubject.next(undefined);
		localStorage.removeItem('userId');
		localStorage.removeItem('token');
		this.router.navigate(['/']);
		this.toastr.info('Logged Out');
	}

	uploadUserAvatar(file: FormData) {
		return this.http.post<User['user']>(environment.apiUrl + '/user/me/avatar', file).pipe(
			tap(user => {
				this._userSubject.next(user);
			})
		);
	}

	uploadUserCover(file: FormData) {
		return this.http.post<User['user']>(environment.apiUrl + '/user/me/cover', file).pipe(
			tap(user => {
				this._userSubject.next(user);
			})
		);
	}

	deleteUserAvatar() {
		return this.http.delete(environment.apiUrl + '/user/me/avatar').pipe(
			tap(user => {
				this._userSubject.next(user);
			})
		);
	}

	deleteUserCover() {
		return this.http.delete(environment.apiUrl + '/user/me/cover').pipe(
			tap(user => {
				this._userSubject.next(user);
			})
		);
	}

	updateUserSettings(updatedUser: User['user']) {
		return this.http.put(environment.apiUrl + '/user/me', { user: updatedUser }).pipe(
			retry(1),
			tap(user => {
				this._userSubject.next(user);
			})
		);
	}

	isAdmin(): Observable<boolean> {
		return this.userObservable.pipe(
			take(1),
			map(user => user.role === Role.admin)
		);
	}
}
