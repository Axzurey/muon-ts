/// <reference types="@rbxts/testez/globals" />
import "@rbxts/testez"
import { ENode, EnumDefPair, EnumValue, FindVal, REnum, create_enum, match } from "../std/renum";
import { Option, Some } from "../std/handle/option";
import { Err, Result } from "../std/handle/result";

export = () => {
    it("should match enums properly", () => {
        class SomeEnum extends REnum {
            declare _typehint: {Hi: EnumDefPair<0, number>, Bye: EnumDefPair<1, string>, Boo: EnumDefPair<2, boolean>};

            public static Hi: EnumValue<0> = 0;
            public static Bye: EnumValue<1> = 1;
            public static Boo: EnumValue<2> = 2;
            
            _innervalue: number | string | boolean;
            _variant;

            constructor(variant: 0 | 1 | 2, inner: number | string | boolean) {
                super()
                this._variant = variant;
                this._innervalue = inner;
            }
            static create<T extends 0 | 1 | 2>(variant: T, value: InstanceType<typeof SomeEnum>['_typehint'][FindVal<InstanceType<typeof SomeEnum>['_typehint'], typeof variant>][1]) {
                return new this(variant, value);
            }
        }

        let value = SomeEnum.create(SomeEnum.Bye, "good night!");

        let res = match(value, {
            [SomeEnum.Hi]: (x) => 3,
            [SomeEnum.Bye]: (y) => "hello",
        }, (x) => 1);

        expect(res).to.equal("hello");

        expect(match(3, {
            [1]: (z) => {},
            [3]: (x) => 2,
        }, (v) => 3)).to.equal(2);

        expect(match("hello", {
            hi: (z) => {},
            //[3]: (x) => 2, should not work
        }, (v) => 3)).to.equal(3);
    });

    it("Should support automated enum creation", () => {
        let myclass = create_enum([
            ["A", ENode<String>],
            ["B", ENode<number>],
            ["C", ENode<boolean>]
        ] as const);

        //basic matching
        let variant = myclass.create(myclass.A, "hello!");

        expect(match(variant, {
            [myclass.A]: (x) => 1,
            [myclass.B]: (x) => 2,
            [myclass.C]: (x) => 2
        })).to.be.equal(1);

        //nested matching

        variant = myclass.create(myclass.B, 3);

        expect(match(variant, {
            [myclass.A]: () => 1,
            [myclass.B]: (x) => {
                return match(x, {
                    [1]: () => "ONE",
                    [3]: () => "THREE"
                }, (fallthrough) => "FALL")
            },
            [myclass.C]: () => 3
        })).to.be.equal("THREE");

        variant = myclass.create(myclass.B, 4);

        //nested matching w/fallthrough
        expect(match(variant, {
            [myclass.A]: () => 1,
            [myclass.B]: (x) => {
                return match(x, {
                    [1]: () => "ONE",
                    [3]: () => "THREE"
                }, (fallthrough) => "NEITHER")
            },
            [myclass.C]: () => 3
        })).to.be.equal("NEITHER");
    })

    it("Should work on results and options :)", () => {
        let option = Some(3);

        match(option, {
            [Option.Some]: (x) => "uno",
            [Option.None]: () => "None variant! (no parameter)"
        });

        let result = Err("IT's AN ERROR!") as Result<number, string>;

        match(result, {
            [Result.Ok]: (x) => {},
            [Result.Err]: (z) => {}
        })
    })
}