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
  const product = PRODUCTS.find((product) => product.id === id)!;

  return <div>{product.name}</div>;
};
