import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { Product, Order, OrderStatus } from '../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Nouvelle',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'bg-ocean/10 text-ocean',
  confirmed: 'bg-gold/10 text-gold',
  preparing: 'bg-warm-gray/10 text-warm-gray',
  shipped: 'bg-success/10 text-success',
  delivered: 'bg-success text-cream',
  cancelled: 'bg-error/10 text-error',
};

const ORDER_STATUSES: OrderStatus[] = ['new', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];

export default function Admin() {
  const { orders, updateOrderStatus, navigate } = useApp();
  const [tab, setTab] = useState<'orders' | 'products'>('orders');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchOrder, setSearchOrder] = useState('');

  const filteredOrders = orders.filter(o =>
    o.customer.fullName.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.customer.phone.includes(searchOrder) ||
    o.customer.city.toLowerCase().includes(searchOrder.toLowerCase())
  );

  const stats = {
    totalOrders: orders.length,
    newOrders: orders.filter(o => o.status === 'new').length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    totalProducts: products.length,
  };

  const toggleProductActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 10 } : p));
  };

  return (
    <div className="min-h-full bg-cream">
      {/* Header */}
      <div className="navy-gradient text-cream px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-cream/40">Administration</p>
          <h1 className="font-display text-2xl italic mt-0.5">IKKA DEL MAR</h1>
        </div>
        <button
          onClick={() => navigate('home')}
          className="text-xs tracking-widest uppercase text-cream/50 hover:text-cream transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Voir le site
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-warm-border">
        {[
          { label: 'Commandes totales', value: stats.totalOrders, unit: '' },
          { label: 'Nouvelles commandes', value: stats.newOrders, unit: '', highlight: true },
          { label: 'Chiffre d\'affaires', value: stats.totalRevenue.toLocaleString('fr-MA'), unit: ' MAD' },
          { label: 'Produits actifs', value: products.filter(p => p.stock > 0).length, unit: '' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 border-r border-warm-border last:border-r-0 ${stat.highlight && stat.value > 0 ? 'bg-ocean/5' : ''}`}>
            <p className="text-xs text-warm-gray tracking-wider uppercase mb-1">{stat.label}</p>
            <p className={`text-2xl font-semibold font-display ${stat.highlight && (stat.value as number) > 0 ? 'text-ocean' : 'text-warm-dark'}`}>
              {stat.value}{stat.unit}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-warm-border px-4 sm:px-6 lg:px-8">
        <div className="flex gap-0">
          {[
            { id: 'orders', label: `Commandes (${orders.length})` },
            { id: 'products', label: `Produits (${products.length})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-5 py-4 text-xs tracking-widest uppercase font-semibold border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-navy text-navy'
                  : 'border-transparent text-warm-gray hover:text-navy'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="font-display text-2xl italic">Commandes</h2>
              <input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchOrder}
                onChange={e => setSearchOrder(e.target.value)}
                className="border border-warm-border bg-cream px-4 py-2.5 text-sm outline-none focus:border-warm-dark transition-colors w-full sm:w-64"
              />
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-warm-gray">
                <p className="font-display text-xl italic mb-2">
                  {orders.length === 0 ? 'Aucune commande pour le moment' : 'Aucun résultat'}
                </p>
                <p className="text-sm">Les commandes apparaîtront ici dès qu'un client passe une commande.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-warm-border text-left">
                      {['N° Commande', 'Date', 'Client', 'Téléphone', 'Ville', 'Total', 'Statut', 'Action'].map(h => (
                        <th key={h} className="px-4 sm:px-6 py-3 text-xs tracking-widest uppercase text-warm-gray font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-border">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-sand/50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 text-sm font-mono text-warm-gray">{order.id}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-warm-gray">
                          {new Date(order.createdAt).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short' })}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold">{order.customer.fullName}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-warm-gray">{order.customer.phone}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm">{order.customer.city}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold">{order.total.toLocaleString('fr-MA')} MAD</td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className={`text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-sm ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs border border-warm-border bg-cream px-2 py-1.5 outline-none focus:border-warm-dark cursor-pointer"
                          >
                            {ORDER_STATUSES.map(s => (
                              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl italic">Produits</h2>
              <p className="text-xs text-warm-gray">
                Données de démonstration — intégrez votre CMS pour gérer les vrais produits
              </p>
            </div>

            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-mid/50 animate-fade-in px-4">
                <div className="bg-cream w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-8 animate-fade-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-xl italic">{editingProduct.name}</h3>
                    <button onClick={() => setEditingProduct(null)}>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs tracking-widest uppercase font-semibold mb-2 block">Nom</label>
                      <input
                        className="w-full border border-warm-border bg-cream px-4 py-3 text-sm outline-none focus:border-warm-dark"
                        value={editingProduct.name}
                        onChange={e => setEditingProduct(p => p ? { ...p, name: e.target.value } : null)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs tracking-widest uppercase font-semibold mb-2 block">Prix (MAD)</label>
                        <input
                          type="number"
                          className="w-full border border-warm-border bg-cream px-4 py-3 text-sm outline-none focus:border-warm-dark"
                          value={editingProduct.price}
                          onChange={e => setEditingProduct(p => p ? { ...p, price: Number(e.target.value) } : null)}
                        />
                      </div>
                      <div>
                        <label className="text-xs tracking-widest uppercase font-semibold mb-2 block">Prix promo (MAD)</label>
                        <input
                          type="number"
                          className="w-full border border-warm-border bg-cream px-4 py-3 text-sm outline-none focus:border-warm-dark"
                          value={editingProduct.salePrice ?? ''}
                          onChange={e => setEditingProduct(p => p ? { ...p, salePrice: e.target.value ? Number(e.target.value) : undefined } : null)}
                          placeholder="Aucun"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase font-semibold mb-2 block">Stock</label>
                      <input
                        type="number"
                        className="w-full border border-warm-border bg-cream px-4 py-3 text-sm outline-none focus:border-warm-dark"
                        value={editingProduct.stock}
                        onChange={e => setEditingProduct(p => p ? { ...p, stock: Number(e.target.value) } : null)}
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase font-semibold mb-2 block">Description</label>
                      <textarea
                        className="w-full border border-warm-border bg-cream px-4 py-3 text-sm outline-none focus:border-warm-dark resize-none"
                        rows={3}
                        value={editingProduct.description}
                        onChange={e => setEditingProduct(p => p ? { ...p, description: e.target.value } : null)}
                      />
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingProduct.isNew}
                          onChange={e => setEditingProduct(p => p ? { ...p, isNew: e.target.checked } : null)}
                          className="accent-warm-dark" />
                        <span className="text-sm">Nouveau</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingProduct.isSale}
                          onChange={e => setEditingProduct(p => p ? { ...p, isSale: e.target.checked } : null)}
                          className="accent-warm-dark" />
                        <span className="text-sm">En promotion</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingProduct.featured}
                          onChange={e => setEditingProduct(p => p ? { ...p, featured: e.target.checked } : null)}
                          className="accent-warm-dark" />
                        <span className="text-sm">Mis en avant</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
                        setEditingProduct(null);
                      }}
                      className="flex-1 sea-gradient text-cream py-3 text-xs tracking-widest uppercase font-semibold hover:opacity-90 transition-opacity"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="flex-1 border border-warm-border py-3 text-xs tracking-widest uppercase text-warm-gray hover:border-warm-dark hover:text-warm-dark transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-warm-border text-left">
                    {['Produit', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="px-4 sm:px-6 py-3 text-xs tracking-widest uppercase text-warm-gray font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-border">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-sand/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 shrink-0 overflow-hidden bg-sand">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{product.name}</p>
                            <div className="flex gap-1 mt-0.5">
                              {product.isNew && <span className="text-[9px] tracking-wider uppercase bg-ocean/10 text-ocean px-1.5 py-0.5">New</span>}
                              {product.isSale && <span className="text-[9px] tracking-wider uppercase bg-gold/10 text-gold px-1.5 py-0.5">Sale</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-warm-gray capitalize">{product.category.replace('-', ' ')}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        {product.salePrice ? (
                          <div>
                            <p className="font-semibold text-gold">{product.salePrice} MAD</p>
                            <p className="text-xs text-warm-gray line-through">{product.price} MAD</p>
                          </div>
                        ) : (
                          <p className="font-semibold">{product.price} MAD</p>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        <span className={product.stock > 0 ? 'text-success font-semibold' : 'text-error'}>
                          {product.stock > 0 ? product.stock : 'Épuisé'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button
                          onClick={() => toggleProductActive(product.id)}
                          className={`text-[10px] tracking-wider uppercase px-2.5 py-1 font-semibold transition-colors ${
                            product.stock > 0
                              ? 'bg-success/10 text-success hover:bg-error/10 hover:text-error'
                              : 'bg-error/10 text-error hover:bg-success/10 hover:text-success'
                          }`}
                        >
                          {product.stock > 0 ? 'Actif' : 'Inactif'}
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-xs tracking-widest uppercase text-warm-gray hover:text-warm-dark transition-colors underline underline-offset-2"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
