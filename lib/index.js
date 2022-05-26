"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useTypedForm(initial) {
    let [state, setState] = (0, react_1.useState)(initial !== null && initial !== void 0 ? initial : {});
    let [errors, setErrors] = (0, react_1.useState)({});
    let validators = {};
    const _get = (keyPath, state) => {
        if (keyPath === undefined) {
            return undefined;
        }
        let retval = state;
        if (keyPath === '') {
            return retval;
        }
        let items = keyPath.split(".");
        for (let item of items) {
            retval = retval[item];
        }
        return retval;
    };
    const get = (keyPath) => {
        return _get(keyPath, state);
    };
    const set = (keyPath, value) => {
        let retval = { ...state };
        let items = keyPath.split(".");
        let containerPath = items.slice(0, -1);
        let container = _get(containerPath.join("."), retval);
        container[items[items.length - 1]] = value;
        setState(retval);
    };
    const push = (keyPath, value) => {
        let arr = get(keyPath);
        arr.push(value);
        set(keyPath, arr);
    };
    const pop = (keyPath) => {
        let arr = get(keyPath);
        arr.pop();
        set(keyPath, arr);
    };
    const reset = (data) => {
        setState(data);
    };
    const getState = () => {
        return state;
    };
    const getError = (keyPath) => {
        return errors[keyPath];
    };
    const setError = (keyPath, error) => {
        if (error === undefined) {
            let newErrors = { ...errors };
            delete newErrors[keyPath];
            setErrors(newErrors);
        }
        else {
            setErrors({ ...errors, [keyPath]: error });
        }
    };
    const getErrors = () => {
        return errors;
    };
    const validate = async () => {
        let final = {};
        for (let keyPath of Object.keys(validators)) {
            let validator = validators[keyPath];
            final = { ...final, ...await _validateWithValidator(keyPath, get(keyPath), validator) };
        }
        setErrors(final);
        return Object.keys(final).length === 0;
    };
    const setValidator = (keyPath, validator) => {
        validators[keyPath] = validator;
    };
    const validatePath = (keyPath) => {
        if (validators[keyPath]) {
            _validateWithValidator(keyPath, get(keyPath), validators[keyPath]).then(() => { });
        }
    };
    const setAndValidate = (keyPath, value) => {
        set(keyPath, value);
        if (validators[keyPath]) {
            _validateWithValidator(keyPath, value, validators[keyPath]).then(() => { });
        }
    };
    const _validateWithValidator = (keyPath, value, validator) => {
        return new Promise((resolve, _reject) => {
            let result = validator(value);
            if (typeof result === "string") {
                setError(keyPath, result);
                resolve({ [keyPath]: result });
            }
            else if (result === false) {
                let result = `Value at '${keyPath}' is invalid.`;
                setError(keyPath, result);
                resolve({ [keyPath]: result });
            }
            else if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
                result.then((result) => {
                    if (typeof result === "string") {
                        setError(keyPath, result);
                        resolve({ [keyPath]: result });
                    }
                    else if (result === false) {
                        let result = `Value at '${keyPath}' is invalid.`;
                        setError(keyPath, result);
                        resolve({ [keyPath]: result });
                    }
                    else {
                        setError(keyPath, undefined);
                        resolve({});
                    }
                });
            }
            else {
                setError(keyPath, undefined);
                resolve({});
            }
        });
    };
    const bindInput = (keyPath, options) => {
        var _a, _b;
        if (options === null || options === void 0 ? void 0 : options.validate) {
            validators[keyPath] = options.validate;
        }
        if (get(keyPath) === undefined) {
            set(keyPath, ((_a = options === null || options === void 0 ? void 0 : options.valueToString) !== null && _a !== void 0 ? _a : ((v) => (v ? String(v) : '')))(undefined));
        }
        return {
            value: ((_b = options === null || options === void 0 ? void 0 : options.valueToString) !== null && _b !== void 0 ? _b : ((v) => (v ? String(v) : '')))(get(keyPath)),
            onChange: (e) => {
                var _a;
                let newValue = ((_a = options === null || options === void 0 ? void 0 : options.stringToValue) !== null && _a !== void 0 ? _a : ((v) => v))(e.target.value);
                set(keyPath, newValue);
                if ((options === null || options === void 0 ? void 0 : options.validateOnTyping) && validators[keyPath]) {
                    _validateWithValidator(keyPath, newValue, validators[keyPath]).then(() => { });
                }
                else {
                    if (getError(keyPath) && validators[keyPath]) {
                        _validateWithValidator(keyPath, newValue, validators[keyPath]).then(() => { });
                    }
                }
            }
        };
    };
    const bindCheckbox = (keyPath, options) => {
        var _a;
        return {
            checked: ((_a = options === null || options === void 0 ? void 0 : options.toBool) !== null && _a !== void 0 ? _a : ((v) => !!v))(get(keyPath)),
            onChange: (e) => {
                var _a;
                set(keyPath, ((_a = options === null || options === void 0 ? void 0 : options.toValue) !== null && _a !== void 0 ? _a : ((v) => v))(e.target.checked));
            }
        };
    };
    const bindRadio = (keyPath, value, options) => {
        if (options === null || options === void 0 ? void 0 : options.validate) {
            validators[keyPath] = options.validate;
        }
        return {
            checked: get(keyPath) === value,
            onChange: (e) => {
                set(keyPath, value);
                if (getError(keyPath) && validators[keyPath]) {
                    _validateWithValidator(keyPath, value, validators[keyPath]).then(() => { });
                }
            }
        };
    };
    const bindCheckboxGroup = (keyPath, value, options) => {
        var _a;
        if (options === null || options === void 0 ? void 0 : options.validate) {
            validators[keyPath] = options.validate;
        }
        return {
            checked: !!((_a = get(keyPath)) === null || _a === void 0 ? void 0 : _a.includes(value)),
            onChange: (e) => {
                let list = get(keyPath);
                if (list === null || list === void 0 ? void 0 : list.includes(value)) {
                    let newList = [...list];
                    newList.splice(list.indexOf(value), 1);
                    set(keyPath, newList);
                    if (getError(keyPath) && validators[keyPath]) {
                        _validateWithValidator(keyPath, newList, validators[keyPath]).then(() => { });
                    }
                }
                else {
                    let newList;
                    if (list) {
                        newList = [...list];
                    }
                    else {
                        newList = [];
                    }
                    newList.push(value);
                    set(keyPath, newList);
                    if (getError(keyPath) && validators[keyPath]) {
                        _validateWithValidator(keyPath, newList, validators[keyPath]).then(() => { });
                    }
                }
            }
        };
    };
    const bindSelect = (keyPath) => {
        return {
            value: get(keyPath),
            onChange(e) {
                let option = e.target.selectedOptions[0];
                set(keyPath, option.value);
            }
        };
    };
    const bindOption = (keyPath, value) => {
        return {
            value,
        };
    };
    const bindErrorMessage = (keyPath) => {
        let errorMessage = getError(keyPath);
        return {
            hidden: !errorMessage,
            children: errorMessage
        };
    };
    return {
        get, set, push, pop,
        reset, getState, setError, setErrors, getError, getErrors, validate, setValidator, validatePath, setAndValidate,
        bindInput, bindCheckbox, bindRadio, bindCheckboxGroup, bindSelect, bindOption,
        bindErrorMessage,
    };
}
exports.default = useTypedForm;
