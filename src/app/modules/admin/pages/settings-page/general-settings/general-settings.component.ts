import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { take, finalize } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';

@Component({
	selector: 'app-general-settings',
	templateUrl: './general-settings.component.html',
	styleUrls: ['./general-settings.component.css'],
})
export class GeneralSettingsComponent implements OnInit {
	defaultImageUrl = '';
	isPictureLoaded = true;
	errorMessage = '';

	constructor(private configService: ConfigService, private toastr: ToastrService) {}

	ngOnInit(): void {
		this.configService.configObservable.pipe(take(1)).subscribe(config => {
			if (config.defaultImageUrl) {this.defaultImageUrl = config.defaultImageUrl;}
		});
	}

	deletePostPicture(){
		this.isPictureLoaded = false;
		this.configService.deleteImage('general').pipe(finalize(() => (this.isPictureLoaded = true)))
		.subscribe(
			res=>{
			this.defaultImageUrl = '';
			this.toastr.success('Post Default Image Deleted');
		},err =>{
			this.errorMessage = err.error.message;
			this.toastr.error('Delete Failed!');
		});
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

		this.configService.uploadImage(form,'general').pipe(finalize(() => (this.isPictureLoaded = true)))
		.subscribe(
			res => {
				this.defaultImageUrl = res.defaultImageUrl;
				this.toastr.success('Image Edited Successfuly');
				},
			err => {
				this.errorMessage = err.error.message;
				this.toastr.error('Image Edit Failed, Please try again');
			}
		);
	}

}
