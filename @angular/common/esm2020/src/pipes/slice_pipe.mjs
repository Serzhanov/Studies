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
 * Creates a new `Array` or `String` containing a subset (slice) of the elements.
 *
 * @usageNotes
 *
 * All behavior is based on the expected behavior of the JavaScript API `Array.prototype.slice()`
 * and `String.prototype.slice()`.
 *
 * When operating on an `Array`, the returned `Array` is always a copy even when all
 * the elements are being returned.
 *
 * When operating on a blank value, the pipe returns the blank value.
 *
 * ### List Example
 *
 * This `ngFor` example:
 *
 * {@example common/pipes/ts/slice_pipe.ts region='SlicePipe_list'}
 *
 * produces the following:
 *
 * ```html
 * <li>b</li>
 * <li>c</li>
 * ```
 *
 * ### String Examples
 *
 * {@example common/pipes/ts/slice_pipe.ts region='SlicePipe_string'}
 *
 * @publicApi
 */
export class SlicePipe {
    transform(value, start, end) {
        if (value == null)
            return null;
        if (!this.supports(value)) {
            throw invalidPipeArgumentError(SlicePipe, value);
        }
        return value.slice(start, end);
    }
    supports(obj) {
        return typeof obj === 'string' || Array.isArray(obj);
    }
}
SlicePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: SlicePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
SlicePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: SlicePipe, name: "slice", pure: false });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.1", ngImport: i0, type: SlicePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'slice', pure: false }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpY2VfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9zcmMvcGlwZXMvc2xpY2VfcGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQzs7QUFFdkU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQ0c7QUFFSCxNQUFNLE9BQU8sU0FBUztJQXFCcEIsU0FBUyxDQUFJLEtBQTZDLEVBQUUsS0FBYSxFQUFFLEdBQVk7UUFFckYsSUFBSSxLQUFLLElBQUksSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRS9CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sd0JBQXdCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xEO1FBRUQsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU8sUUFBUSxDQUFDLEdBQVE7UUFDdkIsT0FBTyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2RCxDQUFDOztpSEFsQ1UsU0FBUzsrR0FBVCxTQUFTO3NHQUFULFNBQVM7a0JBRHJCLElBQUk7bUJBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aW52YWxpZFBpcGVBcmd1bWVudEVycm9yfSBmcm9tICcuL2ludmFsaWRfcGlwZV9hcmd1bWVudF9lcnJvcic7XG5cbi8qKlxuICogQG5nTW9kdWxlIENvbW1vbk1vZHVsZVxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlgIG9yIGBTdHJpbmdgIGNvbnRhaW5pbmcgYSBzdWJzZXQgKHNsaWNlKSBvZiB0aGUgZWxlbWVudHMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBBbGwgYmVoYXZpb3IgaXMgYmFzZWQgb24gdGhlIGV4cGVjdGVkIGJlaGF2aW9yIG9mIHRoZSBKYXZhU2NyaXB0IEFQSSBgQXJyYXkucHJvdG90eXBlLnNsaWNlKClgXG4gKiBhbmQgYFN0cmluZy5wcm90b3R5cGUuc2xpY2UoKWAuXG4gKlxuICogV2hlbiBvcGVyYXRpbmcgb24gYW4gYEFycmF5YCwgdGhlIHJldHVybmVkIGBBcnJheWAgaXMgYWx3YXlzIGEgY29weSBldmVuIHdoZW4gYWxsXG4gKiB0aGUgZWxlbWVudHMgYXJlIGJlaW5nIHJldHVybmVkLlxuICpcbiAqIFdoZW4gb3BlcmF0aW5nIG9uIGEgYmxhbmsgdmFsdWUsIHRoZSBwaXBlIHJldHVybnMgdGhlIGJsYW5rIHZhbHVlLlxuICpcbiAqICMjIyBMaXN0IEV4YW1wbGVcbiAqXG4gKiBUaGlzIGBuZ0ZvcmAgZXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL3BpcGVzL3RzL3NsaWNlX3BpcGUudHMgcmVnaW9uPSdTbGljZVBpcGVfbGlzdCd9XG4gKlxuICogcHJvZHVjZXMgdGhlIGZvbGxvd2luZzpcbiAqXG4gKiBgYGBodG1sXG4gKiA8bGk+YjwvbGk+XG4gKiA8bGk+YzwvbGk+XG4gKiBgYGBcbiAqXG4gKiAjIyMgU3RyaW5nIEV4YW1wbGVzXG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9waXBlcy90cy9zbGljZV9waXBlLnRzIHJlZ2lvbj0nU2xpY2VQaXBlX3N0cmluZyd9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5AUGlwZSh7bmFtZTogJ3NsaWNlJywgcHVyZTogZmFsc2V9KVxuZXhwb3J0IGNsYXNzIFNsaWNlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAvKipcbiAgICogQHBhcmFtIHZhbHVlIGEgbGlzdCBvciBhIHN0cmluZyB0byBiZSBzbGljZWQuXG4gICAqIEBwYXJhbSBzdGFydCB0aGUgc3RhcnRpbmcgaW5kZXggb2YgdGhlIHN1YnNldCB0byByZXR1cm46XG4gICAqICAgLSAqKmEgcG9zaXRpdmUgaW50ZWdlcioqOiByZXR1cm4gdGhlIGl0ZW0gYXQgYHN0YXJ0YCBpbmRleCBhbmQgYWxsIGl0ZW1zIGFmdGVyXG4gICAqICAgICBpbiB0aGUgbGlzdCBvciBzdHJpbmcgZXhwcmVzc2lvbi5cbiAgICogICAtICoqYSBuZWdhdGl2ZSBpbnRlZ2VyKio6IHJldHVybiB0aGUgaXRlbSBhdCBgc3RhcnRgIGluZGV4IGZyb20gdGhlIGVuZCBhbmQgYWxsIGl0ZW1zIGFmdGVyXG4gICAqICAgICBpbiB0aGUgbGlzdCBvciBzdHJpbmcgZXhwcmVzc2lvbi5cbiAgICogICAtICoqaWYgcG9zaXRpdmUgYW5kIGdyZWF0ZXIgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgZXhwcmVzc2lvbioqOiByZXR1cm4gYW4gZW1wdHkgbGlzdCBvclxuICAgKiBzdHJpbmcuXG4gICAqICAgLSAqKmlmIG5lZ2F0aXZlIGFuZCBncmVhdGVyIHRoYW4gdGhlIHNpemUgb2YgdGhlIGV4cHJlc3Npb24qKjogcmV0dXJuIGVudGlyZSBsaXN0IG9yIHN0cmluZy5cbiAgICogQHBhcmFtIGVuZCB0aGUgZW5kaW5nIGluZGV4IG9mIHRoZSBzdWJzZXQgdG8gcmV0dXJuOlxuICAgKiAgIC0gKipvbWl0dGVkKio6IHJldHVybiBhbGwgaXRlbXMgdW50aWwgdGhlIGVuZC5cbiAgICogICAtICoqaWYgcG9zaXRpdmUqKjogcmV0dXJuIGFsbCBpdGVtcyBiZWZvcmUgYGVuZGAgaW5kZXggb2YgdGhlIGxpc3Qgb3Igc3RyaW5nLlxuICAgKiAgIC0gKippZiBuZWdhdGl2ZSoqOiByZXR1cm4gYWxsIGl0ZW1zIGJlZm9yZSBgZW5kYCBpbmRleCBmcm9tIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb3Igc3RyaW5nLlxuICAgKi9cbiAgdHJhbnNmb3JtPFQ+KHZhbHVlOiBSZWFkb25seUFycmF5PFQ+LCBzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpOiBBcnJheTxUPjtcbiAgdHJhbnNmb3JtKHZhbHVlOiBudWxsfHVuZGVmaW5lZCwgc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogbnVsbDtcbiAgdHJhbnNmb3JtPFQ+KHZhbHVlOiBSZWFkb25seUFycmF5PFQ+fG51bGx8dW5kZWZpbmVkLCBzdGFydDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpOiBBcnJheTxUPnxudWxsO1xuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogc3RyaW5nO1xuICB0cmFuc2Zvcm0odmFsdWU6IHN0cmluZ3xudWxsfHVuZGVmaW5lZCwgc3RhcnQ6IG51bWJlciwgZW5kPzogbnVtYmVyKTogc3RyaW5nfG51bGw7XG4gIHRyYW5zZm9ybTxUPih2YWx1ZTogUmVhZG9ubHlBcnJheTxUPnxzdHJpbmd8bnVsbHx1bmRlZmluZWQsIHN0YXJ0OiBudW1iZXIsIGVuZD86IG51bWJlcik6XG4gICAgICBBcnJheTxUPnxzdHJpbmd8bnVsbCB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgaWYgKCF0aGlzLnN1cHBvcnRzKHZhbHVlKSkge1xuICAgICAgdGhyb3cgaW52YWxpZFBpcGVBcmd1bWVudEVycm9yKFNsaWNlUGlwZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZS5zbGljZShzdGFydCwgZW5kKTtcbiAgfVxuXG4gIHByaXZhdGUgc3VwcG9ydHMob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheShvYmopO1xuICB9XG59XG4iXX0=