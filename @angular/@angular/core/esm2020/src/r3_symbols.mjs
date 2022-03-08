/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This file exists to support compilation of @angular/core in Ivy mode.
 *
 * When the Angular compiler processes a compilation unit, it normally writes imports to
 * @angular/core. When compiling the core package itself this strategy isn't usable. Instead, the
 * compiler writes imports to this file.
 *
 * Only a subset of such imports are supported - core is not allowed to declare components or pipes.
 * A check in ngtsc's `R3SymbolsImportRewriter` validates this condition. The rewriter is only used
 * when compiling @angular/core and is responsible for translating an external name (prefixed with
 * ɵ) to the internal symbol name as exported below.
 *
 * The below symbols are used for @Injectable and @NgModule compilation.
 */
export { ɵɵinject } from './di/injector_compatibility';
export { ɵɵdefineInjectable, ɵɵdefineInjector } from './di/interface/defs';
export { ɵɵdefineNgModule } from './render3/definition';
export { setClassMetadata } from './render3/metadata';
export { NgModuleFactory } from './render3/ng_module_ref';
export { noSideEffects as ɵnoSideEffects } from './util/closure';
/**
 * The existence of this constant (in this particular file) informs the Angular compiler that the
 * current program is actually @angular/core, which needs to be compiled specially.
 */
export const ITS_JUST_ANGULAR = true;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfc3ltYm9scy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3IzX3N5bWJvbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQTBCLE1BQU0scUJBQXFCLENBQUM7QUFFbEcsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFdEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxhQUFhLElBQUksY0FBYyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFJL0Q7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qXG4gKiBUaGlzIGZpbGUgZXhpc3RzIHRvIHN1cHBvcnQgY29tcGlsYXRpb24gb2YgQGFuZ3VsYXIvY29yZSBpbiBJdnkgbW9kZS5cbiAqXG4gKiBXaGVuIHRoZSBBbmd1bGFyIGNvbXBpbGVyIHByb2Nlc3NlcyBhIGNvbXBpbGF0aW9uIHVuaXQsIGl0IG5vcm1hbGx5IHdyaXRlcyBpbXBvcnRzIHRvXG4gKiBAYW5ndWxhci9jb3JlLiBXaGVuIGNvbXBpbGluZyB0aGUgY29yZSBwYWNrYWdlIGl0c2VsZiB0aGlzIHN0cmF0ZWd5IGlzbid0IHVzYWJsZS4gSW5zdGVhZCwgdGhlXG4gKiBjb21waWxlciB3cml0ZXMgaW1wb3J0cyB0byB0aGlzIGZpbGUuXG4gKlxuICogT25seSBhIHN1YnNldCBvZiBzdWNoIGltcG9ydHMgYXJlIHN1cHBvcnRlZCAtIGNvcmUgaXMgbm90IGFsbG93ZWQgdG8gZGVjbGFyZSBjb21wb25lbnRzIG9yIHBpcGVzLlxuICogQSBjaGVjayBpbiBuZ3RzYydzIGBSM1N5bWJvbHNJbXBvcnRSZXdyaXRlcmAgdmFsaWRhdGVzIHRoaXMgY29uZGl0aW9uLiBUaGUgcmV3cml0ZXIgaXMgb25seSB1c2VkXG4gKiB3aGVuIGNvbXBpbGluZyBAYW5ndWxhci9jb3JlIGFuZCBpcyByZXNwb25zaWJsZSBmb3IgdHJhbnNsYXRpbmcgYW4gZXh0ZXJuYWwgbmFtZSAocHJlZml4ZWQgd2l0aFxuICogybUpIHRvIHRoZSBpbnRlcm5hbCBzeW1ib2wgbmFtZSBhcyBleHBvcnRlZCBiZWxvdy5cbiAqXG4gKiBUaGUgYmVsb3cgc3ltYm9scyBhcmUgdXNlZCBmb3IgQEluamVjdGFibGUgYW5kIEBOZ01vZHVsZSBjb21waWxhdGlvbi5cbiAqL1xuXG5leHBvcnQge8m1ybVpbmplY3R9IGZyb20gJy4vZGkvaW5qZWN0b3JfY29tcGF0aWJpbGl0eSc7XG5leHBvcnQge8m1ybVkZWZpbmVJbmplY3RhYmxlLCDJtcm1ZGVmaW5lSW5qZWN0b3IsIMm1ybVJbmplY3RhYmxlRGVjbGFyYXRpb259IGZyb20gJy4vZGkvaW50ZXJmYWNlL2RlZnMnO1xuZXhwb3J0IHtOZ01vZHVsZURlZn0gZnJvbSAnLi9tZXRhZGF0YS9uZ19tb2R1bGVfZGVmJztcbmV4cG9ydCB7ybXJtWRlZmluZU5nTW9kdWxlfSBmcm9tICcuL3JlbmRlcjMvZGVmaW5pdGlvbic7XG5leHBvcnQge8m1ybVGYWN0b3J5RGVjbGFyYXRpb24sIMm1ybVJbmplY3RvckRlY2xhcmF0aW9uLCDJtcm1TmdNb2R1bGVEZWNsYXJhdGlvbn0gZnJvbSAnLi9yZW5kZXIzL2ludGVyZmFjZXMvcHVibGljX2RlZmluaXRpb25zJztcbmV4cG9ydCB7c2V0Q2xhc3NNZXRhZGF0YX0gZnJvbSAnLi9yZW5kZXIzL21ldGFkYXRhJztcbmV4cG9ydCB7TmdNb2R1bGVGYWN0b3J5fSBmcm9tICcuL3JlbmRlcjMvbmdfbW9kdWxlX3JlZic7XG5leHBvcnQge25vU2lkZUVmZmVjdHMgYXMgybVub1NpZGVFZmZlY3RzfSBmcm9tICcuL3V0aWwvY2xvc3VyZSc7XG5cblxuXG4vKipcbiAqIFRoZSBleGlzdGVuY2Ugb2YgdGhpcyBjb25zdGFudCAoaW4gdGhpcyBwYXJ0aWN1bGFyIGZpbGUpIGluZm9ybXMgdGhlIEFuZ3VsYXIgY29tcGlsZXIgdGhhdCB0aGVcbiAqIGN1cnJlbnQgcHJvZ3JhbSBpcyBhY3R1YWxseSBAYW5ndWxhci9jb3JlLCB3aGljaCBuZWVkcyB0byBiZSBjb21waWxlZCBzcGVjaWFsbHkuXG4gKi9cbmV4cG9ydCBjb25zdCBJVFNfSlVTVF9BTkdVTEFSID0gdHJ1ZTtcbiJdfQ==