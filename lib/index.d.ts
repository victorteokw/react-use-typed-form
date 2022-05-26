import { ChangeEvent, ReactNode } from "react";
import { O, F, S } from "ts-toolbelt";
declare type EleType<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never;
export declare type Validator<T> = (value: T) => string | undefined | boolean | null | Promise<string | undefined | boolean | null>;
declare function useTypedForm<T>(initial?: Partial<T>): {
    set: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => void;
    get: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => O.Path<Partial<T>, S.Split<KP, '.'>>;
    push: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>) => void;
    pop: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => void;
    reset: (data: Partial<T>) => void;
    getState: () => Partial<T>;
    setError: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: string | undefined) => void;
    setErrors: (errors: {
        [key: string]: string | undefined;
    }) => void;
    getError: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => string | undefined;
    getErrors: () => {
        [key: string]: string | undefined;
    };
    validate: () => Promise<boolean>;
    setValidator: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, validator: Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>) => void;
    validatePath: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => void;
    setAndValidate: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => void;
    bindInput: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, options?: {
        valueToString?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => string;
        stringToValue?: (value: string) => O.Path<Partial<T>, S.Split<KP, '.'>>;
        validate?: Validator<NonNullable<O.Path<Partial<T>, S.Split<KP, '.'>>>>;
        validateOnTyping?: boolean;
    }) => {
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    };
    bindCheckbox: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, options?: {
        toBool?: (value: O.Path<Partial<T>, S.Split<KP, '.'>>) => boolean;
        toValue?: (bool: boolean) => O.Path<Partial<T>, S.Split<KP, '.'>>;
    }) => {
        checked: boolean;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    };
    bindRadio: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>, options?: {
        validate?: Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>;
    }) => {
        checked: boolean;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    };
    bindCheckboxGroup: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: EleType<O.Path<Partial<T>, S.Split<KP, '.'>>>, options?: {
        validate?: Validator<O.Path<Partial<T>, S.Split<KP, '.'>>>;
    }) => {
        checked: boolean;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    };
    bindSelect: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => {
        value: O.Path<Partial<T>, S.Split<KP, '.'>>;
        onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    };
    bindOption: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>, value: O.Path<Partial<T>, S.Split<KP, '.'>>) => {
        value: O.Path<Partial<T>, S.Split<KP, '.'>>;
    };
    bindErrorMessage: <KP extends string>(keyPath: F.AutoPath<Partial<T>, KP>) => {
        hidden: boolean;
        children: ReactNode;
    };
};
export default useTypedForm;
