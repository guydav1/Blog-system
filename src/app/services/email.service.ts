import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class EmailService {
	constructor(private http: HttpClient) {}

	sendEmail(name: string, emailAddress: string, message: string) {
		return this.http.post(environment.apiUrl + '/email/send', { name, emailAddress, message });
	}
}
