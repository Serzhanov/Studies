/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Pipe } from '@angular/core';
import { invalidPipeArgumentError } from './invalid_pipe_argument_error';
import * as i0 from "@angular/core";
/**
 * @ngModule CommonModule
 * @description
 *
 * Generic selector that displays the string that matches the current value.
 *
 * If none of the keys of the `mapping` match the `value`, then the content
 * of the `other` key is returned when present, otherwise an empty string is returned.
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example common/pipes/ts/i18n_pipe.ts region='I18nSelectPipeComponent'}
 *
 * @publicApi
 */
export class I18nSelectPipe {
    /**
     * @param value a string to be internationalized.
     * @param mapping an object that indicates the text that should be displayed
     * for different values of the provided `value`.
     */
    transform(value, mapping) {
        if (value == null)
            return '';
        if (typeof mapping !== 'object' || typeof value !== 'string') {
            throw invalidPipeArgumentError(I18nSelectPipe, mapping);
        }
        if (mapping.hasOwnProperty(value)) {
            return mapping[value];
        }
        if (mapping.hasOwnProperty('other')) {
            return mapping['other'];
        }
        return '';
    }
}
I18nSelectPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: I18nSelectPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
I18nSelectPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: I18nSelectPipe, name: "i18nSelect" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: I18nSelectPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'i18nSelect', pure: true }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9zZWxlY3RfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvcGlwZXMvaTE4bl9zZWxlY3RfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQzs7QUFFdkU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFFSCxNQUFNLE9BQU8sY0FBYztJQUN6Qjs7OztPQUlHO0lBQ0gsU0FBUyxDQUFDLEtBQTRCLEVBQUUsT0FBZ0M7UUFDdEUsSUFBSSxLQUFLLElBQUksSUFBSTtZQUFFLE9BQU8sRUFBRSxDQUFDO1FBRTdCLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM1RCxNQUFNLHdCQUF3QixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN6RDtRQUVELElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN2QjtRQUVELElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNuQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6QjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQzs7c0hBdEJVLGNBQWM7b0hBQWQsY0FBYztzR0FBZCxjQUFjO2tCQUQxQixJQUFJO21CQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UGlwZSwgUGlwZVRyYW5zZm9ybX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2ludmFsaWRQaXBlQXJndW1lbnRFcnJvcn0gZnJvbSAnLi9pbnZhbGlkX3BpcGVfYXJndW1lbnRfZXJyb3InO1xuXG4vKipcbiAqIEBuZ01vZHVsZSBDb21tb25Nb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEdlbmVyaWMgc2VsZWN0b3IgdGhhdCBkaXNwbGF5cyB0aGUgc3RyaW5nIHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCB2YWx1ZS5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBrZXlzIG9mIHRoZSBgbWFwcGluZ2AgbWF0Y2ggdGhlIGB2YWx1ZWAsIHRoZW4gdGhlIGNvbnRlbnRcbiAqIG9mIHRoZSBgb3RoZXJgIGtleSBpcyByZXR1cm5lZCB3aGVuIHByZXNlbnQsIG90aGVyd2lzZSBhbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIHtAZXhhbXBsZSBjb21tb24vcGlwZXMvdHMvaTE4bl9waXBlLnRzIHJlZ2lvbj0nSTE4blNlbGVjdFBpcGVDb21wb25lbnQnfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQFBpcGUoe25hbWU6ICdpMThuU2VsZWN0JywgcHVyZTogdHJ1ZX0pXG5leHBvcnQgY2xhc3MgSTE4blNlbGVjdFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB2YWx1ZSBhIHN0cmluZyB0byBiZSBpbnRlcm5hdGlvbmFsaXplZC5cbiAgICogQHBhcmFtIG1hcHBpbmcgYW4gb2JqZWN0IHRoYXQgaW5kaWNhdGVzIHRoZSB0ZXh0IHRoYXQgc2hvdWxkIGJlIGRpc3BsYXllZFxuICAgKiBmb3IgZGlmZmVyZW50IHZhbHVlcyBvZiB0aGUgcHJvdmlkZWQgYHZhbHVlYC5cbiAgICovXG4gIHRyYW5zZm9ybSh2YWx1ZTogc3RyaW5nfG51bGx8dW5kZWZpbmVkLCBtYXBwaW5nOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSk6IHN0cmluZyB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiAnJztcblxuICAgIGlmICh0eXBlb2YgbWFwcGluZyAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgaW52YWxpZFBpcGVBcmd1bWVudEVycm9yKEkxOG5TZWxlY3RQaXBlLCBtYXBwaW5nKTtcbiAgICB9XG5cbiAgICBpZiAobWFwcGluZy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBtYXBwaW5nW3ZhbHVlXTtcbiAgICB9XG5cbiAgICBpZiAobWFwcGluZy5oYXNPd25Qcm9wZXJ0eSgnb3RoZXInKSkge1xuICAgICAgcmV0dXJuIG1hcHBpbmdbJ290aGVyJ107XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xuICB9XG59XG4iXX0=