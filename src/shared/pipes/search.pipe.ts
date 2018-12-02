import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search',
    pure: false
})
export class SearchPipe implements PipeTransform {
    transform(items: any[], filter: string, fromFirst: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => {
            if(item instanceof Array) {
                return fromFirst ? item[0].all.toLowerCase().indexOf(filter.toLowerCase()) == 0 : item[0].all.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
            } else 
                return fromFirst ? item.all.toLowerCase().indexOf(filter.toLowerCase()) == 0 : item.all.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        });
    }
}