import pb from '../utils/pocketbase';

export interface Product {
  id: string;
  label: string;
  price: number;
  image: string;
  kg: number;
}

export async function getProducts(): Promise<Product[]> {
  const products = await pb.collection('products').getList<Product>(1, 20, {});
  return products.items;
}