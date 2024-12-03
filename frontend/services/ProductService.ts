import pb from "../utils/pocketbase";

export interface Product {
  id: string;
  label: string;
  price: number;
  image: string;
  kg: number;
  unit: string;
}

export async function getProducts(search: string = ""): Promise<Product[]> {
  let filter = "is_active = true";
  if (search) {
    filter += ` && label ~ '${search}'`;
  }
  const filters = { filter: filter };
  const products = await pb.collection("products").getList<Product>(1, 20, filters);
  return products.items;
}
