# The Primitives

```ts
let hello: string = "Hello, world";
let age: number = 42;
let checked: boolean = true;
```

JavaScript has three very commonly used primitives: string, number, and boolean. Each has a corresponding type in TypeScript. As you might expect, these are the same names you’d see if you used the JavaScript `typeof` operator on a value of those types:

- string represents string values like "Hello, world".
- number is for numbers like 42.
- boolean is for the two values `true` and `false`.

When you initialize a variable, TypeScript will try to refer the type from the value.

```ts
let hello = "Hello, world";
let age = 42;
let checked = true;
```

But things will change if we declare variables with `as const` operator. It's about **literal inference**. We'll discuss it later.

```ts
let hello = "Hello, world" as const;
let age = 42 as const;
let checked = true as const;
```

```ts
const HELLO = "Hello, world";
const AGE = 42;
const CHECKED = true;
```

# Arrays

```ts
const frameworks: string[] = ["React", "Vue", "Solid"];
const ranges: number[] = [1, 10, 100];
```

```ts
const frameworksGeneric: Array<string> = ["React", "Vue", "Solid"];
const rangesGeneric: Array<number> = [1, 10, 100];
```

To specify the type of an array like `frameworks`, you can use the syntax `string[]`; this syntax works for any type (e.g. `number[]` is an array of numbers, and so on). You may also see this written as `Array<number>`, which means the same thing. We’ll learn more about the syntax `T<U>` when we cover generics.

# Objects

```ts
interface UserProps {
  name: string;
  years: number;
  fulltime: boolean;
}

const user: UserProps = { name: "Chris", years: 4, fulltime: true };
```

Apart from primitives, the most common sort of type you’ll encounter is an object type. This refers to any JavaScript value with properties, which is almost all of them! To define an object type, we simply list its properties and their types.

# Optional Properties

Object types can also specify that some or all of their properties are optional. To do this, add a `?` after the property name:

```ts
interface UserProps {
  name: string;
  years: number;
  fulltime: boolean;
}

const user: UserProps = {};
```

**With Partial**

```ts
interface Optional {
  years: number;
  fulltime: boolean;
}
```

```ts
// interface UserProps {
//   name: string;
//   years?: number;
//   fulltime?: boolean;
// }
```

```ts
interface UserProps extends Partial<Optional> {
  name: string;
}

const user: UserProps = { name: "Chris" };
```

In JavaScript, if you access a property that doesn’t exist, you’ll get the value `undefined` rather than a runtime error. Because of this, when you read from an optional property, you’ll have to check for `undefined` before using it.

# Functions

```ts
function greetFoo(name: string): string {
  return name;
}

const greetBar = (name: string): string => name;
```

Functions are the primary means of passing data around in JavaScript. TypeScript allows you to specify the types of both the input and output values of functions.

```ts
function greetFoo(name: string) {
  return name;
}

const greetBar = (name: string) => name;
```

Much like variable type annotations, you usually don’t need a return type annotation because TypeScript will infer the function’s return type based on its `return` statements. The type annotation in the above example doesn’t change anything.

# Union Types

TypeScript’s type system allows you to build new types out of existing ones using a large variety of operators. Now that we know how to write a few types, it’s time to start _combining_ them in interesting ways.

The first way to combine types you might see is a _union_ type. A union type is a type formed from two or more other types, representing values that may be _any one_ of those types. We refer to each of these types as the union’s _members_.

Let’s write a function that can operate on strings or numbers:

```ts
function printId(id: number | string): void {
  console.log("Your ID is: " + id);
}
```

```ts
// OK
printId(101);

// OK
printId("202");

// Error
printId({ myID: 22342 });
```

# Type Aliases

We’ve been using object types and union types by writing them directly in type annotations. This is convenient, but it’s common to want to use the same type more than once and refer to it by a single name.

You can actually use a type alias to give a name to any type at all. For example, a type alias can name a union type:

```ts
export type ID = number | string;

function printId(id: ID) {
  console.log("Your ID is: " + id);
}
```

# Literal Types

In addition to the general types `string` and `number`, we can refer to _specific_ strings and numbers in type positions.

One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both `var` and `let` allow for changing what is held inside the variable, and `const` does not. This is reflected in how TypeScript creates types for literals.

```ts
let changingString = "Hello World";
changingString = "Olá Mundo";
```

Because `changingString` can represent any possible string, that is how TypeScript describes it in the type system.

```ts
const constantString = "Hello World";
```

Because `constantString` can only represent 1 possible string, it has a literal type representation.

By themselves, literal types aren’t very valuable. But by _combining_ literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:

```ts
declare function printText(s: string, alignment: "left" | "right"): void;
```

Numeric literal types work the same way:

```ts
declare function printLevel(level: 0 | 1 | 2): void;
```

# Template Literal Types

Template literal types build on string literal types, and have the ability to expand into many strings via unions.

They have the same syntax as template literal strings in JavaScript, but are used in type positions. When used with concrete literal types, a template literal produces a new string literal type by concatenating the contents.

```ts
type World = "world";
```

```ts
type Greeting = `hello ${World}`;
```

When a union is used in the interpolated position, the type is the set of every possible string literal that could be represented by each union member:

```ts
type VerticalAlignment = "top" | "middle" | "bottom";
type HorizontalAlignment = "left" | "center" | "right";
```

```ts
type Alignment = `${VerticalAlignment}-${HorizontalAlignment}`;
```

```ts
// Takes
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"
```

```ts
declare function setAlignment(value: Alignment): void;
```

```ts
setAlignment("top-left"); // works!
setAlignment("top-middel"); // error!
```

# Literal Inference

When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later. For example, if you wrote code like this:

```ts
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
```

Before talking about the solution of current issue, let's recap our discussion about primitive types.

```ts
let changingString = "Hello World" as const;

const constantString = "Hello World";
```

The `as const` suffix acts like `const` but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like `string` or `number`.

In the above example `req.method` is inferred to be `string`, not `"GET"`. Because code can be evaluated between the creation of `req` and the call of `handleRequest` which could assign a new string like `"GUESS"` to `req.method`, TypeScript considers this code to have an error.

There are two ways to work around this.

1: You can change the inference by adding a type assertion in either location:

```ts
// Change 1:
const req = { url: "https://example.com", method: "GET" as "GET" };
// Change 2
handleRequest(req.url, req.method as "GET");
```

Change 1 means “I intend for `req.method` to always have the _literal type_ `"GET"`”, preventing the possible assignment of `"GUESS"` to that field after.

Change 2 means “I know for other reasons that `req.method` has the value `"GET"`“.

2: You can use `as const` to convert the entire object to be type literals:

```ts
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

# Generics

A major part of software engineering is building components that not only have well-defined and consistent APIs, but are also reusable. Components that are capable of working on the data of today as well as the data of tomorrow will give you the most flexible capabilities for building up large software systems.

In languages like C# and Java, one of the main tools in the toolbox for creating reusable components is generics, that is, being able to create a component that can work over a variety of types rather than a single one. This allows users to consume these components and use their own types.

```ts
interface User {
  name: string;
  age: number;
  gender: "F" | "M";
}

export async function getUser() {
  const response = await fetch("");
  const user: User = await response.json();

  return user;
}

const user = await getUser();
```

```ts
interface UserCN extends User {
  cnOnly: string;
}

interface UserKR extends User {
  krOnly: string;
}
```

```ts
const userCN = await getUser<UserCN>();
const userKR = await getUser<UserKR>();
```

# Type Assertions

Sometimes you will have information about the type of a value that TypeScript can’t know about.

For example, if you’re using document.getElementById, TypeScript only knows that this will return some kind of HTMLElement, but you might know that your page will always have an HTMLCanvasElement with a given ID.

In this situation, you can use a type assertion to specify a more specific type:

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Like a type annotation, type assertions are removed by the compiler and won’t affect the runtime behavior of your code.

You can also use the angle-bracket syntax (except if the code is in `a .tsx` file), which is equivalent:

```ts
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

# Non-null Assertion Operator (Postfix `!`)

TypeScript also has a special syntax for removing `null` and `undefined` from a type without doing any explicit checking. Writing `!` after any expression is effectively a type assertion that the value isn’t `null` or `undefined`:

```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

A usage in real life:

```ts
const PRODUCTS = [
  { name: "Foo", id: "foo" },
  { name: "Bar", id: "bar" },
];

// <ProductList />
const ProductList = () => {
  const onClick = (id: string) => `Access to product page with ${id}`;

  return PRODUCTS.map(({ name, id }) => (
    <div onClick={() => onClick(id)}>{name}</div>
  ));
};

// <ProductDetails />
const ProductDetails = ({ id }) => {
  const product = PRODUCTS.find((product) => product.id === id);

  return <div>{product.name}</div>;
};
```

```ts
const element = document.getElementById("root");

element.innerHTML = "! non-null assertion";
```

Just like other type assertions, this doesn’t change the runtime behavior of your code, so it’s important to only use `!` when you know that the value _can’t_ be `null` or `undefined`.

# In Action

```ts
const DEVICE = { laptop: "1TB", pad: "512G", mobile: "128G" } as const;
```

```ts
/**
 * type DeviceType = {
    readonly laptop: "1TB";
    readonly pad: "512G";
    readonly mobile: "128G";
}
 */
```

```ts
type DeviceType = typeof DEVICE;
```

```ts
/**
 * type DeviceKeys = "laptop" | "pad" | "mobile"
 */
```

```ts
type DeviceKeys = keyof DeviceType;
```

```ts
/**
 * type DeviceValues = "1TB" | "512G" | "128G"
 */
```

```ts
type DeviceValues = DeviceType[DeviceKeys];
```

```ts
type Storages = typeof DEVICE[keyof typeof DEVICE];
```

> const useDevice = (): UseDevice => {}

```ts
const useDevice = () => {
  const isLaptop = isDevice("laptop");
  const isPad = isDevice("pad");
  const isMobile = isDevice("mobile");

  return { isLaptop, isPad, isMobile };
};
```

> isDevice("laptop"): boolean
> declare function isDevice(device: DeviceKeys): boolean;

```ts
declare function isDevice(device);
```

```ts
/**
 * type UseDevice = {
    isLaptop: boolean;
    isPad: boolean;
    isMobile: boolean;
}
 */
```

> type UseDevice = {}

```ts
type UseDevice = {
  [K in `is${Capitalize<DeviceKeys>}`]: ReturnType<typeof isDevice>;
};
```

```ts
const { isLaptop } = useDevice();
```

> declare function useDeviceStorage(): Storages;

```ts
declare function useDeviceStorage(): Storages;
```

```ts
const storage = useDeviceStorage();
const foo: typeof storage = "128G";
```

# React Hooks

```ts
interface Product {
  label: string;
  description: string;
  uuid: string;
  price: number;
}
type Products = Product[];
```

```ts
interface OrderContextProps {
  orders: Products;
  addOrder(order: Product): void;
  removeOrder(orderID: Product["uuid"]): void;
}
```

> const OrderContext = createContext<OrderContextProps>(null!);

```ts
const OrderContext = createContext();
```

```ts
const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Products>([]);

  const addOrder = (order: Product) => {
    setOrders((prev) => [...prev, order]);
  };

  const removeOrder = (uuid: Product["uuid"]) => {
    setOrders((prev) => prev.filter((order) => order.uuid !== uuid));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, removeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
```

```ts
const useOrderContext = () => {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("Global ContextAPI should be used inside a Provider.");
  }

  return context;
};
```

```ts
const useOrder = () => {
  const { orders, addOrder, removeOrder } = useOrderContext();

  return { orders, addOrder, removeOrder };
};
```

```ts
const OrderList = () => {
  const { orders } = useOrder();

  return (
    <>
      {orders.map(({ label, uuid }) => (
        <li key={uuid}>{label}</li>
      ))}
    </>
  );
};
```
