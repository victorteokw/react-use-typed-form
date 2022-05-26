import { ChangeEvent, useState } from "react"
import { O, F, A, S } from "ts-toolbelt"

type EleType<ArrType> = ArrType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

function useTypedForm<T>(initial?: Partial<T>): {
    set: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => void,
    get: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => O.Path<Partial<T>, S.Split<KP, '.'>>,
    push: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>) => void, // todo: KP array only
    pop: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => void, // todo: KP array only
    reset: (data: Partial<T>) => void,
    getState: () => Partial<T>,
    bindInput: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, to_string?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => string, to_value?: (value: string) => O.Path<Partial<T>, S.Split<KP, '.'>>) => {
        value: string,
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    },
    bindCheckbox: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, to_bool?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => boolean, to_value?: (bool: boolean) => O.Path<Partial<T>, S.Split<KP, '.'>>) => {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    },
    bindRadio: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    },
    bindCheckboxGroup: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>) => {
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
} {

    let [state, setState] = useState<Partial<T>>(initial ?? {})

    const _get = (keyPath: string, state: any): any => {
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

    const bindInput = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, to_string?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => string, to_value?: (value: string) => O.Path<Partial<T>, S.Split<KP, '.'>>): {
        value: string,
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    } => {
        return {
            value: (to_string ?? ((v) => (v ? String(v) : '')))(get(keyPath as any) as any),
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                set(keyPath as any, (to_value ?? ((v) => v as unknown as any))(e.target.value))
            }
        }
    }

    const bindCheckbox = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, to_bool?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => boolean, to_value?: (bool: boolean) => O.Path<Partial<T>, S.Split<KP, '.'>>): {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    } => {
        return {
            checked: (to_bool ?? ((v) => !!v))(get(keyPath as any) as any),
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                set(keyPath as any, (to_value ?? ((v) => v as unknown as any))(e.target.checked))
            }
        }
    }

    const bindRadio = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>): {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    } => {
        return {
            checked: get(keyPath as any) === value as any,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                set(keyPath as any, value as any)
            }
        }
    }

    const bindCheckboxGroup = <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>): {
        checked: boolean,
        onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    } => {
        return {
            checked: !!(get(keyPath as any) as unknown as any)?.includes(value),
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                let list = get(keyPath as any) as unknown as any
                if (list?.includes(value)) {
                    let newList = [...list]
                    newList.splice(list.indexOf(value), 1)
                    set(keyPath as any, newList as unknown as any)
                } else {
                    let newList: any
                    if (list) {
                        newList = [...list]
                    } else {
                        newList = []
                    }
                    newList.push(value)
                    set(keyPath as any, newList as unknown as any)
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

    return { get, set, push, pop, reset, getState, bindInput, bindCheckbox, bindRadio, bindCheckboxGroup, bindSelect, bindOption } as any
}

export default useTypedForm