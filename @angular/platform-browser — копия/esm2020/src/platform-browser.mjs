/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { BrowserModule, platformBrowser } from './browser';
export { Meta } from './browser/meta';
export { Title } from './browser/title';
export { disableDebugTools, enableDebugTools } from './browser/tools/tools';
export { BrowserTransferStateModule, makeStateKey, TransferState } from './browser/transfer_state';
export { By } from './dom/debug/by';
export { EVENT_MANAGER_PLUGINS, EventManager } from './dom/events/event_manager';
export { HAMMER_GESTURE_CONFIG, HAMMER_LOADER, HammerGestureConfig, HammerModule } from './dom/events/hammer_gestures';
export { DomSanitizer } from './security/dom_sanitization_service';
export * from './private_export';
export { VERSION } from './version';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm0tYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvc3JjL3BsYXRmb3JtLWJyb3dzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDekQsT0FBTyxFQUFDLElBQUksRUFBaUIsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDdEMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLDBCQUEwQixFQUFFLFlBQVksRUFBWSxhQUFhLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRyxPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxFQUFDLHFCQUFxQixFQUFFLFlBQVksRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQy9FLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQWdCLFlBQVksRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQ25JLE9BQU8sRUFBQyxZQUFZLEVBQXVFLE1BQU0scUNBQXFDLENBQUM7QUFFdkksY0FBYyxrQkFBa0IsQ0FBQztBQUNqQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCB7QnJvd3Nlck1vZHVsZSwgcGxhdGZvcm1Ccm93c2VyfSBmcm9tICcuL2Jyb3dzZXInO1xuZXhwb3J0IHtNZXRhLCBNZXRhRGVmaW5pdGlvbn0gZnJvbSAnLi9icm93c2VyL21ldGEnO1xuZXhwb3J0IHtUaXRsZX0gZnJvbSAnLi9icm93c2VyL3RpdGxlJztcbmV4cG9ydCB7ZGlzYWJsZURlYnVnVG9vbHMsIGVuYWJsZURlYnVnVG9vbHN9IGZyb20gJy4vYnJvd3Nlci90b29scy90b29scyc7XG5leHBvcnQge0Jyb3dzZXJUcmFuc2ZlclN0YXRlTW9kdWxlLCBtYWtlU3RhdGVLZXksIFN0YXRlS2V5LCBUcmFuc2ZlclN0YXRlfSBmcm9tICcuL2Jyb3dzZXIvdHJhbnNmZXJfc3RhdGUnO1xuZXhwb3J0IHtCeX0gZnJvbSAnLi9kb20vZGVidWcvYnknO1xuZXhwb3J0IHtFVkVOVF9NQU5BR0VSX1BMVUdJTlMsIEV2ZW50TWFuYWdlcn0gZnJvbSAnLi9kb20vZXZlbnRzL2V2ZW50X21hbmFnZXInO1xuZXhwb3J0IHtIQU1NRVJfR0VTVFVSRV9DT05GSUcsIEhBTU1FUl9MT0FERVIsIEhhbW1lckdlc3R1cmVDb25maWcsIEhhbW1lckxvYWRlciwgSGFtbWVyTW9kdWxlfSBmcm9tICcuL2RvbS9ldmVudHMvaGFtbWVyX2dlc3R1cmVzJztcbmV4cG9ydCB7RG9tU2FuaXRpemVyLCBTYWZlSHRtbCwgU2FmZVJlc291cmNlVXJsLCBTYWZlU2NyaXB0LCBTYWZlU3R5bGUsIFNhZmVVcmwsIFNhZmVWYWx1ZX0gZnJvbSAnLi9zZWN1cml0eS9kb21fc2FuaXRpemF0aW9uX3NlcnZpY2UnO1xuXG5leHBvcnQgKiBmcm9tICcuL3ByaXZhdGVfZXhwb3J0JztcbmV4cG9ydCB7VkVSU0lPTn0gZnJvbSAnLi92ZXJzaW9uJztcbiJdfQ==