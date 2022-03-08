/**
 * An injectable service that produces an animation sequence programmatically within an
 * Angular component or directive.
 * Provided by the `BrowserAnimationsModule` or `NoopAnimationsModule`.
 *
 * @usageNotes
 *
 * To use this service, add it to your component or directive as a dependency.
 * The service is instantiated along with your component.
 *
 * Apps do not typically need to create their own animation players, but if you
 * do need to, follow these steps:
 *
 * 1. Use the <code>[AnimationBuilder.build](api/animations/AnimationBuilder#build)()</code> method
 * to create a programmatic animation. The method returns an `AnimationFactory` instance.
 *
 * 2. Use the factory object to create an `AnimationPlayer` and attach it to a DOM element.
 *
 * 3. Use the player object to control the animation programmatically.
 *
 * For example:
 *
 * ```ts
 * // import the service from BrowserAnimationsModule
 * import {AnimationBuilder} from '@angular/animations';
 * // require the service as a dependency
 * class MyCmp {
 *   constructor(private _builder: AnimationBuilder) {}
 *
 *   makeAnimation(element: any) {
 *     // first define a reusable animation
 *     const myAnimation = this._builder.build([
 *       style({ width: 0 }),
 *       animate(1000, style({ width: '100px' }))
 *     ]);
 *
 *     // use the returned factory object to create a player
 *     const player = myAnimation.create(element);
 *
 *     player.play();
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export class AnimationBuilder {
}
/**
 * A factory object returned from the
 * <code>[AnimationBuilder.build](api/animations/AnimationBuilder#build)()</code>
 * method.
 *
 * @publicApi
 */
export class AnimationFactory {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL3NyYy9hbmltYXRpb25fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkNHO0FBQ0gsTUFBTSxPQUFnQixnQkFBZ0I7Q0FRckM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLE9BQWdCLGdCQUFnQjtDQVdyQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25NZXRhZGF0YSwgQW5pbWF0aW9uT3B0aW9uc30gZnJvbSAnLi9hbmltYXRpb25fbWV0YWRhdGEnO1xuaW1wb3J0IHtBbmltYXRpb25QbGF5ZXJ9IGZyb20gJy4vcGxheWVycy9hbmltYXRpb25fcGxheWVyJztcblxuLyoqXG4gKiBBbiBpbmplY3RhYmxlIHNlcnZpY2UgdGhhdCBwcm9kdWNlcyBhbiBhbmltYXRpb24gc2VxdWVuY2UgcHJvZ3JhbW1hdGljYWxseSB3aXRoaW4gYW5cbiAqIEFuZ3VsYXIgY29tcG9uZW50IG9yIGRpcmVjdGl2ZS5cbiAqIFByb3ZpZGVkIGJ5IHRoZSBgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGVgIG9yIGBOb29wQW5pbWF0aW9uc01vZHVsZWAuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBUbyB1c2UgdGhpcyBzZXJ2aWNlLCBhZGQgaXQgdG8geW91ciBjb21wb25lbnQgb3IgZGlyZWN0aXZlIGFzIGEgZGVwZW5kZW5jeS5cbiAqIFRoZSBzZXJ2aWNlIGlzIGluc3RhbnRpYXRlZCBhbG9uZyB3aXRoIHlvdXIgY29tcG9uZW50LlxuICpcbiAqIEFwcHMgZG8gbm90IHR5cGljYWxseSBuZWVkIHRvIGNyZWF0ZSB0aGVpciBvd24gYW5pbWF0aW9uIHBsYXllcnMsIGJ1dCBpZiB5b3VcbiAqIGRvIG5lZWQgdG8sIGZvbGxvdyB0aGVzZSBzdGVwczpcbiAqXG4gKiAxLiBVc2UgdGhlIDxjb2RlPltBbmltYXRpb25CdWlsZGVyLmJ1aWxkXShhcGkvYW5pbWF0aW9ucy9BbmltYXRpb25CdWlsZGVyI2J1aWxkKSgpPC9jb2RlPiBtZXRob2RcbiAqIHRvIGNyZWF0ZSBhIHByb2dyYW1tYXRpYyBhbmltYXRpb24uIFRoZSBtZXRob2QgcmV0dXJucyBhbiBgQW5pbWF0aW9uRmFjdG9yeWAgaW5zdGFuY2UuXG4gKlxuICogMi4gVXNlIHRoZSBmYWN0b3J5IG9iamVjdCB0byBjcmVhdGUgYW4gYEFuaW1hdGlvblBsYXllcmAgYW5kIGF0dGFjaCBpdCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIDMuIFVzZSB0aGUgcGxheWVyIG9iamVjdCB0byBjb250cm9sIHRoZSBhbmltYXRpb24gcHJvZ3JhbW1hdGljYWxseS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogLy8gaW1wb3J0IHRoZSBzZXJ2aWNlIGZyb20gQnJvd3NlckFuaW1hdGlvbnNNb2R1bGVcbiAqIGltcG9ydCB7QW5pbWF0aW9uQnVpbGRlcn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG4gKiAvLyByZXF1aXJlIHRoZSBzZXJ2aWNlIGFzIGEgZGVwZW5kZW5jeVxuICogY2xhc3MgTXlDbXAge1xuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9idWlsZGVyOiBBbmltYXRpb25CdWlsZGVyKSB7fVxuICpcbiAqICAgbWFrZUFuaW1hdGlvbihlbGVtZW50OiBhbnkpIHtcbiAqICAgICAvLyBmaXJzdCBkZWZpbmUgYSByZXVzYWJsZSBhbmltYXRpb25cbiAqICAgICBjb25zdCBteUFuaW1hdGlvbiA9IHRoaXMuX2J1aWxkZXIuYnVpbGQoW1xuICogICAgICAgc3R5bGUoeyB3aWR0aDogMCB9KSxcbiAqICAgICAgIGFuaW1hdGUoMTAwMCwgc3R5bGUoeyB3aWR0aDogJzEwMHB4JyB9KSlcbiAqICAgICBdKTtcbiAqXG4gKiAgICAgLy8gdXNlIHRoZSByZXR1cm5lZCBmYWN0b3J5IG9iamVjdCB0byBjcmVhdGUgYSBwbGF5ZXJcbiAqICAgICBjb25zdCBwbGF5ZXIgPSBteUFuaW1hdGlvbi5jcmVhdGUoZWxlbWVudCk7XG4gKlxuICogICAgIHBsYXllci5wbGF5KCk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFuaW1hdGlvbkJ1aWxkZXIge1xuICAvKipcbiAgICogQnVpbGRzIGEgZmFjdG9yeSBmb3IgcHJvZHVjaW5nIGEgZGVmaW5lZCBhbmltYXRpb24uXG4gICAqIEBwYXJhbSBhbmltYXRpb24gQSByZXVzYWJsZSBhbmltYXRpb24gZGVmaW5pdGlvbi5cbiAgICogQHJldHVybnMgQSBmYWN0b3J5IG9iamVjdCB0aGF0IGNhbiBjcmVhdGUgYSBwbGF5ZXIgZm9yIHRoZSBkZWZpbmVkIGFuaW1hdGlvbi5cbiAgICogQHNlZSBgYW5pbWF0ZSgpYFxuICAgKi9cbiAgYWJzdHJhY3QgYnVpbGQoYW5pbWF0aW9uOiBBbmltYXRpb25NZXRhZGF0YXxBbmltYXRpb25NZXRhZGF0YVtdKTogQW5pbWF0aW9uRmFjdG9yeTtcbn1cblxuLyoqXG4gKiBBIGZhY3Rvcnkgb2JqZWN0IHJldHVybmVkIGZyb20gdGhlXG4gKiA8Y29kZT5bQW5pbWF0aW9uQnVpbGRlci5idWlsZF0oYXBpL2FuaW1hdGlvbnMvQW5pbWF0aW9uQnVpbGRlciNidWlsZCkoKTwvY29kZT5cbiAqIG1ldGhvZC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBbmltYXRpb25GYWN0b3J5IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYEFuaW1hdGlvblBsYXllcmAgaW5zdGFuY2UgZm9yIHRoZSByZXVzYWJsZSBhbmltYXRpb24gZGVmaW5lZCBieVxuICAgKiB0aGUgPGNvZGU+W0FuaW1hdGlvbkJ1aWxkZXIuYnVpbGRdKGFwaS9hbmltYXRpb25zL0FuaW1hdGlvbkJ1aWxkZXIjYnVpbGQpKCk8L2NvZGU+XG4gICAqIG1ldGhvZCB0aGF0IGNyZWF0ZWQgdGhpcyBmYWN0b3J5IGFuZCBhdHRhY2hlcyB0aGUgbmV3IHBsYXllciBhIERPTSBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZWxlbWVudCBUaGUgRE9NIGVsZW1lbnQgdG8gd2hpY2ggdG8gYXR0YWNoIHRoZSBwbGF5ZXIuXG4gICAqIEBwYXJhbSBvcHRpb25zIEEgc2V0IG9mIG9wdGlvbnMgdGhhdCBjYW4gaW5jbHVkZSBhIHRpbWUgZGVsYXkgYW5kXG4gICAqIGFkZGl0aW9uYWwgZGV2ZWxvcGVyLWRlZmluZWQgcGFyYW1ldGVycy5cbiAgICovXG4gIGFic3RyYWN0IGNyZWF0ZShlbGVtZW50OiBhbnksIG9wdGlvbnM/OiBBbmltYXRpb25PcHRpb25zKTogQW5pbWF0aW9uUGxheWVyO1xufVxuIl19