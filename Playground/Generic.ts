interface User {
  name: string;
  age: number;
  gender: "F" | "M";
}

interface UserCN extends User {
  cnOnly: string;
}

interface UserKR extends User {
  krOnly: string;
}

export async function getUser<T>() {
  const response = await fetch("");
  const user: T = await response.json();

  return user;
}

const user = await getUser<UserCN>();
const userKR = await getUser<UserKR>();
user.cnOnly;
userKR.krOnly;
