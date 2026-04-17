import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../api/client';
import {
  createProduct as createProductRequest,
  deleteProduct as deleteProductRequest,
  fetchProducts,
  updateProduct as updateProductRequest,
  type Product,
  type ProductPayload,
} from '../api/services/products';

export type { Product } from '../api/services/products';

export type ProductFormData = {
  name: string;
  price: string;
  category: string;
  stock: string;
  description: string;
};

export const EMPTY_PRODUCT_FORM: ProductFormData = {
  name: '',
  price: '',
  category: '',
  stock: '',
  description: '',
};

export const PRODUCT_CATEGORIES: readonly string[] = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
];

// Legacy productActions.fetchProducts() falls back to this list on any error —
// preserved so the table still renders something instead of an empty state.
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Wireless Bluetooth Headphones', price: 79.99, category: 'Electronics', stock: 45, description: 'Premium wireless headphones with noise cancellation' },
  { id: 2, name: 'Cotton T-Shirt Pack (3)', price: 29.99, category: 'Clothing', stock: 120, description: 'Comfortable cotton t-shirts, pack of 3' },
  { id: 3, name: 'Stainless Steel Water Bottle', price: 24.99, category: 'Home & Garden', stock: 78, description: '32oz insulated water bottle' },
  { id: 4, name: 'Running Shoes Pro', price: 129.99, category: 'Sports', stock: 8, description: 'Lightweight running shoes with arch support' },
  { id: 5, name: 'JavaScript: The Good Parts', price: 34.99, category: 'Books', stock: 55, description: 'Classic programming book by Douglas Crockford' },
  { id: 6, name: 'USB-C Charging Cable (2m)', price: 12.99, category: 'Electronics', stock: 200, description: 'Braided USB-C cable, fast charging compatible' },
  { id: 7, name: 'Yoga Mat Premium', price: 45.0, category: 'Sports', stock: 33, description: 'Non-slip exercise mat, 6mm thick' },
  { id: 8, name: 'LED Desk Lamp', price: 39.99, category: 'Home & Garden', stock: 5, description: 'Adjustable LED lamp with 3 brightness levels' },
  { id: 9, name: 'Denim Jacket Classic', price: 89.99, category: 'Clothing', stock: 22, description: 'Classic fit denim jacket, medium wash' },
  { id: 10, name: 'Mechanical Keyboard RGB', price: 149.99, category: 'Electronics', stock: 3, description: 'Mechanical gaming keyboard with Cherry MX switches' },
];

function formDataToPayload(form: ProductFormData): ProductPayload {
  return {
    name: form.name,
    price: Number.parseFloat(form.price) || 0,
    category: form.category,
    stock: Number.parseInt(form.stock, 10) || 0,
    description: form.description,
  };
}

function messageFrom(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export type UseProductsResult = {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  deleteProduct: (productId: number) => Promise<void>;
  saveProduct: (
    form: ProductFormData,
    editingProduct: Product | null,
  ) => Promise<void>;
};

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        const list = await fetchProducts(controller.signal);
        if (!cancelled) {
          setProducts(list);
          setError(null);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setProducts(MOCK_PRODUCTS);
        setError(messageFrom(err, 'Failed to load products'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
  }, [products, searchTerm]);

  const deleteProduct = useCallback(async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductRequest(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setError(null);
    } catch (err) {
      setError(messageFrom(err, 'Failed to delete product'));
    }
  }, []);

  const saveProduct = useCallback(
    async (form: ProductFormData, editingProduct: Product | null) => {
      const payload = formDataToPayload(form);
      try {
        if (editingProduct) {
          const updated = await updateProductRequest(editingProduct.id, payload);
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? updated : p)),
          );
        } else {
          const created = await createProductRequest(payload);
          setProducts((prev) => [...prev, created]);
        }
        setError(null);
      } catch (err) {
        setError(
          messageFrom(
            err,
            editingProduct ? 'Failed to update product' : 'Failed to create product',
          ),
        );
        throw err;
      }
    },
    [],
  );

  return {
    products,
    filteredProducts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    deleteProduct,
    saveProduct,
  };
}

export default useProducts;
