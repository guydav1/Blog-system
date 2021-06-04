import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { finalize, take } from "rxjs/operators";
import { ConfigService } from "src/app/services/config.service";
@Component({
	selector: "app-social",
	templateUrl: "./social.component.html",
	styleUrls: ["./social.component.css"],
})
export class SocialComponent implements OnInit {
	loading: boolean = false;

	socialList = [
		{ name: "Google+", icon: "fa fa-google-plus" },
		{ name: "FaceBook", icon: "fa fa-facebook" },
		{ name: "Instagram", icon: "fa fa-instagram" },
		{ name: "WhatsApp", icon: "fa fa-whatsapp" },
		{ name: "YouTube", icon: "fa fa-youtube" },
		{ name: "SnapChat", icon: "fa fa-snapchat" },
		{ name: "Twitch", icon: "fa fa-twitch" },
		{ name: "GitHub", icon: "fa fa-github" },
		{ name: "Linkedin", icon: "fa fa-linkedin" },
		{ name: "QQ", icon: "fa fa-qq" },
		{ name: "VK", icon: "fa fa-vk" },
	];

	removeList = [{ name: "Delete", icon: "fa fa-trash", url: "" }];

	social: { name: string; icon: string; url: string }[] = [];
	selectedSocialIndex: number = -1;
	constructor(private configService: ConfigService) {}

	ngOnInit(): void {
		this.configService.configObservable.pipe(take(1)).subscribe(config => (this.social = config.social));
	}

	onSubmit(idx: number, url: string) {
		if (idx >= 0 && url) {
			this.social.push({ ...this.socialList[idx], url });
		}
	}

	drop(event: CdkDragDrop<{ name: string; icon: string; url: string }[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(this.social, event.previousIndex, event.currentIndex);
		} else {
			this.social.splice(event.previousIndex, 1);
		}
	}

	handleClick(itemIdx: number) {
		this.selectedSocialIndex = itemIdx;
	}

	handleUpdate(url: string){
		this.social[this.selectedSocialIndex].url = url;
		this.selectedSocialIndex = -1;

	}

	handleSave() {
		this.loading = true;
		this.configService
			.updateSocial(this.social)
			.pipe(finalize(() => (this.loading = false)))
			.subscribe(
				res => {
					console.log(res);
				},
				err => {
					console.log(err);
				}
			);
	}
}
