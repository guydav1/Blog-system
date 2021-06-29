import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
	name: 'sort',
})
export class SortPipe implements PipeTransform {
	transform(array: Array<any>, sortBy: string, order: 'asc' | 'desc' = 'asc'): Array<any> {
		const sortByArray = sortBy.split(',');
		const orderByArray = Array(sortByArray.length).fill(order);
		return orderBy(array, sortByArray, orderByArray);
	}
}
