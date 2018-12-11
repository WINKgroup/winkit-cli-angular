import {Pipe} from '@angular/core';

@Pipe({
    name: 'reverse',
    pure: false
})
export class ReversePipe {
    transform (values) {
        if (values) {
            return values.reverse();
        }
    }
}