import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search',
    pure: false
})
export class SearchPipe implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => {
            if(item instanceof Array) {
                return item[0].all.toLowerCase().indexOf(filter) !== -1;
            } else 
                return item.all.toLowerCase().indexOf(filter) !== -1;
        });
    }
}