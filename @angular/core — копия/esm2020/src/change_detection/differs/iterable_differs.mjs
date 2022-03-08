/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵɵdefineInjectable } from '../../di/interface/defs';
import { Optional, SkipSelf } from '../../di/metadata';
import { RuntimeError } from '../../errors';
import { DefaultIterableDifferFactory } from '../differs/default_iterable_differ';
export function defaultIterableDiffersFactory() {
    return new IterableDiffers([new DefaultIterableDifferFactory()]);
}
/**
 * A repository of different iterable diffing strategies used by NgFor, NgClass, and others.
 *
 * @publicApi
 */
export class IterableDiffers {
    constructor(factories) {
        this.factories = factories;
    }
    static create(factories, parent) {
        if (parent != null) {
            const copied = parent.factories.slice();
            factories = factories.concat(copied);
        }
        return new IterableDiffers(factories);
    }
    /**
     * Takes an array of {@link IterableDifferFactory} and returns a provider used to extend the
     * inherited {@link IterableDiffers} instance with the provided factories and return a new
     * {@link IterableDiffers} instance.
     *
     * @usageNotes
     * ### Example
     *
     * The following example shows how to extend an existing list of factories,
     * which will only be applied to the injector for this component and its children.
     * This step is all that's required to make a new {@link IterableDiffer} available.
     *
     * ```
     * @Component({
     *   viewProviders: [
     *     IterableDiffers.extend([new ImmutableListDiffer()])
     *   ]
     * })
     * ```
     */
    static extend(factories) {
        return {
            provide: IterableDiffers,
            useFactory: (parent) => {
                // if parent is null, it means that we are in the root injector and we have just overridden
                // the default injection mechanism for IterableDiffers, in such a case just assume
                // `defaultIterableDiffersFactory`.
                return IterableDiffers.create(factories, parent || defaultIterableDiffersFactory());
            },
            // Dependency technically isn't optional, but we can provide a better error message this way.
            deps: [[IterableDiffers, new SkipSelf(), new Optional()]]
        };
    }
    find(iterable) {
        const factory = this.factories.find(f => f.supports(iterable));
        if (factory != null) {
            return factory;
        }
        else {
            const errorMessage = (typeof ngDevMode === 'undefined' || ngDevMode) ?
                `Cannot find a differ supporting object '${iterable}' of type '${getTypeNameForDebugging(iterable)}'` :
                '';
            throw new RuntimeError(901 /* NO_SUPPORTING_DIFFER_FACTORY */, errorMessage);
        }
    }
}
/** @nocollapse */
IterableDiffers.ɵprov = ɵɵdefineInjectable({ token: IterableDiffers, providedIn: 'root', factory: defaultIterableDiffersFactory });
export function getTypeNameForDebugging(type) {
    return type['name'] || typeof type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmFibGVfZGlmZmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NoYW5nZV9kZXRlY3Rpb24vZGlmZmVycy9pdGVyYWJsZV9kaWZmZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRTNELE9BQU8sRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDckQsT0FBTyxFQUFDLFlBQVksRUFBbUIsTUFBTSxjQUFjLENBQUM7QUFDNUQsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUEyS2hGLE1BQU0sVUFBVSw2QkFBNkI7SUFDM0MsT0FBTyxJQUFJLGVBQWUsQ0FBQyxDQUFDLElBQUksNEJBQTRCLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQVMxQixZQUFZLFNBQWtDO1FBQzVDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQWtDLEVBQUUsTUFBd0I7UUFDeEUsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ2xCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdEM7UUFFRCxPQUFPLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CRztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBa0M7UUFDOUMsT0FBTztZQUNMLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLFVBQVUsRUFBRSxDQUFDLE1BQTRCLEVBQUUsRUFBRTtnQkFDM0MsMkZBQTJGO2dCQUMzRixrRkFBa0Y7Z0JBQ2xGLG1DQUFtQztnQkFDbkMsT0FBTyxlQUFlLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLElBQUksNkJBQTZCLEVBQUUsQ0FBQyxDQUFDO1lBQ3RGLENBQUM7WUFDRCw2RkFBNkY7WUFDN0YsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUM7U0FDMUQsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFJLENBQUMsUUFBYTtRQUNoQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDbkIsT0FBTyxPQUFPLENBQUM7U0FDaEI7YUFBTTtZQUNMLE1BQU0sWUFBWSxHQUFHLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLDJDQUEyQyxRQUFRLGNBQy9DLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDMUMsRUFBRSxDQUFDO1lBQ1AsTUFBTSxJQUFJLFlBQVkseUNBQWdELFlBQVksQ0FBQyxDQUFDO1NBQ3JGO0lBQ0gsQ0FBQzs7QUFsRUQsa0JBQWtCO0FBQ1gscUJBQUssR0FBNkIsa0JBQWtCLENBQ3ZELEVBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSw2QkFBNkIsRUFBQyxDQUFDLENBQUM7QUFtRTVGLE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxJQUFTO0lBQy9DLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDO0FBQ3JDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHvJtcm1ZGVmaW5lSW5qZWN0YWJsZX0gZnJvbSAnLi4vLi4vZGkvaW50ZXJmYWNlL2RlZnMnO1xuaW1wb3J0IHtTdGF0aWNQcm92aWRlcn0gZnJvbSAnLi4vLi4vZGkvaW50ZXJmYWNlL3Byb3ZpZGVyJztcbmltcG9ydCB7T3B0aW9uYWwsIFNraXBTZWxmfSBmcm9tICcuLi8uLi9kaS9tZXRhZGF0YSc7XG5pbXBvcnQge1J1bnRpbWVFcnJvciwgUnVudGltZUVycm9yQ29kZX0gZnJvbSAnLi4vLi4vZXJyb3JzJztcbmltcG9ydCB7RGVmYXVsdEl0ZXJhYmxlRGlmZmVyRmFjdG9yeX0gZnJvbSAnLi4vZGlmZmVycy9kZWZhdWx0X2l0ZXJhYmxlX2RpZmZlcic7XG5cblxuXG4vKipcbiAqIEEgdHlwZSBkZXNjcmliaW5nIHN1cHBvcnRlZCBpdGVyYWJsZSB0eXBlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIE5nSXRlcmFibGU8VD4gPSBBcnJheTxUPnxJdGVyYWJsZTxUPjtcblxuLyoqXG4gKiBBIHN0cmF0ZWd5IGZvciB0cmFja2luZyBjaGFuZ2VzIG92ZXIgdGltZSB0byBhbiBpdGVyYWJsZS4gVXNlZCBieSB7QGxpbmsgTmdGb3JPZn0gdG9cbiAqIHJlc3BvbmQgdG8gY2hhbmdlcyBpbiBhbiBpdGVyYWJsZSBieSBlZmZlY3RpbmcgZXF1aXZhbGVudCBjaGFuZ2VzIGluIHRoZSBET00uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhYmxlRGlmZmVyPFY+IHtcbiAgLyoqXG4gICAqIENvbXB1dGUgYSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHByZXZpb3VzIHN0YXRlIGFuZCB0aGUgbmV3IGBvYmplY3RgIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG5ldyB2YWx1ZS5cbiAgICogQHJldHVybnMgYW4gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGRpZmZlcmVuY2UuIFRoZSByZXR1cm4gdmFsdWUgaXMgb25seSB2YWxpZCB1bnRpbCB0aGUgbmV4dFxuICAgKiBgZGlmZigpYCBpbnZvY2F0aW9uLlxuICAgKi9cbiAgZGlmZihvYmplY3Q6IE5nSXRlcmFibGU8Vj58dW5kZWZpbmVkfG51bGwpOiBJdGVyYWJsZUNoYW5nZXM8Vj58bnVsbDtcbn1cblxuLyoqXG4gKiBBbiBvYmplY3QgZGVzY3JpYmluZyB0aGUgY2hhbmdlcyBpbiB0aGUgYEl0ZXJhYmxlYCBjb2xsZWN0aW9uIHNpbmNlIGxhc3QgdGltZVxuICogYEl0ZXJhYmxlRGlmZmVyI2RpZmYoKWAgd2FzIGludm9rZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEl0ZXJhYmxlQ2hhbmdlczxWPiB7XG4gIC8qKlxuICAgKiBJdGVyYXRlIG92ZXIgYWxsIGNoYW5nZXMuIGBJdGVyYWJsZUNoYW5nZVJlY29yZGAgd2lsbCBjb250YWluIGluZm9ybWF0aW9uIGFib3V0IGNoYW5nZXNcbiAgICogdG8gZWFjaCBpdGVtLlxuICAgKi9cbiAgZm9yRWFjaEl0ZW0oZm46IChyZWNvcmQ6IEl0ZXJhYmxlQ2hhbmdlUmVjb3JkPFY+KSA9PiB2b2lkKTogdm9pZDtcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGEgc2V0IG9mIG9wZXJhdGlvbnMgd2hpY2ggd2hlbiBhcHBsaWVkIHRvIHRoZSBvcmlnaW5hbCBgSXRlcmFibGVgIHdpbGwgcHJvZHVjZSB0aGVcbiAgICogbmV3IGBJdGVyYWJsZWAuXG4gICAqXG4gICAqIE5PVEU6IFRoZXNlIGFyZSBub3QgbmVjZXNzYXJpbHkgdGhlIGFjdHVhbCBvcGVyYXRpb25zIHdoaWNoIHdlcmUgYXBwbGllZCB0byB0aGUgb3JpZ2luYWxcbiAgICogYEl0ZXJhYmxlYCwgcmF0aGVyIHRoZXNlIGFyZSBhIHNldCBvZiBjb21wdXRlZCBvcGVyYXRpb25zIHdoaWNoIG1heSBub3QgYmUgdGhlIHNhbWUgYXMgdGhlXG4gICAqIG9uZXMgYXBwbGllZC5cbiAgICpcbiAgICogQHBhcmFtIHJlY29yZCBBIGNoYW5nZSB3aGljaCBuZWVkcyB0byBiZSBhcHBsaWVkXG4gICAqIEBwYXJhbSBwcmV2aW91c0luZGV4IFRoZSBgSXRlcmFibGVDaGFuZ2VSZWNvcmQjcHJldmlvdXNJbmRleGAgb2YgdGhlIGByZWNvcmRgIHJlZmVycyB0byB0aGVcbiAgICogICAgICAgIG9yaWdpbmFsIGBJdGVyYWJsZWAgbG9jYXRpb24sIHdoZXJlIGFzIGBwcmV2aW91c0luZGV4YCByZWZlcnMgdG8gdGhlIHRyYW5zaWVudCBsb2NhdGlvblxuICAgKiAgICAgICAgb2YgdGhlIGl0ZW0sIGFmdGVyIGFwcGx5aW5nIHRoZSBvcGVyYXRpb25zIHVwIHRvIHRoaXMgcG9pbnQuXG4gICAqIEBwYXJhbSBjdXJyZW50SW5kZXggVGhlIGBJdGVyYWJsZUNoYW5nZVJlY29yZCNjdXJyZW50SW5kZXhgIG9mIHRoZSBgcmVjb3JkYCByZWZlcnMgdG8gdGhlXG4gICAqICAgICAgICBvcmlnaW5hbCBgSXRlcmFibGVgIGxvY2F0aW9uLCB3aGVyZSBhcyBgY3VycmVudEluZGV4YCByZWZlcnMgdG8gdGhlIHRyYW5zaWVudCBsb2NhdGlvblxuICAgKiAgICAgICAgb2YgdGhlIGl0ZW0sIGFmdGVyIGFwcGx5aW5nIHRoZSBvcGVyYXRpb25zIHVwIHRvIHRoaXMgcG9pbnQuXG4gICAqL1xuICBmb3JFYWNoT3BlcmF0aW9uKFxuICAgICAgZm46XG4gICAgICAgICAgKHJlY29yZDogSXRlcmFibGVDaGFuZ2VSZWNvcmQ8Vj4sIHByZXZpb3VzSW5kZXg6IG51bWJlcnxudWxsLFxuICAgICAgICAgICBjdXJyZW50SW5kZXg6IG51bWJlcnxudWxsKSA9PiB2b2lkKTogdm9pZDtcblxuICAvKipcbiAgICogSXRlcmF0ZSBvdmVyIGNoYW5nZXMgaW4gdGhlIG9yZGVyIG9mIG9yaWdpbmFsIGBJdGVyYWJsZWAgc2hvd2luZyB3aGVyZSB0aGUgb3JpZ2luYWwgaXRlbXNcbiAgICogaGF2ZSBtb3ZlZC5cbiAgICovXG4gIGZvckVhY2hQcmV2aW91c0l0ZW0oZm46IChyZWNvcmQ6IEl0ZXJhYmxlQ2hhbmdlUmVjb3JkPFY+KSA9PiB2b2lkKTogdm9pZDtcblxuICAvKiogSXRlcmF0ZSBvdmVyIGFsbCBhZGRlZCBpdGVtcy4gKi9cbiAgZm9yRWFjaEFkZGVkSXRlbShmbjogKHJlY29yZDogSXRlcmFibGVDaGFuZ2VSZWNvcmQ8Vj4pID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKiBJdGVyYXRlIG92ZXIgYWxsIG1vdmVkIGl0ZW1zLiAqL1xuICBmb3JFYWNoTW92ZWRJdGVtKGZuOiAocmVjb3JkOiBJdGVyYWJsZUNoYW5nZVJlY29yZDxWPikgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgLyoqIEl0ZXJhdGUgb3ZlciBhbGwgcmVtb3ZlZCBpdGVtcy4gKi9cbiAgZm9yRWFjaFJlbW92ZWRJdGVtKGZuOiAocmVjb3JkOiBJdGVyYWJsZUNoYW5nZVJlY29yZDxWPikgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGUgb3ZlciBhbGwgaXRlbXMgd2hpY2ggaGFkIHRoZWlyIGlkZW50aXR5IChhcyBjb21wdXRlZCBieSB0aGUgYFRyYWNrQnlGdW5jdGlvbmApXG4gICAqIGNoYW5nZWQuXG4gICAqL1xuICBmb3JFYWNoSWRlbnRpdHlDaGFuZ2UoZm46IChyZWNvcmQ6IEl0ZXJhYmxlQ2hhbmdlUmVjb3JkPFY+KSA9PiB2b2lkKTogdm9pZDtcbn1cblxuLyoqXG4gKiBSZWNvcmQgcmVwcmVzZW50aW5nIHRoZSBpdGVtIGNoYW5nZSBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSXRlcmFibGVDaGFuZ2VSZWNvcmQ8Vj4ge1xuICAvKiogQ3VycmVudCBpbmRleCBvZiB0aGUgaXRlbSBpbiBgSXRlcmFibGVgIG9yIG51bGwgaWYgcmVtb3ZlZC4gKi9cbiAgcmVhZG9ubHkgY3VycmVudEluZGV4OiBudW1iZXJ8bnVsbDtcblxuICAvKiogUHJldmlvdXMgaW5kZXggb2YgdGhlIGl0ZW0gaW4gYEl0ZXJhYmxlYCBvciBudWxsIGlmIGFkZGVkLiAqL1xuICByZWFkb25seSBwcmV2aW91c0luZGV4OiBudW1iZXJ8bnVsbDtcblxuICAvKiogVGhlIGl0ZW0uICovXG4gIHJlYWRvbmx5IGl0ZW06IFY7XG5cbiAgLyoqIFRyYWNrIGJ5IGlkZW50aXR5IGFzIGNvbXB1dGVkIGJ5IHRoZSBgVHJhY2tCeUZ1bmN0aW9uYC4gKi9cbiAgcmVhZG9ubHkgdHJhY2tCeUlkOiBhbnk7XG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiBvcHRpb25hbGx5IHBhc3NlZCBpbnRvIHRoZSBgTmdGb3JPZmAgZGlyZWN0aXZlIHRvIGN1c3RvbWl6ZSBob3cgYE5nRm9yT2ZgIHVuaXF1ZWx5XG4gKiBpZGVudGlmaWVzIGl0ZW1zIGluIGFuIGl0ZXJhYmxlLlxuICpcbiAqIGBOZ0Zvck9mYCBuZWVkcyB0byB1bmlxdWVseSBpZGVudGlmeSBpdGVtcyBpbiB0aGUgaXRlcmFibGUgdG8gY29ycmVjdGx5IHBlcmZvcm0gRE9NIHVwZGF0ZXNcbiAqIHdoZW4gaXRlbXMgaW4gdGhlIGl0ZXJhYmxlIGFyZSByZW9yZGVyZWQsIG5ldyBpdGVtcyBhcmUgYWRkZWQsIG9yIGV4aXN0aW5nIGl0ZW1zIGFyZSByZW1vdmVkLlxuICpcbiAqXG4gKiBJbiBhbGwgb2YgdGhlc2Ugc2NlbmFyaW9zIGl0IGlzIHVzdWFsbHkgZGVzaXJhYmxlIHRvIG9ubHkgdXBkYXRlIHRoZSBET00gZWxlbWVudHMgYXNzb2NpYXRlZFxuICogd2l0aCB0aGUgaXRlbXMgYWZmZWN0ZWQgYnkgdGhlIGNoYW5nZS4gVGhpcyBiZWhhdmlvciBpcyBpbXBvcnRhbnQgdG86XG4gKlxuICogLSBwcmVzZXJ2ZSBhbnkgRE9NLXNwZWNpZmljIFVJIHN0YXRlIChsaWtlIGN1cnNvciBwb3NpdGlvbiwgZm9jdXMsIHRleHQgc2VsZWN0aW9uKSB3aGVuIHRoZVxuICogICBpdGVyYWJsZSBpcyBtb2RpZmllZFxuICogLSBlbmFibGUgYW5pbWF0aW9uIG9mIGl0ZW0gYWRkaXRpb24sIHJlbW92YWwsIGFuZCBpdGVyYWJsZSByZW9yZGVyaW5nXG4gKiAtIHByZXNlcnZlIHRoZSB2YWx1ZSBvZiB0aGUgYDxzZWxlY3Q+YCBlbGVtZW50IHdoZW4gbmVzdGVkIGA8b3B0aW9uPmAgZWxlbWVudHMgYXJlIGR5bmFtaWNhbGx5XG4gKiAgIHBvcHVsYXRlZCB1c2luZyBgTmdGb3JPZmAgYW5kIHRoZSBib3VuZCBpdGVyYWJsZSBpcyB1cGRhdGVkXG4gKlxuICogQSBjb21tb24gdXNlIGZvciBjdXN0b20gYHRyYWNrQnlgIGZ1bmN0aW9ucyBpcyB3aGVuIHRoZSBtb2RlbCB0aGF0IGBOZ0Zvck9mYCBpdGVyYXRlcyBvdmVyXG4gKiBjb250YWlucyBhIHByb3BlcnR5IHdpdGggYSB1bmlxdWUgaWRlbnRpZmllci4gRm9yIGV4YW1wbGUsIGdpdmVuIGEgbW9kZWw6XG4gKlxuICogYGBgdHNcbiAqIGNsYXNzIFVzZXIge1xuICogICBpZDogbnVtYmVyO1xuICogICBuYW1lOiBzdHJpbmc7XG4gKiAgIC4uLlxuICogfVxuICogYGBgXG4gKiBhIGN1c3RvbSBgdHJhY2tCeWAgZnVuY3Rpb24gY291bGQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gKiBgYGB0c1xuICogZnVuY3Rpb24gdXNlclRyYWNrQnkoaW5kZXgsIHVzZXIpIHtcbiAqICAgcmV0dXJuIHVzZXIuaWQ7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBBIGN1c3RvbSBgdHJhY2tCeWAgZnVuY3Rpb24gbXVzdCBoYXZlIHNldmVyYWwgcHJvcGVydGllczpcbiAqXG4gKiAtIGJlIFtpZGVtcG90ZW50XShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JZGVtcG90ZW5jZSkgKGJlIHdpdGhvdXQgc2lkZSBlZmZlY3RzLCBhbmQgYWx3YXlzXG4gKiByZXR1cm4gdGhlIHNhbWUgdmFsdWUgZm9yIGEgZ2l2ZW4gaW5wdXQpXG4gKiAtIHJldHVybiB1bmlxdWUgdmFsdWUgZm9yIGFsbCB1bmlxdWUgaW5wdXRzXG4gKiAtIGJlIGZhc3RcbiAqXG4gKiBAc2VlIFtgTmdGb3JPZiNuZ0ZvclRyYWNrQnlgXShhcGkvY29tbW9uL05nRm9yT2YjbmdGb3JUcmFja0J5KVxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRyYWNrQnlGdW5jdGlvbjxUPiB7XG4gIC8vIE5vdGU6IHRoZSB0eXBlIHBhcmFtZXRlciBgVWAgZW5hYmxlcyBtb3JlIGFjY3VyYXRlIHRlbXBsYXRlIHR5cGUgY2hlY2tpbmcgaW4gY2FzZSBhIHRyYWNrQnlcbiAgLy8gZnVuY3Rpb24gaXMgZGVjbGFyZWQgdXNpbmcgYSBiYXNlIHR5cGUgb2YgdGhlIGl0ZXJhdGVkIHR5cGUuIFRoZSBgVWAgdHlwZSBnaXZlcyBUeXBlU2NyaXB0XG4gIC8vIGFkZGl0aW9uYWwgZnJlZWRvbSB0byBpbmZlciBhIG5hcnJvd2VyIHR5cGUgZm9yIHRoZSBgaXRlbWAgcGFyYW1ldGVyIHR5cGUsIGluc3RlYWQgb2YgaW1wb3NpbmdcbiAgLy8gdGhlIHRyYWNrQnkncyBkZWNsYXJlZCBpdGVtIHR5cGUgYXMgdGhlIGluZmVycmVkIHR5cGUgZm9yIGBUYC5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzQwMTI1XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGl0ZW0gd2l0aGluIHRoZSBpdGVyYWJsZS5cbiAgICogQHBhcmFtIGl0ZW0gVGhlIGl0ZW0gaW4gdGhlIGl0ZXJhYmxlLlxuICAgKi9cbiAgPFUgZXh0ZW5kcyBUPihpbmRleDogbnVtYmVyLCBpdGVtOiBUJlUpOiBhbnk7XG59XG5cbi8qKlxuICogUHJvdmlkZXMgYSBmYWN0b3J5IGZvciB7QGxpbmsgSXRlcmFibGVEaWZmZXJ9LlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJdGVyYWJsZURpZmZlckZhY3Rvcnkge1xuICBzdXBwb3J0cyhvYmplY3RzOiBhbnkpOiBib29sZWFuO1xuICBjcmVhdGU8Vj4odHJhY2tCeUZuPzogVHJhY2tCeUZ1bmN0aW9uPFY+KTogSXRlcmFibGVEaWZmZXI8Vj47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0SXRlcmFibGVEaWZmZXJzRmFjdG9yeSgpIHtcbiAgcmV0dXJuIG5ldyBJdGVyYWJsZURpZmZlcnMoW25ldyBEZWZhdWx0SXRlcmFibGVEaWZmZXJGYWN0b3J5KCldKTtcbn1cblxuLyoqXG4gKiBBIHJlcG9zaXRvcnkgb2YgZGlmZmVyZW50IGl0ZXJhYmxlIGRpZmZpbmcgc3RyYXRlZ2llcyB1c2VkIGJ5IE5nRm9yLCBOZ0NsYXNzLCBhbmQgb3RoZXJzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEl0ZXJhYmxlRGlmZmVycyB7XG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgybVwcm92ID0gLyoqIEBwdXJlT3JCcmVha015Q29kZSAqLyDJtcm1ZGVmaW5lSW5qZWN0YWJsZShcbiAgICAgIHt0b2tlbjogSXRlcmFibGVEaWZmZXJzLCBwcm92aWRlZEluOiAncm9vdCcsIGZhY3Rvcnk6IGRlZmF1bHRJdGVyYWJsZURpZmZlcnNGYWN0b3J5fSk7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHY0LjAuMCAtIFNob3VsZCBiZSBwcml2YXRlXG4gICAqL1xuICBmYWN0b3JpZXM6IEl0ZXJhYmxlRGlmZmVyRmFjdG9yeVtdO1xuICBjb25zdHJ1Y3RvcihmYWN0b3JpZXM6IEl0ZXJhYmxlRGlmZmVyRmFjdG9yeVtdKSB7XG4gICAgdGhpcy5mYWN0b3JpZXMgPSBmYWN0b3JpZXM7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlKGZhY3RvcmllczogSXRlcmFibGVEaWZmZXJGYWN0b3J5W10sIHBhcmVudD86IEl0ZXJhYmxlRGlmZmVycyk6IEl0ZXJhYmxlRGlmZmVycyB7XG4gICAgaWYgKHBhcmVudCAhPSBudWxsKSB7XG4gICAgICBjb25zdCBjb3BpZWQgPSBwYXJlbnQuZmFjdG9yaWVzLnNsaWNlKCk7XG4gICAgICBmYWN0b3JpZXMgPSBmYWN0b3JpZXMuY29uY2F0KGNvcGllZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJdGVyYWJsZURpZmZlcnMoZmFjdG9yaWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhbiBhcnJheSBvZiB7QGxpbmsgSXRlcmFibGVEaWZmZXJGYWN0b3J5fSBhbmQgcmV0dXJucyBhIHByb3ZpZGVyIHVzZWQgdG8gZXh0ZW5kIHRoZVxuICAgKiBpbmhlcml0ZWQge0BsaW5rIEl0ZXJhYmxlRGlmZmVyc30gaW5zdGFuY2Ugd2l0aCB0aGUgcHJvdmlkZWQgZmFjdG9yaWVzIGFuZCByZXR1cm4gYSBuZXdcbiAgICoge0BsaW5rIEl0ZXJhYmxlRGlmZmVyc30gaW5zdGFuY2UuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBFeGFtcGxlXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gZXh0ZW5kIGFuIGV4aXN0aW5nIGxpc3Qgb2YgZmFjdG9yaWVzLFxuICAgKiB3aGljaCB3aWxsIG9ubHkgYmUgYXBwbGllZCB0byB0aGUgaW5qZWN0b3IgZm9yIHRoaXMgY29tcG9uZW50IGFuZCBpdHMgY2hpbGRyZW4uXG4gICAqIFRoaXMgc3RlcCBpcyBhbGwgdGhhdCdzIHJlcXVpcmVkIHRvIG1ha2UgYSBuZXcge0BsaW5rIEl0ZXJhYmxlRGlmZmVyfSBhdmFpbGFibGUuXG4gICAqXG4gICAqIGBgYFxuICAgKiBAQ29tcG9uZW50KHtcbiAgICogICB2aWV3UHJvdmlkZXJzOiBbXG4gICAqICAgICBJdGVyYWJsZURpZmZlcnMuZXh0ZW5kKFtuZXcgSW1tdXRhYmxlTGlzdERpZmZlcigpXSlcbiAgICogICBdXG4gICAqIH0pXG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIGV4dGVuZChmYWN0b3JpZXM6IEl0ZXJhYmxlRGlmZmVyRmFjdG9yeVtdKTogU3RhdGljUHJvdmlkZXIge1xuICAgIHJldHVybiB7XG4gICAgICBwcm92aWRlOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgICB1c2VGYWN0b3J5OiAocGFyZW50OiBJdGVyYWJsZURpZmZlcnN8bnVsbCkgPT4ge1xuICAgICAgICAvLyBpZiBwYXJlbnQgaXMgbnVsbCwgaXQgbWVhbnMgdGhhdCB3ZSBhcmUgaW4gdGhlIHJvb3QgaW5qZWN0b3IgYW5kIHdlIGhhdmUganVzdCBvdmVycmlkZGVuXG4gICAgICAgIC8vIHRoZSBkZWZhdWx0IGluamVjdGlvbiBtZWNoYW5pc20gZm9yIEl0ZXJhYmxlRGlmZmVycywgaW4gc3VjaCBhIGNhc2UganVzdCBhc3N1bWVcbiAgICAgICAgLy8gYGRlZmF1bHRJdGVyYWJsZURpZmZlcnNGYWN0b3J5YC5cbiAgICAgICAgcmV0dXJuIEl0ZXJhYmxlRGlmZmVycy5jcmVhdGUoZmFjdG9yaWVzLCBwYXJlbnQgfHwgZGVmYXVsdEl0ZXJhYmxlRGlmZmVyc0ZhY3RvcnkoKSk7XG4gICAgICB9LFxuICAgICAgLy8gRGVwZW5kZW5jeSB0ZWNobmljYWxseSBpc24ndCBvcHRpb25hbCwgYnV0IHdlIGNhbiBwcm92aWRlIGEgYmV0dGVyIGVycm9yIG1lc3NhZ2UgdGhpcyB3YXkuXG4gICAgICBkZXBzOiBbW0l0ZXJhYmxlRGlmZmVycywgbmV3IFNraXBTZWxmKCksIG5ldyBPcHRpb25hbCgpXV1cbiAgICB9O1xuICB9XG5cbiAgZmluZChpdGVyYWJsZTogYW55KTogSXRlcmFibGVEaWZmZXJGYWN0b3J5IHtcbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5mYWN0b3JpZXMuZmluZChmID0+IGYuc3VwcG9ydHMoaXRlcmFibGUpKTtcbiAgICBpZiAoZmFjdG9yeSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkgP1xuICAgICAgICAgIGBDYW5ub3QgZmluZCBhIGRpZmZlciBzdXBwb3J0aW5nIG9iamVjdCAnJHtpdGVyYWJsZX0nIG9mIHR5cGUgJyR7XG4gICAgICAgICAgICAgIGdldFR5cGVOYW1lRm9yRGVidWdnaW5nKGl0ZXJhYmxlKX0nYCA6XG4gICAgICAgICAgJyc7XG4gICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFJ1bnRpbWVFcnJvckNvZGUuTk9fU1VQUE9SVElOR19ESUZGRVJfRkFDVE9SWSwgZXJyb3JNZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVOYW1lRm9yRGVidWdnaW5nKHR5cGU6IGFueSk6IHN0cmluZyB7XG4gIHJldHVybiB0eXBlWyduYW1lJ10gfHwgdHlwZW9mIHR5cGU7XG59XG4iXX0=