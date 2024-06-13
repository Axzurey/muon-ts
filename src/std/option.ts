export class Option<T> {
    private inner?: T;
    constructor(value: T | undefined) {
        this.inner = value;
    }

    public unwrap(): T {
        if (this.inner === undefined) {
            
        }
    }
}

export function Some<T>(value: T): Option<T> {
    return new Option(value);
}

export function None(): Option<any> {
    return new Option(undefined);
}

function testfn(value: Option<number>) {}

let test0 = None();
//above can be used the same as
let _test0: Option<number> = None();
let test1 = Some(3);
let test2 = Some("Hello!");

testfn(test0);
testfn(test1);
testfn(test2);