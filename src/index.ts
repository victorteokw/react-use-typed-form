import { ChangeEvent, ReactNode, useState } from "react"
import { O, F, S } from "ts-toolbelt"

type EleType<ArrType> = ArrType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type Validator<T> = (value: T) => string | undefined | boolean | null | Promise<string | undefined | boolean | null>

function useTypedForm<T>(initial?: Partial<T>): {
    set: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => void,
    get: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => O.Path<Partial<T>, S.Split<KP, '.'>>,
    push: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>) => void, // todo: KP array only
    pop: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => void, // todo: KP array only
    reset: (data: Partial<T>) => void,
    getState: () => Partial<T>,
    setError: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: string | undefined) => void,
    setErrors: (errors: {[key: string]: string | undefined}) => void,
    getError: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => string | undefined,
    getErrors: () => {[key: string]: string | undefined},
    validate: () => Promise<boolean>,
    setValidator: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, validator: Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>) => void,
    validatePath: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => void,
    setAndValidate: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => void,
    bindInput: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, options?: {
        valueToString?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => string,
        stringToValue?: (value: string) => O.Path<Partial<T>, S.Split<KP, '.'>>,
        validate?: Validator<NonNullable<O.Path<Partial<T>, S.Split<KP, '.'>>>>,
        validateOnTyping?: boolean,
    }) => {
        value: string,
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    },
    bindCheckbox: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, options?: {
        toBool?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => boolean,
        toValue?: (bool: boolean) => O.Path<Partial<T>, S.Split<KP, '.'>>,
    }) => {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    },
    bindRadio: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>, options?: {
        validate?: Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>
    }) => {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    },
    bindCheckboxGroup: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>, options?: {
        validate? : Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>
    }) => {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    },
    bindSelect: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => {
        value: O.Path<Partial<T>, S.Split<KP, '.'>>,
        onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
    },
    bindOption: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => {
        value: O.Path<Partial<T>, S.Split<KP, '.'>>,
    },
    bindErrorMessage: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => {
        hidden: boolean,
        children: ReactNode,
    }
} {

    let [state, setState] = useState<Partial<T>>(initial ?? {})
    let [errors, setErrors] = useState<{[key: string]: string}>({})
    let validators: {[key: string]: Validator<any>} = {}

    const _get = (keyPath: string, state: any): any => {
        if (keyPath === undefined) {
            return undefined
        }
        let retval = state
        if (keyPath === '') {
            return retval
        }
        let items = keyPath.split(".")
        for (let item of items) {
            retval = retval[item]
        }
        return retval
    }

    const get: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => O.Path<Partial<T>, S.Split<KP, '.'>> = (keyPath) => {
        return _get(keyPath, state)
    }

    const set = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => {
        let retval = {...state}
        let items = keyPath.split(".")
        let containerPath = items.slice(0, -1)
        let container = _get(containerPath.join("."), retval)
        container[items[items.length - 1]] = value
        setState(retval)
    }

    const push = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>) => {
        let arr = get(keyPath as any) as any
        arr.push(value)
        set(keyPath as any, arr)
    }

    const pop = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => {
        let arr = get(keyPath as any) as any
        arr.pop()
        set(keyPath as any, arr)
    }

    const reset = (data: Partial<T>): void => {
        setState(data)
    }

    const getState = (): Partial<T> => {
        return state
    }

    const getError = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>): string | undefined => {
        return errors[keyPath]
    }

    const setError = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, error: string | undefined) => {
        if (error === undefined) {
            let newErrors = { ...errors }
            delete newErrors[keyPath]
            setErrors(newErrors)
        } else {
            setErrors({ ...errors, [keyPath]: error })
        }
    }

    const getErrors = (): {[key: string]: string} => {
        return errors
    }

    const validate = async (): Promise<boolean> => {
        let final = {}
        for (let keyPath of Object.keys(validators)) {
            let validator = validators[keyPath]
            final = { ...final, ...await _validateWithValidator(keyPath, get(keyPath as any), validator) }
        }
        setErrors(final)

        return Object.keys(final).length === 0
    }

    const setValidator: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, validator: Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>) => void = (keyPath, validator) => {
        validators[keyPath as any] = validator as any
    }

    const validatePath: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => void = (keyPath) => {
        if (validators[keyPath]) {
            _validateWithValidator(keyPath, get(keyPath as any), validators[keyPath]).then(() => {})
        }
    }

    const setAndValidate: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => void = (keyPath, value) => {
        set(keyPath as any, value as any)
        if (validators[keyPath]) {
            _validateWithValidator(keyPath, value, validators[keyPath]).then(() => {})
        }
    }

    const _validateWithValidator = <T>(keyPath: string, value: T, validator: Validator<T>): Promise<{[key: string]: string}> => {
        return new Promise((resolve, _reject) => {
            let result = validator(value);
            if (typeof result === "string") {
                setError(keyPath as any, result)
                resolve({[keyPath]: result})
            } else if (result === false) {
                let result = `Value at '${keyPath}' is invalid.`
                setError(keyPath as any, result)
                resolve({[keyPath]: result})
            } else if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
                (result as any).then((result: any) => {
                    if (typeof result === "string") {
                        setError(keyPath as any, result)
                        resolve({[keyPath]: result})
                    } else if (result === false) {
                        let result = `Value at '${keyPath}' is invalid.`
                        setError(keyPath as any, result)
                        resolve({[keyPath]: result})
                    } else {
                        setError(keyPath as any, undefined)
                        resolve({})
                    }
                })
            } else {
                setError(keyPath as any, undefined)
                resolve({})
            }
        })
    }

    const bindInput = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, options?: {
        valueToString?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => string,
        stringToValue?: (value: string) => O.Path<Partial<T>, S.Split<KP, '.'>>,
        validate?: Validator<string>,
        validateOnTyping?: boolean,
    }): {
        value: string,
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    } => {
        if (options?.validate) {
            validators[keyPath] = options.validate
        }
        if (get(keyPath as any) === undefined) {
            set(keyPath as any, (options?.valueToString ?? ((v) => (v ? String(v) : '')))(undefined as any) as any)
        }
        return {
            value: (options?.valueToString ?? ((v) => (v ? String(v) : '')))(get(keyPath as any) as any),
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                let newValue = (options?.stringToValue ?? ((v) => v as unknown as any))(e.target.value)
                set(keyPath as any, newValue)
                if (options?.validateOnTyping && validators[keyPath]) {
                    _validateWithValidator(keyPath, newValue, validators[keyPath]).then(() => {})
                } else {
                    if (getError(keyPath as any) && validators[keyPath]) {
                        _validateWithValidator(keyPath, newValue, validators[keyPath]).then(() => {})
                    }
                }
            }
        }
    }

    const bindCheckbox = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, options?: {
        toBool?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => boolean,
        toValue?: (bool: boolean) => O.Path<Partial<T>, S.Split<KP, '.'>>,
    }): {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    } => {
        return {
            checked: (options?.toBool ?? ((v) => !!v))(get(keyPath as any) as any),
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                set(keyPath as any, (options?.toValue ?? ((v) => v as unknown as any))(e.target.checked))
            }
        }
    }

    const bindRadio = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>, options?: {
        validate?: Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>
    }): {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    } => {
        if (options?.validate) {
            validators[keyPath] = options.validate
        }
        return {
            checked: get(keyPath as any) === value as any,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                set(keyPath as any, value as any)
                if (getError(keyPath as any) && validators[keyPath]) {
                    _validateWithValidator(keyPath, value, validators[keyPath]).then(() => {})
                }
            }
        }
    }

    const bindCheckboxGroup = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>, options?: {
        validate? : Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>
    }): {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    } => {
        if (options?.validate) {
            validators[keyPath] = options.validate
        }
        return {
            checked: !!(get(keyPath as any) as unknown as any)?.includes(value),
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                let list = get(keyPath as any) as unknown as any
                if (list?.includes(value)) {
                    let newList = [...list]
                    newList.splice(list.indexOf(value), 1)
                    set(keyPath as any, newList as unknown as any)
                    if (getError(keyPath as any) && validators[keyPath]) {
                        _validateWithValidator(keyPath, newList, validators[keyPath]).then(() => {})
                    }
                } else {
                    let newList: any
                    if (list) {
                        newList = [...list]
                    } else {
                        newList = []
                    }
                    newList.push(value)
                    set(keyPath as any, newList as unknown as any)
                    if (getError(keyPath as any) && validators[keyPath]) {
                        _validateWithValidator(keyPath, newList, validators[keyPath]).then(() => {})
                    }
                }
            }
        }
    }

    const bindSelect = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>): {
        value: O.Path<Partial<T>, S.Split<KP, '.'>>,
        onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
    } => {
        return {
            value: get(keyPath as any) as any,
            onChange(e) {
                let option = e.target.selectedOptions[0]
                set(keyPath as any, option.value as any)
            }
        }
    }

    const bindOption = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>): {
        value: O.Path<Partial<T>, S.Split<KP, '.'>>,
    } => {
        return {
            value,
        }
    }

    const bindErrorMessage = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>): {
        hidden: boolean,
        children: ReactNode,
    } => {
        let errorMessage = getError(keyPath as any) as any
        return {
            hidden: !errorMessage,
            children: errorMessage
        }
    }

    return {
        get, set, push, pop,
        reset, getState, setError, setErrors, getError, getErrors, validate, setValidator, validatePath, setAndValidate,
        bindInput, bindCheckbox, bindRadio, bindCheckboxGroup, bindSelect, bindOption,
        bindErrorMessage,
    } as any
}

export default useTypedForm