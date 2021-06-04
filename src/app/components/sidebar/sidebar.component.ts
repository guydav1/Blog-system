import { ConfigService } from './../../services/config.service';
import { PostService } from 'src/app/services/post.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public postService: PostService, public configService: ConfigService) { 

  }

  ngOnInit(): void {
    //	this.configService.configObservable.pipe(take(1)).subscribe(config => this.social = config.social);

  }

}
