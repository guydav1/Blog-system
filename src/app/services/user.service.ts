import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { retry } from "rxjs/operators";
import { HttpParams } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

enum Role {
	"admin",
	"user",
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
}

@Injectable({
	providedIn: "root",
})
export class UserService {
	constructor(private http: HttpClient) {}

	getUsers(page: number, limit: number, search?: string) {
		if (!search) search = "";
		let params = new HttpParams()
			.set("page", "" + page)
			.set("limit", "" + limit)
			.set("search", search);
		return this.http
			.get<UserResponse>(environment.apiUrl + "/user", { params: params })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	getUserById(id: string) {
		return this.http.get<User>(environment.apiUrl + "/user/" + id).pipe(retry(1), catchError(this.errorHandler));
	}

	updateUser(id: string, user: User) {
		return this.http
			.put<User>(environment.apiUrl + "/user/" + id, { user })
			.pipe(retry(1), catchError(this.errorHandler));
	}

	deleteUser(id: string) {
		return this.http.delete(environment.apiUrl + "/user/" + id).pipe(retry(1), catchError(this.errorHandler));
	}

	errorHandler(error: any) {
		console.log(error);
		return throwError(error);
	}
}
