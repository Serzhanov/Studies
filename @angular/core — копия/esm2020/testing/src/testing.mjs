/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the core/testing package.
 */
export * from './async';
export * from './component_fixture';
export * from './fake_async';
export { TestBed, getTestBed, inject, InjectSetupWrapper, withModule } from './test_bed';
export { TestComponentRenderer, ComponentFixtureAutoDetect, ComponentFixtureNoNgZone } from './test_bed_common';
export * from './test_hooks';
export * from './metadata_override';
export { MetadataOverrider as ɵMetadataOverrider } from './metadata_overrider';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdGluZy9zcmMvdGVzdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSDs7OztHQUlHO0FBRUgsY0FBYyxTQUFTLENBQUM7QUFDeEIsY0FBYyxxQkFBcUIsQ0FBQztBQUNwQyxjQUFjLGNBQWMsQ0FBQztBQUM3QixPQUFPLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSwwQkFBMEIsRUFBRSx3QkFBd0IsRUFBbUYsTUFBTSxtQkFBbUIsQ0FBQztBQUNoTSxjQUFjLGNBQWMsQ0FBQztBQUM3QixjQUFjLHFCQUFxQixDQUFDO0FBQ3BDLE9BQU8sRUFBQyxpQkFBaUIsSUFBSSxrQkFBa0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogQG1vZHVsZVxuICogQGRlc2NyaXB0aW9uXG4gKiBFbnRyeSBwb2ludCBmb3IgYWxsIHB1YmxpYyBBUElzIG9mIHRoZSBjb3JlL3Rlc3RpbmcgcGFja2FnZS5cbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL2FzeW5jJztcbmV4cG9ydCAqIGZyb20gJy4vY29tcG9uZW50X2ZpeHR1cmUnO1xuZXhwb3J0ICogZnJvbSAnLi9mYWtlX2FzeW5jJztcbmV4cG9ydCB7VGVzdEJlZCwgZ2V0VGVzdEJlZCwgaW5qZWN0LCBJbmplY3RTZXR1cFdyYXBwZXIsIHdpdGhNb2R1bGV9IGZyb20gJy4vdGVzdF9iZWQnO1xuZXhwb3J0IHtUZXN0Q29tcG9uZW50UmVuZGVyZXIsIENvbXBvbmVudEZpeHR1cmVBdXRvRGV0ZWN0LCBDb21wb25lbnRGaXh0dXJlTm9OZ1pvbmUsIFRlc3RNb2R1bGVNZXRhZGF0YSwgVGVzdEVudmlyb25tZW50T3B0aW9ucywgTW9kdWxlVGVhcmRvd25PcHRpb25zLCBUZXN0QmVkU3RhdGljfSBmcm9tICcuL3Rlc3RfYmVkX2NvbW1vbic7XG5leHBvcnQgKiBmcm9tICcuL3Rlc3RfaG9va3MnO1xuZXhwb3J0ICogZnJvbSAnLi9tZXRhZGF0YV9vdmVycmlkZSc7XG5leHBvcnQge01ldGFkYXRhT3ZlcnJpZGVyIGFzIMm1TWV0YWRhdGFPdmVycmlkZXJ9IGZyb20gJy4vbWV0YWRhdGFfb3ZlcnJpZGVyJztcbiJdfQ==