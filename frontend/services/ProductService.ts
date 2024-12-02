import pb from '../utils/pocketbase';

export interface Product {
  id: string;
  label: string;
  price: number;
  image: string;
  kg: number;
}

export async function getProducts(search: string = ""): Promise<Product[]> {
  let filters = {};
  if (search) {
    filters = {"filter": `label ~ '${search}'`};
  }
  const products = await pb.collection('products').getList<Product>(1, 20, filters);
  return products.items;
}