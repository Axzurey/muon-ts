declare const newproxy: (mt?: boolean) => object;

//the following types hold no value and are just to be clear on what kind of values a function expects

export type UInt = number;
export type Float = number;
export type Int = number;

type ParseInt<T> = T extends `${infer N extends number}` ? N : never;

/**
 * Useful for making vscode expand types. graciously stolen from stackoverflow
 */
type NOOP<T> = T extends (...args: any[]) => any ? T : T extends (abstract new (...args: any[]) => any) ? T : {[K in keyof T]: T[K]}

type IndicesOfArray<T extends readonly any[]> = ParseInt<keyof ExcludeMembers<{[k in keyof T]: k extends `${infer N extends number}` ? N : never}, never>>