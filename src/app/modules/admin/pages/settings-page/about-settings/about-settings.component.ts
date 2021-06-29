import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Config, ConfigService } from 'src/app/services/config.service';

@Component({
	selector: 'app-about-settings',
	templateUrl: './about-settings.component.html',
	styleUrls: ['./about-settings.component.css'],
})
export class AboutSettingsComponent implements OnInit {
	isLoading = false;
	isPictureLoaded = true;
	errorMessage = '';
	about$: Observable<Config['pages']['about']>;

	constructor(private configService: ConfigService, private toastr: ToastrService) {
		this.about$ = configService.configObservable.pipe(map(config => config.pages.about));
	}

	ngOnInit(): void {
		this.configService.fetchConfig();
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

		this.configService
			.uploadImage(form, 'about')
			.pipe(finalize(() => (this.isPictureLoaded = true)))
			.subscribe(
				res => {
					this.toastr.success('Upload Success');
				},
				err => {
					this.toastr.error('Upload Failed, Please try again');
					this.errorMessage = err.error.message;
				}
			);
	}

	deleteAboutPicture() {
		this.isPictureLoaded = false;
		this.configService.deleteImage('about').pipe(finalize(() => (this.isPictureLoaded = true)))
		.subscribe(
			res=>{
			this.toastr.success('About Picture Deleted');
		},err =>{
			this.errorMessage = err.error.message;
			this.toastr.error('Delete Failed!');
		});
	}

	onSubmit(f: NgForm) {
		this.isLoading = true;
		this.configService
			.updateAbout(f.value)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe(
				res => {
					this.toastr.success('About Page Updated.');
				},
				err => {
					console.log(err);
					this.toastr.error('Update Failed,Please Try Again');
				}
			);
	}
}
