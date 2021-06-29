import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { take,finalize } from 'rxjs/operators';

@Component({
	selector: 'app-footer-settings',
	templateUrl: './footer-settings.component.html',
	styleUrls: ['./footer-settings.component.css'],
})
export class FooterSettingsComponent implements OnInit, OnDestroy {
	footerAboutSection = [{ title: '', body: '' }];
	footerLogoUrl = '';
	subscription!: Subscription;
	isPictureLoaded = true;
	errorMessage = '';


	constructor(private configService: ConfigService, private toastr: ToastrService) {}

	ngOnInit(): void {
		this.configService.fetchConfig();
		this.subscription = this.configService.configObservable.subscribe(config => {
			if (config.footerAboutSection)
				{this.footerAboutSection = config.footerAboutSection.map(object => Object.assign({}, object));}
			if (config.footerLogo) {this.footerLogoUrl = config.footerLogo;}
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}


	onUploadPicture(event: any) {
		const file: File = event.target.files[0] as File;
		if (!file) {
			return;
		}
		this.errorMessage = '';
		this.isPictureLoaded = false;
		const form = new FormData();

		form.append('image', file, file.name);

		this.configService.uploadImage(form,'footer').pipe(finalize(() => (this.isPictureLoaded = true)))
		.subscribe(
			res => {
				this.footerLogoUrl = '';
				this.toastr.success('Footer Logo Edited Successfuly');
			},
			err => {
				this.errorMessage = err.error.message;
				this.toastr.error('Footer Logo Edit Failed, Please try again');
			}
		);
	}

	deleteFooterPicture(){
		this.isPictureLoaded = false;
		this.configService.deleteImage('footer').pipe(finalize(() => (this.isPictureLoaded = true)))
		.subscribe(
			res=>{
			this.toastr.success('Footer Logo Deleted');
			this.footerLogoUrl = res.footerLogo;
		},err =>{
			this.errorMessage = err.error.message;
			this.toastr.error('Delete Failed!');
		});
	}

	handleFooterAboutSave() {
		this.configService.updateFooterAboutSection(this.footerAboutSection).subscribe(
			res => {
				this.toastr.success('Footer About Edited Successfuly');
			},
			err => {
				console.log(err);
				this.toastr.error('Footer About Edit Failed, Please try again');
			}
		);
	}

	addFooterAbout() {
		if (this.footerAboutSection.length < 4) {
			this.footerAboutSection.push({ title: '', body: '' });
		}
	}

	deleteFooterAbout(i: number) {
		if (this.footerAboutSection[i]) {
			this.footerAboutSection.splice(i, 1);
		}
	}
}
