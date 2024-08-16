declare const newproxy: (mt?: boolean) => object;

//the following types hold no value and are just to be clear on what kind of values a function expects

export type UInt = number;
export type Float = number;
export type Int = number;

type Indices<T extends readonly any[]> = Exclude<Partial<T>["size"], T["size"]>
