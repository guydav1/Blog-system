import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config, ConfigService } from 'src/app/services/config.service';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
	about$: Observable<Config['pages']['about']>;
	constructor(private configService: ConfigService) {
		this.about$ = this.configService.configObservable.pipe(map(config => config?.pages?.about));
	}
	ngOnInit(): void {}
}
