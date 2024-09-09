/// <reference types="@rbxts/testez/globals" />
import "@rbxts/testez"
import { EnumDefPair, EnumValue, FindVal, REnum, match } from "../std/renum";

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
}