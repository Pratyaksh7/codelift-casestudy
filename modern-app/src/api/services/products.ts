import { client } from '../client';
import { endpoints } from '../endpoints';

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
};

export type ProductPayload = Omit<Product, 'id'>;

export function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  return client.get<Product[]>(endpoints.products.list, { signal });
}

export function createProduct(payload: ProductPayload): Promise<Product> {
  return client.post<Product>(endpoints.products.list, payload);
}

export function updateProduct(
  id: number,
  payload: ProductPayload,
): Promise<Product> {
  return client.put<Product>(endpoints.products.byId(id), payload);
}

export function deleteProduct(id: number): Promise<void> {
  return client.del<void>(endpoints.products.byId(id));
}
