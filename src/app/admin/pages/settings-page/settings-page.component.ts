import { take } from "rxjs/operators";
import { ConfigService } from "src/app/services/config.service";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-settings-page",
	templateUrl: "./settings-page.component.html",
	styleUrls: ["./settings-page.component.css"],
})
export class SettingsPageComponent implements OnInit {
	defaultImageUrl: string = "";
	sideBar = {
		imageUrl: "" as string,
		about: "" as string,
	};

	constructor(private configService: ConfigService) {}

	ngOnInit(): void {
		this.configService.configObservable.pipe(take(1)).subscribe(config => {
			if (config.defaultImageUrl) this.defaultImageUrl = config.defaultImageUrl;
			if (config.sideBar) this.sideBar = config.sideBar;
		});
	}

	handleImageSave() {
		this.configService.updateDefaultImage(this.defaultImageUrl).subscribe(
			res => console.log(res),
			err => console.log(err)
		);
	}

	handleSideBarSave() {
		if (!this.sideBar.imageUrl || !this.sideBar.about) return;
		this.configService.updateSideBar(this.sideBar).subscribe(
			res => console.log(res),
			err => console.log(err)
		);
	}
}
