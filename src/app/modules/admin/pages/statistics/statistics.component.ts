import { environment } from './../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-statistics',
	templateUrl: './statistics.component.html',
	styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
	postStats = { today: 0, total: 0 };
	commentsStats = { today: 0, total: 0 };
	totalViews = 0;
	stats$: Observable<any>;
	constructor(private http: HttpClient) {
		this.stats$ = this.http.get(environment.apiUrl + '/posts/stats/all');
	}

	ngOnInit(): void {}
}
