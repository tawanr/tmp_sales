import pb from "../utils/pocketbase";

export interface Product {
  id: string;
  label: string;
  price: number;
  image: string;
  kg: number;
  unit: string;
  lotNumber: string;
}

export async function getProducts(
  search: string = "",
  page: number = 1,
  sort: string = "label"
): Promise<Product[]> {
  let filter = "is_active = true";
  if (search) {
    filter += ` && label ~ '${search}'`;
  }
  const options = {
    filter: filter,
    sort: sort,
  };
  const products = await pb
    .collection("products")
    .getList<Product>(page, 30, options);
  return products.items;
}
