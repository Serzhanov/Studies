/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Some of the code comes from WebComponents.JS
// https://github.com/webcomponents/webcomponentsjs/blob/master/src/HTMLImports/path.js
export function isStyleUrlResolvable(url) {
    if (url == null || url.length === 0 || url[0] == '/')
        return false;
    const schemeMatch = url.match(URL_WITH_SCHEMA_REGEXP);
    return schemeMatch === null || schemeMatch[1] == 'package' || schemeMatch[1] == 'asset';
}
const URL_WITH_SCHEMA_REGEXP = /^([^:/?#]+):/;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVfdXJsX3Jlc29sdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3N0eWxlX3VybF9yZXNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCwrQ0FBK0M7QUFDL0MsdUZBQXVGO0FBRXZGLE1BQU0sVUFBVSxvQkFBb0IsQ0FBQyxHQUFnQjtJQUNuRCxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUc7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUNuRSxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDdEQsT0FBTyxXQUFXLEtBQUssSUFBSSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQztBQUMxRixDQUFDO0FBRUQsTUFBTSxzQkFBc0IsR0FBRyxjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gU29tZSBvZiB0aGUgY29kZSBjb21lcyBmcm9tIFdlYkNvbXBvbmVudHMuSlNcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJjb21wb25lbnRzL3dlYmNvbXBvbmVudHNqcy9ibG9iL21hc3Rlci9zcmMvSFRNTEltcG9ydHMvcGF0aC5qc1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTdHlsZVVybFJlc29sdmFibGUodXJsOiBzdHJpbmd8bnVsbCk6IHVybCBpcyBzdHJpbmcge1xuICBpZiAodXJsID09IG51bGwgfHwgdXJsLmxlbmd0aCA9PT0gMCB8fCB1cmxbMF0gPT0gJy8nKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHNjaGVtZU1hdGNoID0gdXJsLm1hdGNoKFVSTF9XSVRIX1NDSEVNQV9SRUdFWFApO1xuICByZXR1cm4gc2NoZW1lTWF0Y2ggPT09IG51bGwgfHwgc2NoZW1lTWF0Y2hbMV0gPT0gJ3BhY2thZ2UnIHx8IHNjaGVtZU1hdGNoWzFdID09ICdhc3NldCc7XG59XG5cbmNvbnN0IFVSTF9XSVRIX1NDSEVNQV9SRUdFWFAgPSAvXihbXjovPyNdKyk6LztcbiJdfQ==