/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getControlAsyncValidators, getControlValidators, mergeValidators } from '../validators';
import { BuiltInControlValueAccessor } from './control_value_accessor';
import { DefaultValueAccessor } from './default_value_accessor';
import { ngModelWarning } from './reactive_errors';
export function controlPath(name, parent) {
    return [...parent.path, name];
}
/**
 * Links a Form control and a Form directive by setting up callbacks (such as `onChange`) on both
 * instances. This function is typically invoked when form directive is being initialized.
 *
 * @param control Form control instance that should be linked.
 * @param dir Directive that should be linked with a given control.
 */
export function setUpControl(control, dir) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        if (!control)
            _throwError(dir, 'Cannot find control with');
        if (!dir.valueAccessor)
            _throwError(dir, 'No value accessor for form control with');
    }
    setUpValidators(control, dir);
    dir.valueAccessor.writeValue(control.value);
    setUpViewChangePipeline(control, dir);
    setUpModelChangePipeline(control, dir);
    setUpBlurPipeline(control, dir);
    setUpDisabledChangeHandler(control, dir);
}
/**
 * Reverts configuration performed by the `setUpControl` control function.
 * Effectively disconnects form control with a given form directive.
 * This function is typically invoked when corresponding form directive is being destroyed.
 *
 * @param control Form control which should be cleaned up.
 * @param dir Directive that should be disconnected from a given control.
 * @param validateControlPresenceOnChange Flag that indicates whether onChange handler should
 *     contain asserts to verify that it's not called once directive is destroyed. We need this flag
 *     to avoid potentially breaking changes caused by better control cleanup introduced in #39235.
 */
export function cleanUpControl(control, dir, validateControlPresenceOnChange = true) {
    const noop = () => {
        if (validateControlPresenceOnChange && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            _noControlError(dir);
        }
    };
    // The `valueAccessor` field is typically defined on FromControl and FormControlName directive
    // instances and there is a logic in `selectValueAccessor` function that throws if it's not the
    // case. We still check the presence of `valueAccessor` before invoking its methods to make sure
    // that cleanup works correctly if app code or tests are setup to ignore the error thrown from
    // `selectValueAccessor`. See https://github.com/angular/angular/issues/40521.
    if (dir.valueAccessor) {
        dir.valueAccessor.registerOnChange(noop);
        dir.valueAccessor.registerOnTouched(noop);
    }
    cleanUpValidators(control, dir);
    if (control) {
        dir._invokeOnDestroyCallbacks();
        control._registerOnCollectionChange(() => { });
    }
}
function registerOnValidatorChange(validators, onChange) {
    validators.forEach((validator) => {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(onChange);
    });
}
/**
 * Sets up disabled change handler function on a given form control if ControlValueAccessor
 * associated with a given directive instance supports the `setDisabledState` call.
 *
 * @param control Form control where disabled change handler should be setup.
 * @param dir Corresponding directive instance associated with this control.
 */
export function setUpDisabledChangeHandler(control, dir) {
    if (dir.valueAccessor.setDisabledState) {
        const onDisabledChange = (isDisabled) => {
            dir.valueAccessor.setDisabledState(isDisabled);
        };
        control.registerOnDisabledChange(onDisabledChange);
        // Register a callback function to cleanup disabled change handler
        // from a control instance when a directive is destroyed.
        dir._registerOnDestroy(() => {
            control._unregisterOnDisabledChange(onDisabledChange);
        });
    }
}
/**
 * Sets up sync and async directive validators on provided form control.
 * This function merges validators from the directive into the validators of the control.
 *
 * @param control Form control where directive validators should be setup.
 * @param dir Directive instance that contains validators to be setup.
 */
export function setUpValidators(control, dir) {
    const validators = getControlValidators(control);
    if (dir.validator !== null) {
        control.setValidators(mergeValidators(validators, dir.validator));
    }
    else if (typeof validators === 'function') {
        // If sync validators are represented by a single validator function, we force the
        // `Validators.compose` call to happen by executing the `setValidators` function with
        // an array that contains that function. We need this to avoid possible discrepancies in
        // validators behavior, so sync validators are always processed by the `Validators.compose`.
        // Note: we should consider moving this logic inside the `setValidators` function itself, so we
        // have consistent behavior on AbstractControl API level. The same applies to the async
        // validators logic below.
        control.setValidators([validators]);
    }
    const asyncValidators = getControlAsyncValidators(control);
    if (dir.asyncValidator !== null) {
        control.setAsyncValidators(mergeValidators(asyncValidators, dir.asyncValidator));
    }
    else if (typeof asyncValidators === 'function') {
        control.setAsyncValidators([asyncValidators]);
    }
    // Re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    const onValidatorChange = () => control.updateValueAndValidity();
    registerOnValidatorChange(dir._rawValidators, onValidatorChange);
    registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
}
/**
 * Cleans up sync and async directive validators on provided form control.
 * This function reverts the setup performed by the `setUpValidators` function, i.e.
 * removes directive-specific validators from a given control instance.
 *
 * @param control Form control from where directive validators should be removed.
 * @param dir Directive instance that contains validators to be removed.
 * @returns true if a control was updated as a result of this action.
 */
export function cleanUpValidators(control, dir) {
    let isControlUpdated = false;
    if (control !== null) {
        if (dir.validator !== null) {
            const validators = getControlValidators(control);
            if (Array.isArray(validators) && validators.length > 0) {
                // Filter out directive validator function.
                const updatedValidators = validators.filter(validator => validator !== dir.validator);
                if (updatedValidators.length !== validators.length) {
                    isControlUpdated = true;
                    control.setValidators(updatedValidators);
                }
            }
        }
        if (dir.asyncValidator !== null) {
            const asyncValidators = getControlAsyncValidators(control);
            if (Array.isArray(asyncValidators) && asyncValidators.length > 0) {
                // Filter out directive async validator function.
                const updatedAsyncValidators = asyncValidators.filter(asyncValidator => asyncValidator !== dir.asyncValidator);
                if (updatedAsyncValidators.length !== asyncValidators.length) {
                    isControlUpdated = true;
                    control.setAsyncValidators(updatedAsyncValidators);
                }
            }
        }
    }
    // Clear onValidatorChange callbacks by providing a noop function.
    const noop = () => { };
    registerOnValidatorChange(dir._rawValidators, noop);
    registerOnValidatorChange(dir._rawAsyncValidators, noop);
    return isControlUpdated;
}
function setUpViewChangePipeline(control, dir) {
    dir.valueAccessor.registerOnChange((newValue) => {
        control._pendingValue = newValue;
        control._pendingChange = true;
        control._pendingDirty = true;
        if (control.updateOn === 'change')
            updateControl(control, dir);
    });
}
function setUpBlurPipeline(control, dir) {
    dir.valueAccessor.registerOnTouched(() => {
        control._pendingTouched = true;
        if (control.updateOn === 'blur' && control._pendingChange)
            updateControl(control, dir);
        if (control.updateOn !== 'submit')
            control.markAsTouched();
    });
}
function updateControl(control, dir) {
    if (control._pendingDirty)
        control.markAsDirty();
    control.setValue(control._pendingValue, { emitModelToViewChange: false });
    dir.viewToModelUpdate(control._pendingValue);
    control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
    const onChange = (newValue, emitModelEvent) => {
        // control -> view
        dir.valueAccessor.writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    };
    control.registerOnChange(onChange);
    // Register a callback function to cleanup onChange handler
    // from a control instance when a directive is destroyed.
    dir._registerOnDestroy(() => {
        control._unregisterOnChange(onChange);
    });
}
/**
 * Links a FormGroup or FormArray instance and corresponding Form directive by setting up validators
 * present in the view.
 *
 * @param control FormGroup or FormArray instance that should be linked.
 * @param dir Directive that provides view validators.
 */
export function setUpFormContainer(control, dir) {
    if (control == null && (typeof ngDevMode === 'undefined' || ngDevMode))
        _throwError(dir, 'Cannot find control with');
    setUpValidators(control, dir);
}
/**
 * Reverts the setup performed by the `setUpFormContainer` function.
 *
 * @param control FormGroup or FormArray instance that should be cleaned up.
 * @param dir Directive that provided view validators.
 * @returns true if a control was updated as a result of this action.
 */
export function cleanUpFormContainer(control, dir) {
    return cleanUpValidators(control, dir);
}
function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
function _throwError(dir, message) {
    let messageEnd;
    if (dir.path.length > 1) {
        messageEnd = `path: '${dir.path.join(' -> ')}'`;
    }
    else if (dir.path[0]) {
        messageEnd = `name: '${dir.path}'`;
    }
    else {
        messageEnd = 'unspecified name attribute';
    }
    throw new Error(`${message} ${messageEnd}`);
}
export function isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model'))
        return false;
    const change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !Object.is(viewModel, change.currentValue);
}
export function isBuiltInAccessor(valueAccessor) {
    // Check if a given value accessor is an instance of a class that directly extends
    // `BuiltInControlValueAccessor` one.
    return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
}
export function syncPendingControls(form, directives) {
    form._syncPendingControls();
    directives.forEach(dir => {
        const control = dir.control;
        if (control.updateOn === 'submit' && control._pendingChange) {
            dir.viewToModelUpdate(control._pendingValue);
            control._pendingChange = false;
        }
    });
}
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
export function selectValueAccessor(dir, valueAccessors) {
    if (!valueAccessors)
        return null;
    if (!Array.isArray(valueAccessors) && (typeof ngDevMode === 'undefined' || ngDevMode))
        _throwError(dir, 'Value accessor was not provided as an array for form control with');
    let defaultAccessor = undefined;
    let builtinAccessor = undefined;
    let customAccessor = undefined;
    valueAccessors.forEach((v) => {
        if (v.constructor === DefaultValueAccessor) {
            defaultAccessor = v;
        }
        else if (isBuiltInAccessor(v)) {
            if (builtinAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
                _throwError(dir, 'More than one built-in value accessor matches form control with');
            builtinAccessor = v;
        }
        else {
            if (customAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
                _throwError(dir, 'More than one custom value accessor matches form control with');
            customAccessor = v;
        }
    });
    if (customAccessor)
        return customAccessor;
    if (builtinAccessor)
        return builtinAccessor;
    if (defaultAccessor)
        return defaultAccessor;
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        _throwError(dir, 'No valid value accessor for form control with');
    }
    return null;
}
export function removeListItem(list, el) {
    const index = list.indexOf(el);
    if (index > -1)
        list.splice(index, 1);
}
// TODO(kara): remove after deprecation period
export function _ngModelWarning(name, type, instance, warningConfig) {
    if (warningConfig === 'never')
        return;
    if (((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce) ||
        (warningConfig === 'always' && !instance._ngModelWarningSent)) {
        console.warn(ngModelWarning(name));
        type._ngModelWarningSentOnce = true;
        instance._ngModelWarningSent = true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFLL0YsT0FBTyxFQUFDLDJCQUEyQixFQUF1QixNQUFNLDBCQUEwQixDQUFDO0FBQzNGLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRzlELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUlqRCxNQUFNLFVBQVUsV0FBVyxDQUFDLElBQWlCLEVBQUUsTUFBd0I7SUFDckUsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUssRUFBRSxJQUFLLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxPQUFvQixFQUFFLEdBQWM7SUFDL0QsSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxFQUFFO1FBQ2pELElBQUksQ0FBQyxPQUFPO1lBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYTtZQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUseUNBQXlDLENBQUMsQ0FBQztLQUNyRjtJQUVELGVBQWUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFOUIsR0FBRyxDQUFDLGFBQWMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTdDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0Qyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFdkMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRWhDLDBCQUEwQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQzFCLE9BQXlCLEVBQUUsR0FBYyxFQUN6QyxrQ0FBMkMsSUFBSTtJQUNqRCxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7UUFDaEIsSUFBSSwrQkFBK0IsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtZQUN0RixlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDLENBQUM7SUFFRiw4RkFBOEY7SUFDOUYsK0ZBQStGO0lBQy9GLGdHQUFnRztJQUNoRyw4RkFBOEY7SUFDOUYsOEVBQThFO0lBQzlFLElBQUksR0FBRyxDQUFDLGFBQWEsRUFBRTtRQUNyQixHQUFHLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLEdBQUcsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDM0M7SUFFRCxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFaEMsSUFBSSxPQUFPLEVBQUU7UUFDWCxHQUFHLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUNoQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7S0FDL0M7QUFDSCxDQUFDO0FBRUQsU0FBUyx5QkFBeUIsQ0FBSSxVQUEyQixFQUFFLFFBQW9CO0lBQ3JGLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUF3QixFQUFFLEVBQUU7UUFDOUMsSUFBZ0IsU0FBVSxDQUFDLHlCQUF5QjtZQUN0QyxTQUFVLENBQUMseUJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLDBCQUEwQixDQUFDLE9BQW9CLEVBQUUsR0FBYztJQUM3RSxJQUFJLEdBQUcsQ0FBQyxhQUFjLENBQUMsZ0JBQWdCLEVBQUU7UUFDdkMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLFVBQW1CLEVBQUUsRUFBRTtZQUMvQyxHQUFHLENBQUMsYUFBYyxDQUFDLGdCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQztRQUNGLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRW5ELGtFQUFrRTtRQUNsRSx5REFBeUQ7UUFDekQsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRTtZQUMxQixPQUFPLENBQUMsMkJBQTJCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxlQUFlLENBQUMsT0FBd0IsRUFBRSxHQUE2QjtJQUNyRixNQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRCxJQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO1FBQzFCLE9BQU8sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFjLFVBQVUsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUNoRjtTQUFNLElBQUksT0FBTyxVQUFVLEtBQUssVUFBVSxFQUFFO1FBQzNDLGtGQUFrRjtRQUNsRixxRkFBcUY7UUFDckYsd0ZBQXdGO1FBQ3hGLDRGQUE0RjtRQUM1RiwrRkFBK0Y7UUFDL0YsdUZBQXVGO1FBQ3ZGLDBCQUEwQjtRQUMxQixPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztLQUNyQztJQUVELE1BQU0sZUFBZSxHQUFHLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNELElBQUksR0FBRyxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUU7UUFDL0IsT0FBTyxDQUFDLGtCQUFrQixDQUN0QixlQUFlLENBQW1CLGVBQWUsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztLQUM3RTtTQUFNLElBQUksT0FBTyxlQUFlLEtBQUssVUFBVSxFQUFFO1FBQ2hELE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7S0FDL0M7SUFFRCxvRkFBb0Y7SUFDcEYsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNqRSx5QkFBeUIsQ0FBYyxHQUFHLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDOUUseUJBQXlCLENBQW1CLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzFGLENBQUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sVUFBVSxpQkFBaUIsQ0FDN0IsT0FBNkIsRUFBRSxHQUE2QjtJQUM5RCxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUM3QixJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7UUFDcEIsSUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUMxQixNQUFNLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3RELDJDQUEyQztnQkFDM0MsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxLQUFLLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdEYsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLE1BQU0sRUFBRTtvQkFDbEQsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO29CQUN4QixPQUFPLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7aUJBQzFDO2FBQ0Y7U0FDRjtRQUVELElBQUksR0FBRyxDQUFDLGNBQWMsS0FBSyxJQUFJLEVBQUU7WUFDL0IsTUFBTSxlQUFlLEdBQUcseUJBQXlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNoRSxpREFBaUQ7Z0JBQ2pELE1BQU0sc0JBQXNCLEdBQ3hCLGVBQWUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEtBQUssR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNwRixJQUFJLHNCQUFzQixDQUFDLE1BQU0sS0FBSyxlQUFlLENBQUMsTUFBTSxFQUFFO29CQUM1RCxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7b0JBQ3hCLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2lCQUNwRDthQUNGO1NBQ0Y7S0FDRjtJQUVELGtFQUFrRTtJQUNsRSxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFDdEIseUJBQXlCLENBQWMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRSx5QkFBeUIsQ0FBbUIsR0FBRyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBRTNFLE9BQU8sZ0JBQWdCLENBQUM7QUFDMUIsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsT0FBb0IsRUFBRSxHQUFjO0lBQ25FLEdBQUcsQ0FBQyxhQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtRQUNwRCxPQUFPLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztRQUNqQyxPQUFPLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUM5QixPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUU3QixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUTtZQUFFLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxPQUFvQixFQUFFLEdBQWM7SUFDN0QsR0FBRyxDQUFDLGFBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7UUFDeEMsT0FBTyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFFL0IsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE1BQU0sSUFBSSxPQUFPLENBQUMsY0FBYztZQUFFLGFBQWEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkYsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVE7WUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsT0FBb0IsRUFBRSxHQUFjO0lBQ3pELElBQUksT0FBTyxDQUFDLGFBQWE7UUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDakQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUN4RSxHQUFHLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzdDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxTQUFTLHdCQUF3QixDQUFDLE9BQW9CLEVBQUUsR0FBYztJQUNwRSxNQUFNLFFBQVEsR0FBRyxDQUFDLFFBQWMsRUFBRSxjQUF3QixFQUFFLEVBQUU7UUFDNUQsa0JBQWtCO1FBQ2xCLEdBQUcsQ0FBQyxhQUFjLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXhDLHFCQUFxQjtRQUNyQixJQUFJLGNBQWM7WUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5DLDJEQUEyRDtJQUMzRCx5REFBeUQ7SUFDekQsR0FBRyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRTtRQUMxQixPQUFPLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLGtCQUFrQixDQUM5QixPQUE0QixFQUFFLEdBQTZDO0lBQzdFLElBQUksT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUM7UUFDcEUsV0FBVyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBQy9DLGVBQWUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FDaEMsT0FBNEIsRUFBRSxHQUE2QztJQUM3RSxPQUFPLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsR0FBYztJQUNyQyxPQUFPLFdBQVcsQ0FBQyxHQUFHLEVBQUUsd0VBQXdFLENBQUMsQ0FBQztBQUNwRyxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsR0FBNkIsRUFBRSxPQUFlO0lBQ2pFLElBQUksVUFBa0IsQ0FBQztJQUN2QixJQUFJLEdBQUcsQ0FBQyxJQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN4QixVQUFVLEdBQUcsVUFBVSxHQUFHLENBQUMsSUFBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0tBQ2xEO1NBQU0sSUFBSSxHQUFHLENBQUMsSUFBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3ZCLFVBQVUsR0FBRyxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztLQUNwQztTQUFNO1FBQ0wsVUFBVSxHQUFHLDRCQUE0QixDQUFDO0tBQzNDO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsT0FBNkIsRUFBRSxTQUFjO0lBQzdFLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ25ELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVoQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUU7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN4QyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFFRCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsYUFBbUM7SUFDbkUsa0ZBQWtGO0lBQ2xGLHFDQUFxQztJQUNyQyxPQUFPLE1BQU0sQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxLQUFLLDJCQUEyQixDQUFDO0FBQzFGLENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBZSxFQUFFLFVBQXVCO0lBQzFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzVCLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdkIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQXNCLENBQUM7UUFDM0MsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsY0FBYyxFQUFFO1lBQzNELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDN0MsT0FBTyxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7U0FDaEM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCw2RkFBNkY7QUFDN0YsTUFBTSxVQUFVLG1CQUFtQixDQUMvQixHQUFjLEVBQUUsY0FBc0M7SUFDeEQsSUFBSSxDQUFDLGNBQWM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUVqQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUM7UUFDbkYsV0FBVyxDQUFDLEdBQUcsRUFBRSxtRUFBbUUsQ0FBQyxDQUFDO0lBRXhGLElBQUksZUFBZSxHQUFtQyxTQUFTLENBQUM7SUFDaEUsSUFBSSxlQUFlLEdBQW1DLFNBQVMsQ0FBQztJQUNoRSxJQUFJLGNBQWMsR0FBbUMsU0FBUyxDQUFDO0lBRS9ELGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUF1QixFQUFFLEVBQUU7UUFDakQsSUFBSSxDQUFDLENBQUMsV0FBVyxLQUFLLG9CQUFvQixFQUFFO1lBQzFDLGVBQWUsR0FBRyxDQUFDLENBQUM7U0FFckI7YUFBTSxJQUFJLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQy9CLElBQUksZUFBZSxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQztnQkFDcEUsV0FBVyxDQUFDLEdBQUcsRUFBRSxpRUFBaUUsQ0FBQyxDQUFDO1lBQ3RGLGVBQWUsR0FBRyxDQUFDLENBQUM7U0FFckI7YUFBTTtZQUNMLElBQUksY0FBYyxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQztnQkFDbkUsV0FBVyxDQUFDLEdBQUcsRUFBRSwrREFBK0QsQ0FBQyxDQUFDO1lBQ3BGLGNBQWMsR0FBRyxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksY0FBYztRQUFFLE9BQU8sY0FBYyxDQUFDO0lBQzFDLElBQUksZUFBZTtRQUFFLE9BQU8sZUFBZSxDQUFDO0lBQzVDLElBQUksZUFBZTtRQUFFLE9BQU8sZUFBZSxDQUFDO0lBRTVDLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsRUFBRTtRQUNqRCxXQUFXLENBQUMsR0FBRyxFQUFFLCtDQUErQyxDQUFDLENBQUM7S0FDbkU7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFJLElBQVMsRUFBRSxFQUFLO0lBQ2hELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELDhDQUE4QztBQUM5QyxNQUFNLFVBQVUsZUFBZSxDQUMzQixJQUFZLEVBQUUsSUFBd0MsRUFDdEQsUUFBd0MsRUFBRSxhQUEwQjtJQUN0RSxJQUFJLGFBQWEsS0FBSyxPQUFPO1FBQUUsT0FBTztJQUV0QyxJQUFJLENBQUMsQ0FBQyxhQUFhLEtBQUssSUFBSSxJQUFJLGFBQWEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztRQUN2RixDQUFDLGFBQWEsS0FBSyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsRUFBRTtRQUNqRSxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUM7UUFDcEMsUUFBUSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztLQUNyQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIEZvcm1BcnJheSwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtnZXRDb250cm9sQXN5bmNWYWxpZGF0b3JzLCBnZXRDb250cm9sVmFsaWRhdG9ycywgbWVyZ2VWYWxpZGF0b3JzfSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtEZWZhdWx0VmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kZWZhdWx0X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtGb3JtQXJyYXlOYW1lfSBmcm9tICcuL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9ncm91cF9uYW1lJztcbmltcG9ydCB7bmdNb2RlbFdhcm5pbmd9IGZyb20gJy4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi92YWxpZGF0b3JzJztcblxuXG5leHBvcnQgZnVuY3Rpb24gY29udHJvbFBhdGgobmFtZTogc3RyaW5nfG51bGwsIHBhcmVudDogQ29udHJvbENvbnRhaW5lcik6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIFsuLi5wYXJlbnQucGF0aCEsIG5hbWUhXTtcbn1cblxuLyoqXG4gKiBMaW5rcyBhIEZvcm0gY29udHJvbCBhbmQgYSBGb3JtIGRpcmVjdGl2ZSBieSBzZXR0aW5nIHVwIGNhbGxiYWNrcyAoc3VjaCBhcyBgb25DaGFuZ2VgKSBvbiBib3RoXG4gKiBpbnN0YW5jZXMuIFRoaXMgZnVuY3Rpb24gaXMgdHlwaWNhbGx5IGludm9rZWQgd2hlbiBmb3JtIGRpcmVjdGl2ZSBpcyBiZWluZyBpbml0aWFsaXplZC5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgbGlua2VkLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgdGhhdCBzaG91bGQgYmUgbGlua2VkIHdpdGggYSBnaXZlbiBjb250cm9sLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0VXBDb250cm9sKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgaWYgKCFjb250cm9sKSBfdGhyb3dFcnJvcihkaXIsICdDYW5ub3QgZmluZCBjb250cm9sIHdpdGgnKTtcbiAgICBpZiAoIWRpci52YWx1ZUFjY2Vzc29yKSBfdGhyb3dFcnJvcihkaXIsICdObyB2YWx1ZSBhY2Nlc3NvciBmb3IgZm9ybSBjb250cm9sIHdpdGgnKTtcbiAgfVxuXG4gIHNldFVwVmFsaWRhdG9ycyhjb250cm9sLCBkaXIpO1xuXG4gIGRpci52YWx1ZUFjY2Vzc29yIS53cml0ZVZhbHVlKGNvbnRyb2wudmFsdWUpO1xuXG4gIHNldFVwVmlld0NoYW5nZVBpcGVsaW5lKGNvbnRyb2wsIGRpcik7XG4gIHNldFVwTW9kZWxDaGFuZ2VQaXBlbGluZShjb250cm9sLCBkaXIpO1xuXG4gIHNldFVwQmx1clBpcGVsaW5lKGNvbnRyb2wsIGRpcik7XG5cbiAgc2V0VXBEaXNhYmxlZENoYW5nZUhhbmRsZXIoY29udHJvbCwgZGlyKTtcbn1cblxuLyoqXG4gKiBSZXZlcnRzIGNvbmZpZ3VyYXRpb24gcGVyZm9ybWVkIGJ5IHRoZSBgc2V0VXBDb250cm9sYCBjb250cm9sIGZ1bmN0aW9uLlxuICogRWZmZWN0aXZlbHkgZGlzY29ubmVjdHMgZm9ybSBjb250cm9sIHdpdGggYSBnaXZlbiBmb3JtIGRpcmVjdGl2ZS5cbiAqIFRoaXMgZnVuY3Rpb24gaXMgdHlwaWNhbGx5IGludm9rZWQgd2hlbiBjb3JyZXNwb25kaW5nIGZvcm0gZGlyZWN0aXZlIGlzIGJlaW5nIGRlc3Ryb3llZC5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgd2hpY2ggc2hvdWxkIGJlIGNsZWFuZWQgdXAuXG4gKiBAcGFyYW0gZGlyIERpcmVjdGl2ZSB0aGF0IHNob3VsZCBiZSBkaXNjb25uZWN0ZWQgZnJvbSBhIGdpdmVuIGNvbnRyb2wuXG4gKiBAcGFyYW0gdmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZSBGbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgb25DaGFuZ2UgaGFuZGxlciBzaG91bGRcbiAqICAgICBjb250YWluIGFzc2VydHMgdG8gdmVyaWZ5IHRoYXQgaXQncyBub3QgY2FsbGVkIG9uY2UgZGlyZWN0aXZlIGlzIGRlc3Ryb3llZC4gV2UgbmVlZCB0aGlzIGZsYWdcbiAqICAgICB0byBhdm9pZCBwb3RlbnRpYWxseSBicmVha2luZyBjaGFuZ2VzIGNhdXNlZCBieSBiZXR0ZXIgY29udHJvbCBjbGVhbnVwIGludHJvZHVjZWQgaW4gIzM5MjM1LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5VcENvbnRyb2woXG4gICAgY29udHJvbDogRm9ybUNvbnRyb2x8bnVsbCwgZGlyOiBOZ0NvbnRyb2wsXG4gICAgdmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgY29uc3Qgbm9vcCA9ICgpID0+IHtcbiAgICBpZiAodmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgX25vQ29udHJvbEVycm9yKGRpcik7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBgdmFsdWVBY2Nlc3NvcmAgZmllbGQgaXMgdHlwaWNhbGx5IGRlZmluZWQgb24gRnJvbUNvbnRyb2wgYW5kIEZvcm1Db250cm9sTmFtZSBkaXJlY3RpdmVcbiAgLy8gaW5zdGFuY2VzIGFuZCB0aGVyZSBpcyBhIGxvZ2ljIGluIGBzZWxlY3RWYWx1ZUFjY2Vzc29yYCBmdW5jdGlvbiB0aGF0IHRocm93cyBpZiBpdCdzIG5vdCB0aGVcbiAgLy8gY2FzZS4gV2Ugc3RpbGwgY2hlY2sgdGhlIHByZXNlbmNlIG9mIGB2YWx1ZUFjY2Vzc29yYCBiZWZvcmUgaW52b2tpbmcgaXRzIG1ldGhvZHMgdG8gbWFrZSBzdXJlXG4gIC8vIHRoYXQgY2xlYW51cCB3b3JrcyBjb3JyZWN0bHkgaWYgYXBwIGNvZGUgb3IgdGVzdHMgYXJlIHNldHVwIHRvIGlnbm9yZSB0aGUgZXJyb3IgdGhyb3duIGZyb21cbiAgLy8gYHNlbGVjdFZhbHVlQWNjZXNzb3JgLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNDA1MjEuXG4gIGlmIChkaXIudmFsdWVBY2Nlc3Nvcikge1xuICAgIGRpci52YWx1ZUFjY2Vzc29yLnJlZ2lzdGVyT25DaGFuZ2Uobm9vcCk7XG4gICAgZGlyLnZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPblRvdWNoZWQobm9vcCk7XG4gIH1cblxuICBjbGVhblVwVmFsaWRhdG9ycyhjb250cm9sLCBkaXIpO1xuXG4gIGlmIChjb250cm9sKSB7XG4gICAgZGlyLl9pbnZva2VPbkRlc3Ryb3lDYWxsYmFja3MoKTtcbiAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZTxWPih2YWxpZGF0b3JzOiAoVnxWYWxpZGF0b3IpW10sIG9uQ2hhbmdlOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gIHZhbGlkYXRvcnMuZm9yRWFjaCgodmFsaWRhdG9yOiAoVnxWYWxpZGF0b3IpKSA9PiB7XG4gICAgaWYgKCg8VmFsaWRhdG9yPnZhbGlkYXRvcikucmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZSlcbiAgICAgICg8VmFsaWRhdG9yPnZhbGlkYXRvcikucmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZSEob25DaGFuZ2UpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBTZXRzIHVwIGRpc2FibGVkIGNoYW5nZSBoYW5kbGVyIGZ1bmN0aW9uIG9uIGEgZ2l2ZW4gZm9ybSBjb250cm9sIGlmIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gKiBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBkaXJlY3RpdmUgaW5zdGFuY2Ugc3VwcG9ydHMgdGhlIGBzZXREaXNhYmxlZFN0YXRlYCBjYWxsLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB3aGVyZSBkaXNhYmxlZCBjaGFuZ2UgaGFuZGxlciBzaG91bGQgYmUgc2V0dXAuXG4gKiBAcGFyYW0gZGlyIENvcnJlc3BvbmRpbmcgZGlyZWN0aXZlIGluc3RhbmNlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNvbnRyb2wuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRVcERpc2FibGVkQ2hhbmdlSGFuZGxlcihjb250cm9sOiBGb3JtQ29udHJvbCwgZGlyOiBOZ0NvbnRyb2wpOiB2b2lkIHtcbiAgaWYgKGRpci52YWx1ZUFjY2Vzc29yIS5zZXREaXNhYmxlZFN0YXRlKSB7XG4gICAgY29uc3Qgb25EaXNhYmxlZENoYW5nZSA9IChpc0Rpc2FibGVkOiBib29sZWFuKSA9PiB7XG4gICAgICBkaXIudmFsdWVBY2Nlc3NvciEuc2V0RGlzYWJsZWRTdGF0ZSEoaXNEaXNhYmxlZCk7XG4gICAgfTtcbiAgICBjb250cm9sLnJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShvbkRpc2FibGVkQ2hhbmdlKTtcblxuICAgIC8vIFJlZ2lzdGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2xlYW51cCBkaXNhYmxlZCBjaGFuZ2UgaGFuZGxlclxuICAgIC8vIGZyb20gYSBjb250cm9sIGluc3RhbmNlIHdoZW4gYSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLlxuICAgIGRpci5fcmVnaXN0ZXJPbkRlc3Ryb3koKCkgPT4ge1xuICAgICAgY29udHJvbC5fdW5yZWdpc3Rlck9uRGlzYWJsZWRDaGFuZ2Uob25EaXNhYmxlZENoYW5nZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTZXRzIHVwIHN5bmMgYW5kIGFzeW5jIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIG9uIHByb3ZpZGVkIGZvcm0gY29udHJvbC5cbiAqIFRoaXMgZnVuY3Rpb24gbWVyZ2VzIHZhbGlkYXRvcnMgZnJvbSB0aGUgZGlyZWN0aXZlIGludG8gdGhlIHZhbGlkYXRvcnMgb2YgdGhlIGNvbnRyb2wuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIHdoZXJlIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIHNob3VsZCBiZSBzZXR1cC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIGluc3RhbmNlIHRoYXQgY29udGFpbnMgdmFsaWRhdG9ycyB0byBiZSBzZXR1cC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFVwVmFsaWRhdG9ycyhjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGRpcjogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlKTogdm9pZCB7XG4gIGNvbnN0IHZhbGlkYXRvcnMgPSBnZXRDb250cm9sVmFsaWRhdG9ycyhjb250cm9sKTtcbiAgaWYgKGRpci52YWxpZGF0b3IgIT09IG51bGwpIHtcbiAgICBjb250cm9sLnNldFZhbGlkYXRvcnMobWVyZ2VWYWxpZGF0b3JzPFZhbGlkYXRvckZuPih2YWxpZGF0b3JzLCBkaXIudmFsaWRhdG9yKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbGlkYXRvcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBJZiBzeW5jIHZhbGlkYXRvcnMgYXJlIHJlcHJlc2VudGVkIGJ5IGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvbiwgd2UgZm9yY2UgdGhlXG4gICAgLy8gYFZhbGlkYXRvcnMuY29tcG9zZWAgY2FsbCB0byBoYXBwZW4gYnkgZXhlY3V0aW5nIHRoZSBgc2V0VmFsaWRhdG9yc2AgZnVuY3Rpb24gd2l0aFxuICAgIC8vIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhhdCBmdW5jdGlvbi4gV2UgbmVlZCB0aGlzIHRvIGF2b2lkIHBvc3NpYmxlIGRpc2NyZXBhbmNpZXMgaW5cbiAgICAvLyB2YWxpZGF0b3JzIGJlaGF2aW9yLCBzbyBzeW5jIHZhbGlkYXRvcnMgYXJlIGFsd2F5cyBwcm9jZXNzZWQgYnkgdGhlIGBWYWxpZGF0b3JzLmNvbXBvc2VgLlxuICAgIC8vIE5vdGU6IHdlIHNob3VsZCBjb25zaWRlciBtb3ZpbmcgdGhpcyBsb2dpYyBpbnNpZGUgdGhlIGBzZXRWYWxpZGF0b3JzYCBmdW5jdGlvbiBpdHNlbGYsIHNvIHdlXG4gICAgLy8gaGF2ZSBjb25zaXN0ZW50IGJlaGF2aW9yIG9uIEFic3RyYWN0Q29udHJvbCBBUEkgbGV2ZWwuIFRoZSBzYW1lIGFwcGxpZXMgdG8gdGhlIGFzeW5jXG4gICAgLy8gdmFsaWRhdG9ycyBsb2dpYyBiZWxvdy5cbiAgICBjb250cm9sLnNldFZhbGlkYXRvcnMoW3ZhbGlkYXRvcnNdKTtcbiAgfVxuXG4gIGNvbnN0IGFzeW5jVmFsaWRhdG9ycyA9IGdldENvbnRyb2xBc3luY1ZhbGlkYXRvcnMoY29udHJvbCk7XG4gIGlmIChkaXIuYXN5bmNWYWxpZGF0b3IgIT09IG51bGwpIHtcbiAgICBjb250cm9sLnNldEFzeW5jVmFsaWRhdG9ycyhcbiAgICAgICAgbWVyZ2VWYWxpZGF0b3JzPEFzeW5jVmFsaWRhdG9yRm4+KGFzeW5jVmFsaWRhdG9ycywgZGlyLmFzeW5jVmFsaWRhdG9yKSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGFzeW5jVmFsaWRhdG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNvbnRyb2wuc2V0QXN5bmNWYWxpZGF0b3JzKFthc3luY1ZhbGlkYXRvcnNdKTtcbiAgfVxuXG4gIC8vIFJlLXJ1biB2YWxpZGF0aW9uIHdoZW4gdmFsaWRhdG9yIGJpbmRpbmcgY2hhbmdlcywgZS5nLiBtaW5sZW5ndGg9MyAtPiBtaW5sZW5ndGg9NFxuICBjb25zdCBvblZhbGlkYXRvckNoYW5nZSA9ICgpID0+IGNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlPFZhbGlkYXRvckZuPihkaXIuX3Jhd1ZhbGlkYXRvcnMsIG9uVmFsaWRhdG9yQ2hhbmdlKTtcbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZTxBc3luY1ZhbGlkYXRvckZuPihkaXIuX3Jhd0FzeW5jVmFsaWRhdG9ycywgb25WYWxpZGF0b3JDaGFuZ2UpO1xufVxuXG4vKipcbiAqIENsZWFucyB1cCBzeW5jIGFuZCBhc3luYyBkaXJlY3RpdmUgdmFsaWRhdG9ycyBvbiBwcm92aWRlZCBmb3JtIGNvbnRyb2wuXG4gKiBUaGlzIGZ1bmN0aW9uIHJldmVydHMgdGhlIHNldHVwIHBlcmZvcm1lZCBieSB0aGUgYHNldFVwVmFsaWRhdG9yc2AgZnVuY3Rpb24sIGkuZS5cbiAqIHJlbW92ZXMgZGlyZWN0aXZlLXNwZWNpZmljIHZhbGlkYXRvcnMgZnJvbSBhIGdpdmVuIGNvbnRyb2wgaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIGZyb20gd2hlcmUgZGlyZWN0aXZlIHZhbGlkYXRvcnMgc2hvdWxkIGJlIHJlbW92ZWQuXG4gKiBAcGFyYW0gZGlyIERpcmVjdGl2ZSBpbnN0YW5jZSB0aGF0IGNvbnRhaW5zIHZhbGlkYXRvcnMgdG8gYmUgcmVtb3ZlZC5cbiAqIEByZXR1cm5zIHRydWUgaWYgYSBjb250cm9sIHdhcyB1cGRhdGVkIGFzIGEgcmVzdWx0IG9mIHRoaXMgYWN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5VcFZhbGlkYXRvcnMoXG4gICAgY29udHJvbDogQWJzdHJhY3RDb250cm9sfG51bGwsIGRpcjogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlKTogYm9vbGVhbiB7XG4gIGxldCBpc0NvbnRyb2xVcGRhdGVkID0gZmFsc2U7XG4gIGlmIChjb250cm9sICE9PSBudWxsKSB7XG4gICAgaWYgKGRpci52YWxpZGF0b3IgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcnMgPSBnZXRDb250cm9sVmFsaWRhdG9ycyhjb250cm9sKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbGlkYXRvcnMpICYmIHZhbGlkYXRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBGaWx0ZXIgb3V0IGRpcmVjdGl2ZSB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRWYWxpZGF0b3JzID0gdmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvciAhPT0gZGlyLnZhbGlkYXRvcik7XG4gICAgICAgIGlmICh1cGRhdGVkVmFsaWRhdG9ycy5sZW5ndGggIT09IHZhbGlkYXRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgaXNDb250cm9sVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgY29udHJvbC5zZXRWYWxpZGF0b3JzKHVwZGF0ZWRWYWxpZGF0b3JzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXIuYXN5bmNWYWxpZGF0b3IgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9ycyA9IGdldENvbnRyb2xBc3luY1ZhbGlkYXRvcnMoY29udHJvbCk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShhc3luY1ZhbGlkYXRvcnMpICYmIGFzeW5jVmFsaWRhdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgZGlyZWN0aXZlIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAgICAgICAgY29uc3QgdXBkYXRlZEFzeW5jVmFsaWRhdG9ycyA9XG4gICAgICAgICAgICBhc3luY1ZhbGlkYXRvcnMuZmlsdGVyKGFzeW5jVmFsaWRhdG9yID0+IGFzeW5jVmFsaWRhdG9yICE9PSBkaXIuYXN5bmNWYWxpZGF0b3IpO1xuICAgICAgICBpZiAodXBkYXRlZEFzeW5jVmFsaWRhdG9ycy5sZW5ndGggIT09IGFzeW5jVmFsaWRhdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBpc0NvbnRyb2xVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICBjb250cm9sLnNldEFzeW5jVmFsaWRhdG9ycyh1cGRhdGVkQXN5bmNWYWxpZGF0b3JzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENsZWFyIG9uVmFsaWRhdG9yQ2hhbmdlIGNhbGxiYWNrcyBieSBwcm92aWRpbmcgYSBub29wIGZ1bmN0aW9uLlxuICBjb25zdCBub29wID0gKCkgPT4ge307XG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U8VmFsaWRhdG9yRm4+KGRpci5fcmF3VmFsaWRhdG9ycywgbm9vcCk7XG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U8QXN5bmNWYWxpZGF0b3JGbj4oZGlyLl9yYXdBc3luY1ZhbGlkYXRvcnMsIG5vb3ApO1xuXG4gIHJldHVybiBpc0NvbnRyb2xVcGRhdGVkO1xufVxuXG5mdW5jdGlvbiBzZXRVcFZpZXdDaGFuZ2VQaXBlbGluZShjb250cm9sOiBGb3JtQ29udHJvbCwgZGlyOiBOZ0NvbnRyb2wpOiB2b2lkIHtcbiAgZGlyLnZhbHVlQWNjZXNzb3IhLnJlZ2lzdGVyT25DaGFuZ2UoKG5ld1ZhbHVlOiBhbnkpID0+IHtcbiAgICBjb250cm9sLl9wZW5kaW5nVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBjb250cm9sLl9wZW5kaW5nQ2hhbmdlID0gdHJ1ZTtcbiAgICBjb250cm9sLl9wZW5kaW5nRGlydHkgPSB0cnVlO1xuXG4gICAgaWYgKGNvbnRyb2wudXBkYXRlT24gPT09ICdjaGFuZ2UnKSB1cGRhdGVDb250cm9sKGNvbnRyb2wsIGRpcik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRVcEJsdXJQaXBlbGluZShjb250cm9sOiBGb3JtQ29udHJvbCwgZGlyOiBOZ0NvbnRyb2wpOiB2b2lkIHtcbiAgZGlyLnZhbHVlQWNjZXNzb3IhLnJlZ2lzdGVyT25Ub3VjaGVkKCgpID0+IHtcbiAgICBjb250cm9sLl9wZW5kaW5nVG91Y2hlZCA9IHRydWU7XG5cbiAgICBpZiAoY29udHJvbC51cGRhdGVPbiA9PT0gJ2JsdXInICYmIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UpIHVwZGF0ZUNvbnRyb2woY29udHJvbCwgZGlyKTtcbiAgICBpZiAoY29udHJvbC51cGRhdGVPbiAhPT0gJ3N1Ym1pdCcpIGNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlQ29udHJvbChjb250cm9sOiBGb3JtQ29udHJvbCwgZGlyOiBOZ0NvbnRyb2wpOiB2b2lkIHtcbiAgaWYgKGNvbnRyb2wuX3BlbmRpbmdEaXJ0eSkgY29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICBjb250cm9sLnNldFZhbHVlKGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSwge2VtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2V9KTtcbiAgZGlyLnZpZXdUb01vZGVsVXBkYXRlKGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSk7XG4gIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gc2V0VXBNb2RlbENoYW5nZVBpcGVsaW5lKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBjb25zdCBvbkNoYW5nZSA9IChuZXdWYWx1ZT86IGFueSwgZW1pdE1vZGVsRXZlbnQ/OiBib29sZWFuKSA9PiB7XG4gICAgLy8gY29udHJvbCAtPiB2aWV3XG4gICAgZGlyLnZhbHVlQWNjZXNzb3IhLndyaXRlVmFsdWUobmV3VmFsdWUpO1xuXG4gICAgLy8gY29udHJvbCAtPiBuZ01vZGVsXG4gICAgaWYgKGVtaXRNb2RlbEV2ZW50KSBkaXIudmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWUpO1xuICB9O1xuICBjb250cm9sLnJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2UpO1xuXG4gIC8vIFJlZ2lzdGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2xlYW51cCBvbkNoYW5nZSBoYW5kbGVyXG4gIC8vIGZyb20gYSBjb250cm9sIGluc3RhbmNlIHdoZW4gYSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLlxuICBkaXIuX3JlZ2lzdGVyT25EZXN0cm95KCgpID0+IHtcbiAgICBjb250cm9sLl91bnJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2UpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBMaW5rcyBhIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgaW5zdGFuY2UgYW5kIGNvcnJlc3BvbmRpbmcgRm9ybSBkaXJlY3RpdmUgYnkgc2V0dGluZyB1cCB2YWxpZGF0b3JzXG4gKiBwcmVzZW50IGluIHRoZSB2aWV3LlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgbGlua2VkLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgdGhhdCBwcm92aWRlcyB2aWV3IHZhbGlkYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRVcEZvcm1Db250YWluZXIoXG4gICAgY29udHJvbDogRm9ybUdyb3VwfEZvcm1BcnJheSwgZGlyOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZXxGb3JtQXJyYXlOYW1lKSB7XG4gIGlmIChjb250cm9sID09IG51bGwgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpXG4gICAgX3Rocm93RXJyb3IoZGlyLCAnQ2Fubm90IGZpbmQgY29udHJvbCB3aXRoJyk7XG4gIHNldFVwVmFsaWRhdG9ycyhjb250cm9sLCBkaXIpO1xufVxuXG4vKipcbiAqIFJldmVydHMgdGhlIHNldHVwIHBlcmZvcm1lZCBieSB0aGUgYHNldFVwRm9ybUNvbnRhaW5lcmAgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybUdyb3VwIG9yIEZvcm1BcnJheSBpbnN0YW5jZSB0aGF0IHNob3VsZCBiZSBjbGVhbmVkIHVwLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgdGhhdCBwcm92aWRlZCB2aWV3IHZhbGlkYXRvcnMuXG4gKiBAcmV0dXJucyB0cnVlIGlmIGEgY29udHJvbCB3YXMgdXBkYXRlZCBhcyBhIHJlc3VsdCBvZiB0aGlzIGFjdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuVXBGb3JtQ29udGFpbmVyKFxuICAgIGNvbnRyb2w6IEZvcm1Hcm91cHxGb3JtQXJyYXksIGRpcjogQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV8Rm9ybUFycmF5TmFtZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gY2xlYW5VcFZhbGlkYXRvcnMoY29udHJvbCwgZGlyKTtcbn1cblxuZnVuY3Rpb24gX25vQ29udHJvbEVycm9yKGRpcjogTmdDb250cm9sKSB7XG4gIHJldHVybiBfdGhyb3dFcnJvcihkaXIsICdUaGVyZSBpcyBubyBGb3JtQ29udHJvbCBpbnN0YW5jZSBhdHRhY2hlZCB0byBmb3JtIGNvbnRyb2wgZWxlbWVudCB3aXRoJyk7XG59XG5cbmZ1bmN0aW9uIF90aHJvd0Vycm9yKGRpcjogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgbGV0IG1lc3NhZ2VFbmQ6IHN0cmluZztcbiAgaWYgKGRpci5wYXRoIS5sZW5ndGggPiAxKSB7XG4gICAgbWVzc2FnZUVuZCA9IGBwYXRoOiAnJHtkaXIucGF0aCEuam9pbignIC0+ICcpfSdgO1xuICB9IGVsc2UgaWYgKGRpci5wYXRoIVswXSkge1xuICAgIG1lc3NhZ2VFbmQgPSBgbmFtZTogJyR7ZGlyLnBhdGh9J2A7XG4gIH0gZWxzZSB7XG4gICAgbWVzc2FnZUVuZCA9ICd1bnNwZWNpZmllZCBuYW1lIGF0dHJpYnV0ZSc7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKGAke21lc3NhZ2V9ICR7bWVzc2FnZUVuZH1gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvcGVydHlVcGRhdGVkKGNoYW5nZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9LCB2aWV3TW9kZWw6IGFueSk6IGJvb2xlYW4ge1xuICBpZiAoIWNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ21vZGVsJykpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgY2hhbmdlID0gY2hhbmdlc1snbW9kZWwnXTtcblxuICBpZiAoY2hhbmdlLmlzRmlyc3RDaGFuZ2UoKSkgcmV0dXJuIHRydWU7XG4gIHJldHVybiAhT2JqZWN0LmlzKHZpZXdNb2RlbCwgY2hhbmdlLmN1cnJlbnRWYWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0J1aWx0SW5BY2Nlc3Nvcih2YWx1ZUFjY2Vzc29yOiBDb250cm9sVmFsdWVBY2Nlc3Nvcik6IGJvb2xlYW4ge1xuICAvLyBDaGVjayBpZiBhIGdpdmVuIHZhbHVlIGFjY2Vzc29yIGlzIGFuIGluc3RhbmNlIG9mIGEgY2xhc3MgdGhhdCBkaXJlY3RseSBleHRlbmRzXG4gIC8vIGBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3JgIG9uZS5cbiAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZUFjY2Vzc29yLmNvbnN0cnVjdG9yKSA9PT0gQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3luY1BlbmRpbmdDb250cm9scyhmb3JtOiBGb3JtR3JvdXAsIGRpcmVjdGl2ZXM6IE5nQ29udHJvbFtdKTogdm9pZCB7XG4gIGZvcm0uX3N5bmNQZW5kaW5nQ29udHJvbHMoKTtcbiAgZGlyZWN0aXZlcy5mb3JFYWNoKGRpciA9PiB7XG4gICAgY29uc3QgY29udHJvbCA9IGRpci5jb250cm9sIGFzIEZvcm1Db250cm9sO1xuICAgIGlmIChjb250cm9sLnVwZGF0ZU9uID09PSAnc3VibWl0JyAmJiBjb250cm9sLl9wZW5kaW5nQ2hhbmdlKSB7XG4gICAgICBkaXIudmlld1RvTW9kZWxVcGRhdGUoY29udHJvbC5fcGVuZGluZ1ZhbHVlKTtcbiAgICAgIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UgPSBmYWxzZTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBUT0RPOiB2c2F2a2luIHJlbW92ZSBpdCBvbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzMwMTEgaXMgaW1wbGVtZW50ZWRcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RWYWx1ZUFjY2Vzc29yKFxuICAgIGRpcjogTmdDb250cm9sLCB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSk6IENvbnRyb2xWYWx1ZUFjY2Vzc29yfG51bGwge1xuICBpZiAoIXZhbHVlQWNjZXNzb3JzKSByZXR1cm4gbnVsbDtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVBY2Nlc3NvcnMpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKVxuICAgIF90aHJvd0Vycm9yKGRpciwgJ1ZhbHVlIGFjY2Vzc29yIHdhcyBub3QgcHJvdmlkZWQgYXMgYW4gYXJyYXkgZm9yIGZvcm0gY29udHJvbCB3aXRoJyk7XG5cbiAgbGV0IGRlZmF1bHRBY2Nlc3NvcjogQ29udHJvbFZhbHVlQWNjZXNzb3J8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBsZXQgYnVpbHRpbkFjY2Vzc29yOiBDb250cm9sVmFsdWVBY2Nlc3Nvcnx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGxldCBjdXN0b21BY2Nlc3NvcjogQ29udHJvbFZhbHVlQWNjZXNzb3J8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIHZhbHVlQWNjZXNzb3JzLmZvckVhY2goKHY6IENvbnRyb2xWYWx1ZUFjY2Vzc29yKSA9PiB7XG4gICAgaWYgKHYuY29uc3RydWN0b3IgPT09IERlZmF1bHRWYWx1ZUFjY2Vzc29yKSB7XG4gICAgICBkZWZhdWx0QWNjZXNzb3IgPSB2O1xuXG4gICAgfSBlbHNlIGlmIChpc0J1aWx0SW5BY2Nlc3Nvcih2KSkge1xuICAgICAgaWYgKGJ1aWx0aW5BY2Nlc3NvciAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnTW9yZSB0aGFuIG9uZSBidWlsdC1pbiB2YWx1ZSBhY2Nlc3NvciBtYXRjaGVzIGZvcm0gY29udHJvbCB3aXRoJyk7XG4gICAgICBidWlsdGluQWNjZXNzb3IgPSB2O1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjdXN0b21BY2Nlc3NvciAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnTW9yZSB0aGFuIG9uZSBjdXN0b20gdmFsdWUgYWNjZXNzb3IgbWF0Y2hlcyBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICAgICAgY3VzdG9tQWNjZXNzb3IgPSB2O1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGN1c3RvbUFjY2Vzc29yKSByZXR1cm4gY3VzdG9tQWNjZXNzb3I7XG4gIGlmIChidWlsdGluQWNjZXNzb3IpIHJldHVybiBidWlsdGluQWNjZXNzb3I7XG4gIGlmIChkZWZhdWx0QWNjZXNzb3IpIHJldHVybiBkZWZhdWx0QWNjZXNzb3I7XG5cbiAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgIF90aHJvd0Vycm9yKGRpciwgJ05vIHZhbGlkIHZhbHVlIGFjY2Vzc29yIGZvciBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTGlzdEl0ZW08VD4obGlzdDogVFtdLCBlbDogVCk6IHZvaWQge1xuICBjb25zdCBpbmRleCA9IGxpc3QuaW5kZXhPZihlbCk7XG4gIGlmIChpbmRleCA+IC0xKSBsaXN0LnNwbGljZShpbmRleCwgMSk7XG59XG5cbi8vIFRPRE8oa2FyYSk6IHJlbW92ZSBhZnRlciBkZXByZWNhdGlvbiBwZXJpb2RcbmV4cG9ydCBmdW5jdGlvbiBfbmdNb2RlbFdhcm5pbmcoXG4gICAgbmFtZTogc3RyaW5nLCB0eXBlOiB7X25nTW9kZWxXYXJuaW5nU2VudE9uY2U6IGJvb2xlYW59LFxuICAgIGluc3RhbmNlOiB7X25nTW9kZWxXYXJuaW5nU2VudDogYm9vbGVhbn0sIHdhcm5pbmdDb25maWc6IHN0cmluZ3xudWxsKSB7XG4gIGlmICh3YXJuaW5nQ29uZmlnID09PSAnbmV2ZXInKSByZXR1cm47XG5cbiAgaWYgKCgod2FybmluZ0NvbmZpZyA9PT0gbnVsbCB8fCB3YXJuaW5nQ29uZmlnID09PSAnb25jZScpICYmICF0eXBlLl9uZ01vZGVsV2FybmluZ1NlbnRPbmNlKSB8fFxuICAgICAgKHdhcm5pbmdDb25maWcgPT09ICdhbHdheXMnICYmICFpbnN0YW5jZS5fbmdNb2RlbFdhcm5pbmdTZW50KSkge1xuICAgIGNvbnNvbGUud2FybihuZ01vZGVsV2FybmluZyhuYW1lKSk7XG4gICAgdHlwZS5fbmdNb2RlbFdhcm5pbmdTZW50T25jZSA9IHRydWU7XG4gICAgaW5zdGFuY2UuX25nTW9kZWxXYXJuaW5nU2VudCA9IHRydWU7XG4gIH1cbn1cbiJdfQ==