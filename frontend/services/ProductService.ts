import pb from '../utils/pocketbase';

export async function getProducts() {
  const products = await pb.collection('products').getList(1, 20, {});
  return products;
}