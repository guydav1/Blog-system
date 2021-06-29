import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Config } from '../../../services/config.service';
import { take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
	searchInput = '';
	$config: Observable<Config>;

	constructor(private configService: ConfigService, private router: Router) {
		this.$config = configService.configObservable;
	}

	ngOnInit(): void {
	}

	search() {
		if (this.searchInput) {
			this.router.navigate(['/', 'search', this.searchInput]);
			this.searchInput = '';
		}
	}
}
