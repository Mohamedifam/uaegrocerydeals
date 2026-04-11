'use client';
import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    const res = await fetch('/api/admin/products');
    if (res.ok) {
      setProducts(await res.json());
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({ name, category }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      setName(''); setCategory('');
      fetchProducts();
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Product Catalog</h1>
      
      <div className={styles.card}>
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', maxWidth: '500px' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Product Name</label>
            <input className={styles.formInput} value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <input className={styles.formInput} value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g. Dairy, Rice, Oil" />
          </div>
          <button className={styles.btnPrimary} type="submit">Save Product</button>
        </form>
      </div>

      <div className={styles.card}>
        <h2>Product List</h2>
        <table className={styles.table} style={{ marginTop: '1.5rem' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category || 'N/A'}</td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={2}>No products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
