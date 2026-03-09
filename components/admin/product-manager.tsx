'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  wholesalePrice: number | null;
  stockQuantity: number;
  description: string;
  imageUrl?: string | null;
  featured: boolean;
  category?: Category | null;
}

const emptyProduct = {
  name: '',
  categoryId: '',
  price: 0,
  wholesalePrice: 0,
  stockQuantity: 0,
  description: '',
  imageUrl: '',
  featured: false,
};

export function ProductManager({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [items, setItems] = useState(products);
  const [formState, setFormState] = useState({ ...emptyProduct });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...formState,
      price: Number(formState.price),
      wholesalePrice: Number(formState.wholesalePrice),
      stockQuantity: Number(formState.stockQuantity),
      imageUrl: formState.imageUrl || undefined,
    };

    const response = await fetch(editingId ? `/api/admin/products/${editingId}` : '/api/admin/products', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      toast.error('Failed to save product');
      return;
    }

    const product = await response.json();
    setItems((current) => {
      if (editingId) {
        return current.map((item) => (item.id === editingId ? { ...item, ...product } : item));
      }
      return [product, ...current];
    });

    toast.success('Product saved');
    setFormState({ ...emptyProduct });
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormState({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      wholesalePrice: product.wholesalePrice ?? 0,
      stockQuantity: product.stockQuantity,
      description: product.description,
      imageUrl: product.imageUrl ?? '',
      featured: product.featured,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      toast.error('Unable to delete');
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormState({ ...emptyProduct });
    }
  };

  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    setUploading(true);
    const response = await fetch('/api/admin/uploads', { method: 'POST', body: data });
    setUploading(false);
    if (!response.ok) {
      toast.error('Upload failed');
      return;
    }

    const body = await response.json();
    setFormState((prev) => ({ ...prev, imageUrl: body.url }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
      <form onSubmit={submit} className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="font-semibold text-charcoal">{editingId ? 'Edit product' : 'Add product'}</h2>

        <div>
          <label className="text-sm text-gray-600">Name</label>
          <Input value={formState.name} onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))} required />
        </div>

        <div>
          <label className="text-sm text-gray-600">Category</label>
          <select
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            value={formState.categoryId}
            onChange={(event) => setFormState((prev) => ({ ...prev, categoryId: event.target.value }))}
            required
          >
            <option value="">Select</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm text-gray-600">Price (GHS)</label>
            <Input
              type="number"
              value={formState.price}
              onChange={(event) => setFormState((prev) => ({ ...prev, price: Number(event.target.value) }))}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Wholesale</label>
            <Input
              type="number"
              value={formState.wholesalePrice}
              onChange={(event) => setFormState((prev) => ({ ...prev, wholesalePrice: Number(event.target.value) }))}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Stock</label>
            <Input
              type="number"
              value={formState.stockQuantity}
              onChange={(event) => setFormState((prev) => ({ ...prev, stockQuantity: Number(event.target.value) }))}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Description</label>
          <Textarea
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Image URL</label>
          <Input value={formState.imageUrl} onChange={(event) => setFormState((prev) => ({ ...prev, imageUrl: event.target.value }))} />
          <input
            type="file"
            className="mt-2 text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />
          {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={formState.featured}
            onChange={(event) => setFormState((prev) => ({ ...prev, featured: event.target.checked }))}
          />
          Feature on homepage
        </label>

        <Button type="submit" className="w-full">
          {editingId ? 'Update product' : 'Create product'}
        </Button>
      </form>

      <div className="space-y-3 rounded-3xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="font-semibold text-charcoal">Catalog</h2>
        <div className="max-h-[600px] space-y-3 overflow-y-auto">
          {items.map((product) => (
            <div key={product.id} className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-charcoal">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category?.name}</p>
                </div>
                <p className="text-sm font-semibold text-brand-dark">GHS {Number(product.price).toFixed(2)}</p>
              </div>
              <div className="mt-3 flex gap-3 text-sm">
                <Button type="button" variant="subtle" onClick={() => handleEdit(product)}>
                  Edit
                </Button>
                <Button type="button" variant="ghost" onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-gray-500">No products yet.</p>}
        </div>
      </div>
    </div>
  );
}
