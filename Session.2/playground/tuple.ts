declare function foo(...args: [arg1: string, arg2: number]): void;

declare function bar(arg0: string, arg1: number): void;

foo("hello", 42);

// Expected 2 arguments, but got 3.
foo("hello", 42, true);

// Expected 2 arguments, but got 1.
foo("hello");
