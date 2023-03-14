# Satisfies

https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/#the-satisfies-operator

```ts
type Name = Record<string, number | string>;

const n1: Name = {
  foo: 19,
};

// string | number 🤔
n1.foo;

const n2 = {
  foo: 19,
} satisfies Name;

// number 💯
n2.foo;
```

# Object literal may only specify known properties

https://stackoverflow.com/questions/61698807/interesting-behaviour-object-literal-may-only-specify-known-properties

```ts
type PersonFoo = { name: string };

// Error: Object literal may only specify known properties, and 'age' does not exist in type 'Person'.
const personFoo: PersonFoo = { name: "Sarah", age: 13 };
```

So this fails, because property age is not a part of type Person which makes sense.

However, I can do this without any problems:

```ts
type PersonBar = { name: string };

const bar = { name: "Sarah", age: 13 };

// { name: 'Sarah', age: 13 }
const personBar: PersonBar = bar;
```

Excess Property Checks in https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks :

Object literals get special treatment and undergo excess property checking when assigning them to other variables, or passing them as arguments. If an object literal has any properties that the “target type” doesn’t have, you’ll get an error.

> TL;DR: when initializing with a literal the TSC is strict.

# Indexed Access Type

https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html

```ts
interface UserRoleConfig {
  user: ["read", "update"];
  superuser: ["read", "create", "update", "remove"];
}

// type Actions = "read" | "update" | "create" | "remove"
type Actions = UserRoleConfig[keyof UserRoleConfig][number];
```

# Deriving types from an array of object

```ts
const duration = [
  {
    label: "Foo",
    value: 1,
  },
  {
    label: "Bar",
    value: 3,
  },
] as const;

// 1 | 3
type DurationValue = typeof duration[number]["value"];
```

# Use TypeScript's `never` to enforce "one or the other" properties on a type

```ts
type Course = {
  name: string;
  url?: string;
  price?: number;
};

export const course: Course = {
  name: "Hello World",
  price: 5,
  url: "",
};
```

```ts
type Base = {
  name: string;
};

interface Free extends Base {
  url: string;
  price?: never;
}

interface Paid extends Base {
  url?: never;
  price: number;
}

type Course = Free | Paid;

// Type 'string' is not assignable to type 'undefined'.
export const course: Course = {
  name: "Hello World",
  price: 5,
  url: "",
};
```

# Custom Hooks with `as`

```ts
import { useState } from "react";

const useHome = () => {
  const [state, setState] = useState(0);

  return [state, setState] as const; // 🚀
};

export const Home = () => {
  const [home, setHome] = useHome();

  setHome(9);

  return { home };
};
```

```ts
export const req = { url: "https://example.com", method: "GET" } as const;
```

```ts
export const fruit = ["Apple", "Pear", "Banana"] as const;
```
