import { allowPreviousPlayerStylesMerge, balancePreviousStylesIntoKeyframes, copyStyles } from '../../util';
import { containsElement, invokeQuery, validateStyleProperty } from '../shared';
import { packageNonAnimatableStyles } from '../special_cased_styles';
import { WebAnimationsPlayer } from './web_animations_player';
export class WebAnimationsDriver {
    validateStyleProperty(prop) {
        return validateStyleProperty(prop);
    }
    matchesElement(_element, _selector) {
        // This method is deprecated and no longer in use so we return false.
        return false;
    }
    containsElement(elm1, elm2) {
        return containsElement(elm1, elm2);
    }
    query(element, selector, multi) {
        return invokeQuery(element, selector, multi);
    }
    computeStyle(element, prop, defaultValue) {
        return window.getComputedStyle(element)[prop];
    }
    animate(element, keyframes, duration, delay, easing, previousPlayers = []) {
        const fill = delay == 0 ? 'both' : 'forwards';
        const playerOptions = { duration, delay, fill };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        const previousStyles = {};
        const previousWebAnimationPlayers = previousPlayers.filter(player => player instanceof WebAnimationsPlayer);
        if (allowPreviousPlayerStylesMerge(duration, delay)) {
            previousWebAnimationPlayers.forEach(player => {
                let styles = player.currentSnapshot;
                Object.keys(styles).forEach(prop => previousStyles[prop] = styles[prop]);
            });
        }
        keyframes = keyframes.map(styles => copyStyles(styles, false));
        keyframes = balancePreviousStylesIntoKeyframes(element, keyframes, previousStyles);
        const specialStyles = packageNonAnimatableStyles(element, keyframes);
        return new WebAnimationsPlayer(element, keyframes, playerOptions, specialStyles);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfZHJpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfZHJpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBQyw4QkFBOEIsRUFBRSxrQ0FBa0MsRUFBRSxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFMUcsT0FBTyxFQUFDLGVBQWUsRUFBRSxXQUFXLEVBQWEscUJBQXFCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDekYsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFFbkUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFFNUQsTUFBTSxPQUFPLG1CQUFtQjtJQUM5QixxQkFBcUIsQ0FBQyxJQUFZO1FBQ2hDLE9BQU8scUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFhLEVBQUUsU0FBaUI7UUFDN0MscUVBQXFFO1FBQ3JFLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFTLEVBQUUsSUFBUztRQUNsQyxPQUFPLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFZLEVBQUUsUUFBZ0IsRUFBRSxLQUFjO1FBQ2xELE9BQU8sV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELFlBQVksQ0FBQyxPQUFZLEVBQUUsSUFBWSxFQUFFLFlBQXFCO1FBQzVELE9BQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBUyxDQUFDLElBQUksQ0FBVyxDQUFDO0lBQ25FLENBQUM7SUFFRCxPQUFPLENBQ0gsT0FBWSxFQUFFLFNBQXVCLEVBQUUsUUFBZ0IsRUFBRSxLQUFhLEVBQUUsTUFBYyxFQUN0RixrQkFBcUMsRUFBRTtRQUN6QyxNQUFNLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUM5QyxNQUFNLGFBQWEsR0FBbUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO1FBQzlFLHNFQUFzRTtRQUN0RSx3RUFBd0U7UUFDeEUsSUFBSSxNQUFNLEVBQUU7WUFDVixhQUFhLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDO1NBQ2xDO1FBRUQsTUFBTSxjQUFjLEdBQXlCLEVBQUUsQ0FBQztRQUNoRCxNQUFNLDJCQUEyQixHQUEwQixlQUFlLENBQUMsTUFBTSxDQUM3RSxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sWUFBWSxtQkFBbUIsQ0FBQyxDQUFDO1FBRXJELElBQUksOEJBQThCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ25ELDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDM0MsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9ELFNBQVMsR0FBRyxrQ0FBa0MsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sYUFBYSxHQUFHLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRSxPQUFPLElBQUksbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbkYsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FuaW1hdGlvblBsYXllciwgybVTdHlsZURhdGF9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5pbXBvcnQge2FsbG93UHJldmlvdXNQbGF5ZXJTdHlsZXNNZXJnZSwgYmFsYW5jZVByZXZpb3VzU3R5bGVzSW50b0tleWZyYW1lcywgY29weVN0eWxlc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlcn0gZnJvbSAnLi4vYW5pbWF0aW9uX2RyaXZlcic7XG5pbXBvcnQge2NvbnRhaW5zRWxlbWVudCwgaW52b2tlUXVlcnksIGlzQnJvd3NlciwgdmFsaWRhdGVTdHlsZVByb3BlcnR5fSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHtwYWNrYWdlTm9uQW5pbWF0YWJsZVN0eWxlc30gZnJvbSAnLi4vc3BlY2lhbF9jYXNlZF9zdHlsZXMnO1xuXG5pbXBvcnQge1dlYkFuaW1hdGlvbnNQbGF5ZXJ9IGZyb20gJy4vd2ViX2FuaW1hdGlvbnNfcGxheWVyJztcblxuZXhwb3J0IGNsYXNzIFdlYkFuaW1hdGlvbnNEcml2ZXIgaW1wbGVtZW50cyBBbmltYXRpb25Ecml2ZXIge1xuICB2YWxpZGF0ZVN0eWxlUHJvcGVydHkocHJvcDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbGlkYXRlU3R5bGVQcm9wZXJ0eShwcm9wKTtcbiAgfVxuXG4gIG1hdGNoZXNFbGVtZW50KF9lbGVtZW50OiBhbnksIF9zZWxlY3Rvcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgLy8gVGhpcyBtZXRob2QgaXMgZGVwcmVjYXRlZCBhbmQgbm8gbG9uZ2VyIGluIHVzZSBzbyB3ZSByZXR1cm4gZmFsc2UuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29udGFpbnNFbGVtZW50KGVsbTE6IGFueSwgZWxtMjogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvbnRhaW5zRWxlbWVudChlbG0xLCBlbG0yKTtcbiAgfVxuXG4gIHF1ZXJ5KGVsZW1lbnQ6IGFueSwgc2VsZWN0b3I6IHN0cmluZywgbXVsdGk6IGJvb2xlYW4pOiBhbnlbXSB7XG4gICAgcmV0dXJuIGludm9rZVF1ZXJ5KGVsZW1lbnQsIHNlbGVjdG9yLCBtdWx0aSk7XG4gIH1cblxuICBjb21wdXRlU3R5bGUoZWxlbWVudDogYW55LCBwcm9wOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSBhcyBhbnkpW3Byb3BdIGFzIHN0cmluZztcbiAgfVxuXG4gIGFuaW1hdGUoXG4gICAgICBlbGVtZW50OiBhbnksIGtleWZyYW1lczogybVTdHlsZURhdGFbXSwgZHVyYXRpb246IG51bWJlciwgZGVsYXk6IG51bWJlciwgZWFzaW5nOiBzdHJpbmcsXG4gICAgICBwcmV2aW91c1BsYXllcnM6IEFuaW1hdGlvblBsYXllcltdID0gW10pOiBBbmltYXRpb25QbGF5ZXIge1xuICAgIGNvbnN0IGZpbGwgPSBkZWxheSA9PSAwID8gJ2JvdGgnIDogJ2ZvcndhcmRzJztcbiAgICBjb25zdCBwbGF5ZXJPcHRpb25zOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfG51bWJlcn0gPSB7ZHVyYXRpb24sIGRlbGF5LCBmaWxsfTtcbiAgICAvLyB3ZSBjaGVjayBmb3IgdGhpcyB0byBhdm9pZCBoYXZpbmcgYSBudWxsfHVuZGVmaW5lZCB2YWx1ZSBiZSBwcmVzZW50XG4gICAgLy8gZm9yIHRoZSBlYXNpbmcgKHdoaWNoIHJlc3VsdHMgaW4gYW4gZXJyb3IgZm9yIGNlcnRhaW4gYnJvd3NlcnMgIzk3NTIpXG4gICAgaWYgKGVhc2luZykge1xuICAgICAgcGxheWVyT3B0aW9uc1snZWFzaW5nJ10gPSBlYXNpbmc7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNTdHlsZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG4gICAgY29uc3QgcHJldmlvdXNXZWJBbmltYXRpb25QbGF5ZXJzID0gPFdlYkFuaW1hdGlvbnNQbGF5ZXJbXT5wcmV2aW91c1BsYXllcnMuZmlsdGVyKFxuICAgICAgICBwbGF5ZXIgPT4gcGxheWVyIGluc3RhbmNlb2YgV2ViQW5pbWF0aW9uc1BsYXllcik7XG5cbiAgICBpZiAoYWxsb3dQcmV2aW91c1BsYXllclN0eWxlc01lcmdlKGR1cmF0aW9uLCBkZWxheSkpIHtcbiAgICAgIHByZXZpb3VzV2ViQW5pbWF0aW9uUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICAgIGxldCBzdHlsZXMgPSBwbGF5ZXIuY3VycmVudFNuYXBzaG90O1xuICAgICAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2gocHJvcCA9PiBwcmV2aW91c1N0eWxlc1twcm9wXSA9IHN0eWxlc1twcm9wXSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBrZXlmcmFtZXMgPSBrZXlmcmFtZXMubWFwKHN0eWxlcyA9PiBjb3B5U3R5bGVzKHN0eWxlcywgZmFsc2UpKTtcbiAgICBrZXlmcmFtZXMgPSBiYWxhbmNlUHJldmlvdXNTdHlsZXNJbnRvS2V5ZnJhbWVzKGVsZW1lbnQsIGtleWZyYW1lcywgcHJldmlvdXNTdHlsZXMpO1xuICAgIGNvbnN0IHNwZWNpYWxTdHlsZXMgPSBwYWNrYWdlTm9uQW5pbWF0YWJsZVN0eWxlcyhlbGVtZW50LCBrZXlmcmFtZXMpO1xuICAgIHJldHVybiBuZXcgV2ViQW5pbWF0aW9uc1BsYXllcihlbGVtZW50LCBrZXlmcmFtZXMsIHBsYXllck9wdGlvbnMsIHNwZWNpYWxTdHlsZXMpO1xuICB9XG59XG4iXX0=