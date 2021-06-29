import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { take } from 'rxjs/operators';
import { Config, ConfigService } from 'src/app/services/config.service';
import { Post } from './../../services/post.service';

@Component({
	selector: 'app-posts-list',
	templateUrl: './posts-list.component.html',
	styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
	@Input() posts: Post[] | undefined;
	@Input() totalPosts: number | undefined;
	@Input() hidePageSize = false;
	@Output() page: EventEmitter<{ pageIndex: number; pageSize: number }> = new EventEmitter();
	pageSizeOptions = [5, 10, 25];
	pageSize = 10;
	defaultImageUrl: Config['defaultImageUrl'] | undefined;

	constructor(private configService: ConfigService) {}

	ngOnInit(): void {
		this.configService.configObservable
			.pipe(take(1))
			.subscribe(config => (this.defaultImageUrl = config.defaultImageUrl));
	}

	handlePage(event: PageEvent) {
		window.scroll(0, 0);
		this.page.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
	}

	htmlToText(html: string) {
		return html.replace(/<[^>]*>/g, '');
	}
}
