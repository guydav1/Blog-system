import { tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Config {
	footerLogo: string;
	footerAboutSection: Array<{ title: string; body: string }>;
	social: Array<{ name: string; icon: string; url: string }>;
	sideBar: { imageUrl: string; about: string };
	defaultImageUrl: string;
	pages: {
		contact: { phone: string; address: string; email: string; googleMapURL: string };
		about: { paragraph1: string; paragraph2: string; image: string };
	};
}

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	private configSubject: ReplaySubject<Config> = new ReplaySubject(1);
	private _configObservable = this.configSubject.asObservable();

	constructor(private http: HttpClient) {
		this.fetchConfig();
	}

	public get configObservable(): Observable<Config> {
		return this._configObservable;
	}

	fetchConfig() {
		this.http.get<Config>(environment.apiUrl + '/config').subscribe(config => {
			this.configSubject.next(config);
		});
	}

	updateConfig(config: Config) {
		this.configSubject.next(config);
	}

	/*side bar*/
	updateSideBar(sidebarAbout: string /*sideBar: Config["sideBar"]*/) {
		return this.http
			.put<Config>(environment.apiUrl + '/config', { sidebarAbout })
			.pipe(tap(config => this.updateConfig(config)));
	}

	deleteSideBarImage() {
		return this.http.delete(environment.apiUrl + '/config/sidebar/image');
	}
	/*end sidebar*/

	/*footer*/

	updateFooterAboutSection(footerAboutSection: Config['footerAboutSection']) {
		return this.http
			.put<Config>(environment.apiUrl + '/config', { footerAboutSection })
			.pipe(tap(config => this.updateConfig(config)));
	}

	updateSocial(socialList: Config['social']) {
		return this.http.put(environment.apiUrl + '/config', { social: socialList });
	}
	/*end -footer*/

	uploadImage(image: FormData, query: string) {
		const params = new HttpParams().set('field', query);
		return this.http
			.post<Config>(environment.apiUrl + '/config/upload/image', image, { params })
			.pipe(tap(config => this.updateConfig(config)));
	}

	deleteImage(query: string) {
		const params = new HttpParams().set('field', query);
		return this.http
			.delete<Config>(environment.apiUrl + '/config/upload/image', { params }).pipe(tap(config => this.updateConfig(config)));
	}

	updateContact(contact: Config['pages']['contact']) {
		return this.http
			.put<Config>(environment.apiUrl + '/config', { contact })
			.pipe(tap(config => this.updateConfig(config)));
	}

	updateAbout(about: Config['pages']['about']) {
		return this.http
			.put<Config>(environment.apiUrl + '/config', { about })
			.pipe(tap(config => this.updateConfig(config)));
	}
}
