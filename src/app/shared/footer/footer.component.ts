import { Config } from './../../services/config.service';
import { take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-footer",
	templateUrl: "./footer.component.html",
	styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {

	social: Config["social"] | undefined

	constructor(private configService: ConfigService) {}

	ngOnInit(): void {
		this.configService.configObservable.pipe(take(1)).subscribe(config => this.social = config.social);
	}
}
