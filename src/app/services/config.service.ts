import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { environment } from "src/environments/environment";

export interface Config {
	social: Array<{ name: string; icon: string; url: string }>;
	sideBar: { imageUrl: string; about: string };
	defaultImageUrl: string;
}

@Injectable({
	providedIn: "root",
})
export class ConfigService {
	// TODO: MAKE CONFIG A SUBJECT
	private configSubject: ReplaySubject<Config> = new ReplaySubject(1);
	private _configObservable = this.configSubject.asObservable();

	constructor(private http: HttpClient) {
		this.http.get<Config>(environment.apiUrl + "/config").subscribe(config => this.configSubject.next(config));
	}

	public get configObservable(): Observable<Config> {
		return this._configObservable;
	}

	updateSocial(socialList: Config["social"]) {
		return this.http.put(environment.apiUrl + "/config", { social: socialList });
	}

	updateDefaultImage(defaultImageUrl: Config["defaultImageUrl"]) {
		return this.http.put(environment.apiUrl + "/config", { defaultImageUrl });
	}

	updateSideBar(sideBar: Config["sideBar"]) {
		return this.http.put(environment.apiUrl + "/config", { sideBar });
	}
}
