import React from "react";
// `const` assertions
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
// The `const` assertion allowed TypeScript to take the most specific type of the expression.

// Template Literal Types
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types

type VerticalAlignment = "top" | "middle" | "bottom";
type HorizontalAlignment = "left" | "center" | "right";

// Takes
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"

declare function setAlignment(
  value: `${VerticalAlignment}-${HorizontalAlignment}`
): void;

setAlignment("top-left"); // works!
setAlignment("top-middel"); // error!

// Indexed access types

interface ColorType {
  primary: "red";
  secondary: "blue";
  tertiary: "green";
}

// type ColorValue = "red" | "blue" | "green"
type ColorValue = ColorType[keyof ColorType];

const color = ["red", "blue", "green"] as const;
// type Color = "red" | "blue" | "green"
type Color = typeof color[number];

interface UserRoleConfig {
  user: ["read", "update"];
  superuser: ["read", "create", "update", "remove"];
}

// type Actions = "read" | "update" | "create" | "remove"
type Actions = UserRoleConfig[keyof UserRoleConfig][number];

// Create types from types
const Device = { laptop: "1TB", pad: "512G", mobile: "128G" } as const;
type DeviceType = typeof Device;
type DeviceKeys = keyof DeviceType;
type DeviceValues = DeviceType[DeviceKeys];

type IsDevice = {
  [K in `is${Capitalize<DeviceKeys>}`]: ReturnType<typeof isDevice>;
};

declare function isDevice(device: DeviceKeys): boolean;

const useDevice = (): IsDevice => {
  const isLaptop = isDevice("laptop");
  const isPad = isDevice("pad");
  const isMobile = isDevice("mobile");

  return { isLaptop, isPad, isMobile };
};

declare function useDeviceCapacity(): DeviceValues;

const { isLaptop } = useDevice();

const capacity = useDeviceCapacity();

// Type-safe for API service
interface User {
  name: string;
  age: number;
  gender: "F" | "M";
}

async function getUser() {
  const response = await fetch("");
  const user: User = await response.json();

  return user;
}

const user = await getUser();
interface UserCN extends User {
  cnOnly: string;
}

interface UserKR extends User {
  krOnly: string;
}

const userCN = await getUser<UserCN>();
const userKR = await getUser<UserKR>();

// Keyof Type Operator
// https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
type Point = { x: number; y: number };
type P = keyof Point;

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;

const arrayish1: Arrayish = { 0: "Foo", 1: "Bar" };
const arrayish2: Arrayish = ["Foo", "Bar"];

type ArrayishValue = Arrayish[number];

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html
// Key Remapping in Mapped Types
const refer = {
  keyof: "keyof operator",
  in: "in operator",
  as: "assertion",
  Capitalize: "transform",
  Exclude: "advanced types",
};
declare function handleRequest(url: string, method: "GET" | "POST"): void;
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);

const formatDate = (date: Date) =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} ${String(
    date.getSeconds()
  ).padStart(2, "0")}.${String(date.getMilliseconds()).padStart(3, "0")}`;

type PokemonData = {
  id: string;
  number: string;
  name: string;
  image: string;
  fetchedAt: string;
  attacks: {
    special: Array<{
      name: string;
      type: string;
      damage: number;
    }>;
  };
};

async function fetchPokemon(name: string): Promise<PokemonData> {
  const pokemonQuery = `
    query PokemonInfo($name: String) {
      pokemon(name: $name) {
        id
        number
        name
        image
        attacks {
          special {
            name
            type
            damage
          }
        }
      }
    }
  `;

  const response = await window.fetch("https://graphql-pokemon2.vercel.app/", {
    // learn more about this API here: https://graphql-pokemon2.vercel.app/
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      query: pokemonQuery,
      variables: { name: name.toLowerCase() },
    }),
  });

  type JSONResponse = {
    data?: {
      pokemon: Omit<PokemonData, "fetchedAt">;
    };
    errors?: Array<{ message: string }>;
  };
  const { data, errors }: JSONResponse = await response.json();
  if (response.ok) {
    const pokemon = data?.pokemon;
    if (pokemon) {
      // add fetchedAt helper (used in the UI to help differentiate requests)
      return Object.assign(pokemon, { fetchedAt: formatDate(new Date()) });
    } else {
      return Promise.reject(new Error(`No pokemon with the name "${name}"`));
    }
  } else {
    // handle the graphql errors
    const error = new Error(
      errors?.map((e) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
}

const fetchList = async <T,>() => {
  const response = await fetch("");
  const data: T = await response.json();

  return data;
};

const x = await fetchList<{ name: string }[]>();
x.map((item) => item.name);