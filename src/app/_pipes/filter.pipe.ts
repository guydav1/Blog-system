import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "filter",
})
export class FilterPipe implements PipeTransform {
	transform(array: Array<any>, filterTerm: string, field: string): Array<any> {
		if (filterTerm == "" || field == "" || array.length == 0) return array;
		
		
		return array.filter(a => a[field].toLocaleLowerCase().includes(filterTerm.toLocaleLowerCase()));

		
	}
}
