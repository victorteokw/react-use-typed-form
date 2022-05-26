useTypedForm
============

No aggressiveness React hook for forms written in TypeScript.

## Usage
```ts
const form = useTypedForm<YourTypeInterface>(initialValueOrUndefined)

return <input {...bindInput("user.friends.0.name")} />
```

## API

### `get(keyPath)`
Get form value at `keyPath`.

### `set(keyPath, value)`
Set form value at `keyPath`.

### `push(keyPath, value)`
Push a form value into the array at `keyPath`.

### `pop(keyPath)`
Remove an item from the array at `keyPath`.

### `reset(newFormState)`
Reset the form state to the new form state.

### `getState()`
Get the full form state.

### `setError(keyPath, messageOrUndefined)`
Set or remove the error message at `keyPath`.

### `setErrors(newErrorState)`
Reset the error messages.

### `getError(keyPath)`
Get the error message at `keyPath`.

### `getErrors()`
Get the error state.

### `validate()`
Validate all form fields.

### `setValidator(keyPath, validator)`
Assign a validator to value at `keyPath`.

### `validatePath(keyPath)`
Validate a single path and generate the corresponding error message if needed.

### `setAndValidate(keyPath, value)`
Set `value` at `keyPath` and trigger validation.

### `bindInput(keyPath, options?)`
Bind value at `keyPath` to an input or textarea element.

### `bindCheckbox(keyPath, options?)`
Bind value at `keyPath` to a single checkbox element.

### `bindRadio(keyPath, value, options?)`
Bind a single `value` to radio element. It's selected when value at `keyPath` equals it's binded value.

### `bindCheckboxGroup(keyPath, value, options?)`
Bind a single `value` to checkbox element. It's selected when value at `keyPath` contains it's binded value.

### `bindSelect(keyPath)`
Bind a single value at `keyPath` to a select element.

### `bindOption(keyPath, value)`
Bind a single value to a option element. It's selected when the select element's value and this binded value equals.

### `bindErrorMessage(keyPath)`
Bind to any elements usually div. When there is an error at keyPath, it's visible and it's children is the error message string.


