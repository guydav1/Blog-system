import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from './../../services/config.service';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
	searchInput = '';
	tags$;
	config$;
	constructor(private postService: PostService, private configService: ConfigService, private router: Router) {
		this.tags$ = postService.tags$;
		this.config$ = configService.configObservable;
	}

	ngOnInit(): void {}

	handleSearch(form: NgForm) {
		if (this.searchInput) {
			this.router.navigate(['/', 'search', this.searchInput]);
			form.reset();
		}
	}
}
