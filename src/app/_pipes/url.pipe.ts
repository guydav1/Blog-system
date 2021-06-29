import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'url',
})
export class UrlPipe implements PipeTransform {
	transform(url: string, ...args: unknown[]): string {
		return url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
	}
}
