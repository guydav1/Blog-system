import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export enum Role {
	admin = 'admin',
	user = 'user',
}

interface UserResponse {
	users: User[];
	totalUsers: number;
}
export interface User {
	_id: string;
	username: string;
	password?: string;
	createdAt: Date;
	role: Role;
	email: string;
	isEmailPrivate: boolean;
	bio?: string;
	profilePicture?: string;
	coverPicture?: string;
}

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(private http: HttpClient) {}

	addUser(user: any) {
		//admin panel
		return this.http.post(environment.apiUrl + '/user', user).pipe(catchError(this.errorHandler));
	}

	getUsers(page: number, limit: number, search?: string) {
		if (!search) {
			search = '';
		}
		const params = new HttpParams()
			.set('page', '' + page)
			.set('limit', '' + limit)
			.set('search', search);
		return this.http
			.get<UserResponse>(environment.apiUrl + '/user', { params })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	getUserByUsername(username: string) {
		return this.http
			.get<User>(environment.apiUrl + '/user/' + username)
			.pipe(retry(1), catchError(this.errorHandler));
	}

	getUserComments(username: string) {
		return this.http
			.get(`${environment.apiUrl}/user/${username}/comments`)
			.pipe(retry(1), catchError(this.errorHandler));
	}

	updateUser(id: string, user: Partial<User>) {
		return this.http
			.put<User>(environment.apiUrl + '/user/' + id, { user })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	deleteUser(id: string) {
		return this.http.delete(environment.apiUrl + '/user/' + id).pipe(retry(1), catchError(this.errorHandler));
	}

	errorHandler(error: any) {
		console.log(error);
		return throwError(error);
	}
}
