import { None, Some, type Option } from "./Option";

export type Either<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
    readonly isRight = false;
    get right(): R { throw new Error('Invoking "right" on a Left'); }
    
    constructor(readonly left: L) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map<U>(_: (input: R) => U): Either<L, U> {
        return this as unknown as Left<L, U>;
    }

    mapLeft<U>(mapper: (input: L) => U): Either<U, R> {
        return new Left<U, R>(mapper(this.left));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flatMap<T, U>(_: (input: R) => Either<T, U>): Either<L, U> {
        return this as unknown as Either<L, U>;
    }

    flatMapLeft<T, U>(mapper: (input: L) => Either<T, U>): Either<T, U> {
        return mapper(this.left);
    }

    toOption(): Option<R> {
        return None.only;
    }
}

export class Right<L, R> {
    readonly isRight = true;
    get left(): L { throw new Error('Invoking "left" on a Right'); }

    constructor(readonly right: R) {}

    map<U>(mapper: (input: R) => U): Either<L, U> {
        return new Right<L, U>(mapper(this.right));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mapLeft<U>(_: (input: L) => U): Either<U, R> {
        return this as unknown as Right<U, R>;
    }

    flatMap<T, U>(mapper: (input: R) => Either<T, U>): Either<T, U> {
        return mapper(this.right);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flatMapLeft<T, U>(_: (input: L) => Either<T, U>): Either<T, R> {
        return this as unknown as Either<T, R>;
    }

    toOption(): Option<R> {
        return new Some(this.right);
    }
}