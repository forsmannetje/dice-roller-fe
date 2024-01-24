import { type Either, Left, Right } from "./Either";

export abstract class Option<T> {
    static from<T>(value?: T): Option<T> {
        if (value !== undefined && value !== null) return new Some(value);
        else return None.only;
    }

    static when<T>(condition: boolean, resolver: () => T): Option<T> {
        if (condition) return new Some(resolver());
        else return None.only;
    }

    static unless<T>(condition: boolean, resolver: () => T): Option<T> {
        if (condition) return None.only;
        else return new Some(resolver());
    }

    abstract isDefined: boolean;

    abstract get(): T;
    abstract orElseGet<U>(resolver: () => U): T | U;
    abstract orElse<U>(resolver: () => Option<U>): Option<T> | Option<U>;
    
    abstract map<U>(mapper: (input: T) => U): Option<U>;
    abstract filter(predicate: (input: T) => boolean): Option<T>;

    abstract flatMap<U>(mapper: (input: T) => Option<U>): Option<U>;
    
    abstract toEither<L>(left: () => L): Either<L, T>;
}

export class None<T> implements Option<T> {
    static only = new None<any>();

    readonly isDefined = false;

    private constructor() {}

    get(): T {
        throw new Error('Attempting to "get" on a None');
    }

    orElseGet<U>(resolver: () => U): U {
        return resolver();
    }

    orElse<U>(resolver: () => Option<U>): Option<U> {
        return resolver();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map<U>(_: (_: never) => unknown): Option<U> {
        return this as unknown as Option<U>;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter(_: (_: never) => unknown): Option<T> {
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flatMap<U>(_: (_: never) => unknown): Option<U> {
        return this as unknown as Option<U>;
    }

    toEither<L>(left: () => L): Left<L, T> {
        return new Left<L, T>(left());
    }
}

export class Some<T> implements Option<T> {
    readonly value: T
    readonly isDefined = true;

    constructor(value: T) {
        this.value = value;
    }

    get(): T {
        return this.value;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orElseGet(_: () => unknown): T {
        return this.value;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    orElse(_: () => unknown): Option<T> {
        return this;
    }

    map<U>(mapper: (input: T) => U): Option<U> {
        return new Some(mapper(this.value));
    }

    filter(predicate: (input: T) => boolean): Option<T> {
        if (predicate(this.value)) return this;
        else return None.only;
    }

    flatMap<U>(mapper: (input: T) => Option<U>): Option<U> {
        return mapper(this.value);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toEither<L>(_: () => unknown): Right<L, T> {
        return new Right<L, T>(this.value);
    }
}