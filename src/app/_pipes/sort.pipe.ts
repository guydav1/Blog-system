import { Pipe, PipeTransform } from "@angular/core";
import { orderBy } from "lodash";

@Pipe({
	name: "sort",
})
export class SortPipe implements PipeTransform {
	transform(array: Array<any>, sortBy: string, order: "asc" | "desc" = "asc"): Array<any> {
		return orderBy(array, [sortBy], [order]);
	}
}
