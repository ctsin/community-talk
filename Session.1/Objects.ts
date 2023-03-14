interface Optional {
  years: number;
  fulltime: boolean;
}
// interface UserProps {
//   name: string;
//   years?: number;
//   fulltime?: boolean;
// }
interface UserProps extends Partial<Optional> {
  name: string;
}

const user: UserProps = { name: "Chris" };
