# satisfies

https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb

https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/#the-satisfies-operator

One of TypeScript's strengths is how it can infer the type of an expression from context. For example, you can declare a variable without a type annotation, and its type will be inferred from the value you assign to it. This is especially useful when the exact type of a value is complex, and explicitly annotating the type would require a lot of duplicate code.

Consider some code that defines subscription pricing tiers and turns them into strings using the toFixed method on Number:

```js
type Plan = "personal" | "team" | "enterprise";
type Pricing = number | ((users: number) => number);

const plans = {
  personal: 10,
  team: (users) => users * 5,
  enterprie: (users) => users * 20,
};
```

If we use an explicit type annotation on plans, we can catch the typo earlier, as well as infer the type of the users arguments. However, we might run into a different problem.

```js
type Plan = "personal" | "team" | "enterprise";
type Pricing = number | ((users: number) => number);

const plans: Record<Plan, Pricing> = {
  personal: 10,
  team: (users) => users * 5,
  enterprie: (users) => users * 20,
};
```

```js
const pricingA = plans.personal.toFixed(2);
const pricingB = plans.team(10).toFixed(2);
```

When we use an explicit type annotation, the type gets "widened", and TypeScript can no longer tell which of our plans have flat pricing and which have per-user pricing. Effectively, we have "lost" some information about our types.

What we really need is a way to assert that a value is compatible with some reusable type, while letting TypeScript infer a more specific type.

The new `satisfies` operator gives the benefits, with no runtime impact, and automatically checks for excess /ɪkˈses, ˈekses/ or misspelled properties.

```js
type Plan = "personal" | "team" | "enterprise";
type Pricing = number | ((users: number) => number);
```

```js
const plans = {
  personal: 10,
  team: (users) => users * 5,
  enterprie: (users) => users * 20,
} satisfies Record<Plan, Pricing>;

const pricingA = plans.personal.toFixed(2);
const pricingB = plans.team(10).toFixed(2);
```

Now we catch the typo right at the source, but we don't "lose" any information to type.

Let's go ahead to cover some real situations where you might use `satisfies` in your Prisma application.

Prisma is an ORM in NodeJS with TypeScript support. We use it to communicate with DB.

```js
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const postCreate = {};

const createPost = async () => {
  const postCreated = await prisma.post.create({
    data: postCreate,
  });
  console.log("🚀 ~ postCreated:", postCreated);
};

createPost();
```

One of the most common use cases for the `satisfies` operator with Prisma is to infer the type of a specific query method like a creation — including only the selected fields of a model and its relations.

```js
const postCreate = {
} satisfies Prisma.PostCreateInput;
```

```js
const postCreate = {
  title: "Title Baz",
  body: "It is a long established fact.",
  author: {
    connect: {
      id: "653612b54a44aeb6a7ea066b",
    },
  },
} satisfies Prisma.PostCreateInput;
```

```sh
npx ts-node --esm satisfies.ts
```

```js
const getPosts = async () => {
  const postSelect = {};

  const posts = await prisma.post.findMany({
    select: postSelect,
  });

  console.log("🚀 ~ posts:", posts);
};

getPosts();
```

```js
const postSelect = {
  title: true,
  createdAt: true,
  author: {
    select: {
      name: true,
      email: true,
    },
  },
} satisfies Prisma.PostSelect;
```

```js
const getPosts = async () => {
  const postSelect = {
    title: true,
    createdAt: true,
    author: {
      select: {
        name: true,
        email: true,
      },
    },
  } satisfies Prisma.PostSelect;

  const posts = await prisma.post.findMany({
    select: postSelect,
  });

  console.log("🚀 ~ posts:", posts);
};

getPosts();
```

We can also get the output shape of the other Prisma methods.

```js
const countSelect = {
  _all: true,
  name: true,
} satisfies Prisma.AuthorCountAggregateInputType;

const groupByArgs = {
  by: ["name"],
} satisfies Prisma.AuthorGroupByArgs;
```

# excess property checks

> Object literal may only specify known properties

https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks

https://stackoverflow.com/questions/61698807/interesting-behaviour-object-literal-may-only-specify-known-properties

Where and how an object is assigned a type can make a difference in the type system. One of the key examples of this is in excess property checking, which validates the object when it is created and assigned to an object type during creation.

```ts
interface Person {
  name: string;
}

const personFoo: Person = { name: "Sarah", age: 13 };
```

The error indicate that 'age' does not exist in type 'Person'

You could argue that this program is correctly typed, since the `name` properties are compatible, and the extra `age` property is insignificant.

However, TypeScript takes the stance that there’s probably a bug in this code. Object literals get special treatment and undergo excess property checking when assigning them to other variables, or passing them as arguments. If an object literal has any properties that the “target type” doesn’t have, you’ll get an error.

Getting around these checks is actually really simple. The easiest method is to just use a type assertion:

```js
const person: Person = { name: "Sarah", age: 13 } as Person;
```

One final way to get around these checks, which might be a bit surprising, is to assign the object to another variable: Since assigning another variable won’t undergo excess property checks, the compiler won’t give you an error:

```js
const response = { name: "Sarah", age: 13 };
const person: Person = response;
```

Keep in mind that for the code like above, you probably shouldn’t be trying to “get around” these checks. A majority of excess property errors are actually bugs.

That means if you’re running into excess property checking problems for something like option bags, you might need to revise some of your type declarations, fix up the definition of `Person` to reflect that.

# Discriminated union

https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions

A Discriminated Union is created between two or more types. Each type within the union is associated with a unique property called a discriminant, which can be used to determine which specific variant of the union is being referred to.

For some motivation, let’s imagine we’re trying to encode modal component, and use a field called `type` to tell which kind of modal we’re dealing with. Here’s a first attempt at defining interface.

```js
interface Props {
  type: "alert" | "confirm";
  confirmButtonMassage?: string;
}
```

Notice we’re using a union of string literal types: `alert` and `confirm` to tell us whether we should treat the modal as a alert modal or confirm modal respectively. By using `alert` | `confirm` instead of string, we can avoid misspelling issues.

```js
function Modal(props: Props) {
  const message = props.confirmButtonMassage.toUpperCase();

  return null;
}
```

We can write a modal component that applies the right logic based on if it’s dealing with a `alert` or `confirm`.

Under `strictNullChecks` that gives us an error - which is appropriate since `confirmButtonMassage` might not be defined. We’ve hit a point where we know more about our values than the type checker does. We could try to use a non-null assertion (a ! after shape.radius) to say that `confirmButtonMassage` is definitely present.

But this doesn’t feel ideal. Outside of `strictNullChecks` we’re able to accidentally access any of those fields anyway. We can definitely do better.

The problem with this encoding of modal is that the type-checker doesn’t have any way to know whether or not `confirmButtonMassage` is present based on the `type` property. We need to communicate what we know to the type checker. With that in mind, let’s take another way at defining types.

```js
interface Alert {
  type: "alert";
}

interface Confirm {
  type: "confirm";
  confirmButtonMassage: string;
}

type Props = Alert | Confirm;
```

Here, we’ve properly separated `Props` out into two types with different values for the `type` property, but `confirmButtonMassage` is declared as required properties in their respective types.

Let’s see what happens here when we try to access the `confirmButtonMassage`.

The important thing here was the encoding of `Props` types. Communicating the right information to TypeScript - that `Alert` and `Confirm` were really two separate types with specific `type` fields. From there, the type system was able to do the “right” thing and figure out the types in `if` statement.

Discriminated unions are useful for more than just talking about message type. They’re good for representing any sort of messaging scheme in JavaScript, like when sending messages over the network (client/server communication), or encoding mutations in a state management framework.

At the end of this talk, we will have a complex example to cover it again.

# Use TypeScript's `never` to enforce "one or the other" properties on a type

We have a type `Course` defined with three properties: `name`, `url`, and `price`.

For free courses, users can download directly through the `url` attribute, and the `price` should not be available at this time. Conversely, paid courses should have a price attribute but no url.

```ts
type Course = {
  name: string;
  url?: string;
  price?: number;
};
```

```js
export const course: Course = {
  name: "Hello World",
  price: 5,
  url: "",
};
```

Finally, we redefine our earlier declared type `Course` as either `Free` or `Paid`. Now `Course` can represent either free courses or paid courses based on their respective interfaces.

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
```

```js
export const course: Course = {
  name: "Hello World",
  price: 5,
  url: "",
};
```

In short, Use `never` in positions where there will not or should not be a value

# Generic Components

> [TypeScript playground](https://www.typescriptlang.org/play)

> https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#generic-components

```js
import React from "react";

type TableProps<T> = {
  data: T[],
  onRowClick(row: T): void,
};

declare function Table<T>(props: TableProps<T>): null;
```

```js
export default () => (
  <Table
    data={[{ name: "Foo" }]}
    onRowClick={(row) => {
      void row.name; // 🚀
    }}
  />
);
```

Now, let's go a step further and try to implement the Table component.

```js
function Table<T>({ data, onRowClick }: TableProps<T>) {
  return (
    <table>
      {data.map((row) => (
        <tr key={row.name}>
          <td onClick={() => onRowClick(row)}>{row.name}</td>
        </tr>
      ))}
    </table>
  );
}
```

TypeScript raised an error indicating that "Property 'name' does not exist on type 'T'."

This is because we passed in the generic parameter T, but TypeScript cannot determine that T will contain the `name` property.

The `extends` statement is used in the context of function generic types to specify constraints on the type parameter.

When a function has a generic type defined using <T extends TypeFooBar>, it means that the type T can be any subtype (or same type) of TypeFooBar. This constraint ensures that only certain types are assignable to the generic parameter when invoking or implementing the function.

```js
function Table<T extends {name: string}>({ data, onRowClick }: TableProps<T>) {
  return (
    <table>
      {data.map((row) => (
        <tr key={row.name}>
          <td onClick={() => onRowClick(row)}>{row.name}</td>
        </tr>
      ))}
    </table>
  );
}
```

# Labeled Tuple Elements

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#labeled-tuple-elements

Improving the experience around tuple types and parameter lists is important because it allows us to get strongly typed validation around common JavaScript.

For example, the following function that uses a tuple type as a rest parameter…

```js
declare function foo(...args: [string, number]): void;
```

…should appear no different from the following function…

```js
declare function bar(arg0: string, arg1: number): void;
```

…for any caller of foo.

```js
foo("hello", 42);

// Expected 2 arguments, but got 3.
foo("hello", 42, true);

// Expected 2 arguments, but got 1.
foo("hello");
```

There is one place where the differences begin to become observable: readability. In the first example, we have no parameter names for the first and second elements. While these have no impact on type-checking, the lack of labels on tuple positions can make them harder to use - harder to communicate our intent.

That’s why in TypeScript 4.0, tuples types can now provide labels.

```js
type Range = [start: number, end: number];
```

To deepen the connection between parameter lists and tuple types, the syntax for rest elements and optional elements mirrors the syntax for parameter lists.

```js
type Foo = [first: number, second?: string, ...rest: any[]];
```

So the first example can be rewritten as:

```js
declare function foo(...args: [arg1: string, arg2: number]): void;
```

Overall, labeled tuples are handy when taking advantage of patterns around tuples and argument lists

# Dynamic function arguments with Generic

Great, let's summarize the knowledge we discussed earlier and use them to complete the following example.

https://www.youtube.com/watch?v=YE_3WwX-Dl8

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html#leadingmiddle-rest-elements-in-tuple-types

```js
type Evt =
  | {
      type: "SIGN_IN",
      payload: {
        userID: string,
      },
    }
  | { type: "SIGN_OUT" };

declare function sendEvent(eventType: any, payload?: any): void;

// Correct
sendEvent("SIGN_OUT");
sendEvent("SIGN_IN", { userID: "123" });

// Should Error
sendEvent("SIGN_OUT", {});
sendEvent("SIGN_IN", { userID: 123 });
sendEvent("SIGN_IN", {});
sendEvent("SIGN_IN");
```

```js
type EvtType = Evt["type"];
// type EvtType = "SIGN_IN" | "SIGN_OUT"
```

```js
// type SignInArgs = {
//   type: "SIGN_IN";
//   payload: {
//     userID: string;
//   };
// }
type SignInArgs = Extract<Evt, { type: "SIGN_IN" }>;
```

```js
// type SignOutArgs = { type: "SIGN_OUT" }
type SignOutArgs = Extract<Evt, { type: "SIGN_OUT" }>;
```

```js
type Evt =
  | {
    type: "SIGN_IN";
    payload: {
      userID: string;
    };
  }
  | { type: "SIGN_OUT" };

// type EvtType = "SIGN_IN" | "SIGN_OUT"
type EvtType = Evt["type"]
// type SignInArgs = {
//   type: "SIGN_IN";
//   payload: {
//     userID: string;
//   };
// }
type SignInArgs = Extract<Evt, { type: "SIGN_IN" }>
// type SignOutArgs = { type: "SIGN_OUT" }
type SignOutArgs = Extract<Evt, { type: "SIGN_OUT" }>

declare function sendEvent<T extends EvtType>(...args: Extract<Evt, { type: T }> extends { payload: infer Payload } ? [type: T, payload: Payload] : [type: T]): void
// declare function sendEvent<T extends Evt["type"]>(
//   ...args: Extract<Evt, { type: T }> extends { payload: infer Payload }
//     ? [type: T, payload: Payload]
//     : [type: T]
// ): void;

// Correct
sendEvent("SIGN_OUT");
sendEvent("SIGN_IN", { userID: "123" });

// Should Error
sendEvent("SIGN_OUT", {});
sendEvent("SIGN_IN", { userID: 123 });
sendEvent("SIGN_IN", {});
sendEvent("SIGN_IN");
```
