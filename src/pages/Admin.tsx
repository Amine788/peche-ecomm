import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { Product, Order, OrderStatus } from '../types';
import Logo from '../components/Logo';

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Nouvelle',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const STATUS_BADGES: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  new: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-600', dot: 'bg-blue-500' },
  confirmed: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-600', dot: 'bg-amber-500' },
  preparing: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-600', dot: 'bg-purple-500' },
  shipped: { bg: 'bg-teal-500/10 border-teal-500/30', text: 'text-teal-600', dot: 'bg-teal-500' },
  delivered: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-600', dot: 'bg-rose-500' },
};

const ORDER_STATUSES: OrderStatus[] = ['new', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];

export default function Admin() {
  const { orders, updateOrderStatus, navigate } = useApp();
  const [tab, setTab] = useState<'orders' | 'products' | 'analytics'>('orders');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchOrder, setSearchOrder] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // New product initial state
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    price: 490,
    category: 'cannes',
    stock: 15,
    description: '',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format'],
    sizes: ['Unique'],
    colors: [{ name: 'Bleu Mer', hex: '#0B2545' }],
    isNew: true,
  });

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customer.fullName.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
      o.customer.phone.includes(searchOrder) ||
      o.customer.city.toLowerCase().includes(searchOrder.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered products
  const filteredProducts = products.filter(p => {
    return productCategoryFilter === 'all' || p.category === productCategoryFilter;
  });

  // Metrics KPI
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter(o => o.status === 'new').length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / (totalOrdersCount || 1)) : 0;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const handleCreateProduct = () => {
    if (!newProd.name || !newProd.price) return;
    const created: Product = {
      id: 'prod-' + Date.now(),
      name: newProd.name,
      slug: newProd.name.toLowerCase().replace(/\s+/g, '-'),
      description: newProd.description || 'Description produit de pêche de haute qualité.',
      price: Number(newProd.price),
      salePrice: newProd.salePrice ? Number(newProd.salePrice) : undefined,
      category: newProd.category || 'cannes',
      images: newProd.images?.length ? newProd.images : ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format'],
      colors: newProd.colors || [{ name: 'Standard', hex: '#000000' }],
      sizes: newProd.sizes || ['Standard'],
      stock: Number(newProd.stock ?? 10),
      isNew: !!newProd.isNew,
      isSale: !!newProd.isSale,
      featured: !!newProd.featured,
    };
    setProducts([created, ...products]);
    setIsAddingProduct(false);
  };

  const toggleProductStock = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 15 } : p));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* ── Top Bar / Header ── */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Logo size="sm" variant="gold" />
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Tableau de bord Admin
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 text-xs tracking-wider uppercase font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-lg transition-all"
          >
            <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">Voir la boutique</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* ── KPI Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Revenue */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Chiffre d'affaires</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-black text-white">{totalRevenue.toLocaleString('fr-MA')} <span className="text-sm font-bold text-emerald-400">MAD</span></p>
              <p className="text-[11px] text-slate-400 mt-1">Commandes validées & livrées</p>
            </div>
          </div>

          {/* New Orders */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nouvelles Commandes</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center relative">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {newOrdersCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 animate-ping" />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-black text-white">{newOrdersCount}</p>
              <p className="text-[11px] text-blue-400 font-semibold mt-1">À traiter rapidement</p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Commandes</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-black text-white">{totalOrdersCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Panier moyen: <strong className="text-white">{avgOrderValue} MAD</strong></p>
            </div>
          </div>

          {/* Products Stock */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalogue Produits</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-black text-white">{products.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">{outOfStockCount > 0 ? <span className="text-rose-400 font-bold">{outOfStockCount} en rupture de stock</span> : <span className="text-emerald-400 font-bold">Tous en stock</span>}</p>
            </div>
          </div>

        </div>

        {/* ── Navigation Tabs ── */}
        <div className="border-b border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex gap-2">
            {[
              { id: 'orders', label: 'Commandes', count: orders.length, icon: '📦' },
              { id: 'products', label: 'Produits', count: products.length, icon: '🎣' },
              { id: 'analytics', label: 'Analytiques', count: null, icon: '📊' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all duration-200 flex items-center gap-2 border-t border-x ${
                  tab === t.id
                    ? 'bg-slate-800 border-slate-700 text-teal-400 shadow-md'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {t.count !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${tab === t.id ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-700 text-slate-300'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {tab === 'products' && (
            <button
              onClick={() => setIsAddingProduct(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-teal-600/20 shrink-0 mb-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nouveau Produit
            </button>
          )}
        </div>

        {/* ── TAB 1: COMMANDES ── */}
        {tab === 'orders' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-80">
                <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher nom, n° commande, ville..."
                  value={searchOrder}
                  onChange={e => setSearchOrder(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0">Statut:</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 ${statusFilter === 'all' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  Tous
                </button>
                {ORDER_STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 ${statusFilter === s ? 'bg-slate-700 text-white border border-slate-600' : 'bg-slate-900/60 text-slate-400 hover:text-white'}`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="bg-slate-800/30 border border-slate-800 rounded-2xl py-16 text-center">
                <p className="text-lg font-bold text-slate-300">Aucune commande trouvée</p>
                <p className="text-xs text-slate-500 mt-1">Les nouvelles commandes d'achats s'afficheront ici automatiquement.</p>
              </div>
            ) : (
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-700/80">
                      <tr>
                        <th className="px-6 py-4">N° Commande</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Ville</th>
                        <th className="px-6 py-4">Articles</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Changer statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 text-slate-200">
                      {filteredOrders.map(order => {
                        const badge = STATUS_BADGES[order.status];
                        return (
                          <tr key={order.id} className="hover:bg-slate-700/40 transition-colors group">
                            <td className="px-6 py-4 font-mono font-bold text-teal-400">
                              <button onClick={() => setSelectedOrder(order)} className="hover:underline">
                                {order.id}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-white">{order.customer.fullName}</p>
                              <p className="text-[11px] text-slate-400">{order.customer.phone}</p>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-300">{order.customer.city}</td>
                            <td className="px-6 py-4">
                              <span className="bg-slate-900 px-2.5 py-1 rounded-md text-slate-300 font-semibold">
                                {order.items.reduce((s, i) => s + i.quantity, 0)} prod.
                              </span>
                            </td>
                            <td className="px-6 py-4 font-black text-emerald-400 text-sm">
                              {order.total.toLocaleString('fr-MA')} MAD
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                {STATUS_LABELS[order.status]}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <select
                                  value={order.status}
                                  onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                  className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-teal-500 cursor-pointer"
                                >
                                  {ORDER_STATUSES.map(s => (
                                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                                  title="Détails commande"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: PRODUITS ── */}
        {tab === 'products' && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 overflow-x-auto w-full">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0">Catégorie:</span>
                <button
                  onClick={() => setProductCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 ${productCategoryFilter === 'all' ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  Toutes ({products.length})
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 ${productCategoryFilter === cat.id ? 'bg-slate-700 text-white border border-slate-600' : 'bg-slate-900/60 text-slate-400 hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-700/80">
                    <tr>
                      <th className="px-6 py-4">Produit</th>
                      <th className="px-6 py-4">Catégorie</th>
                      <th className="px-6 py-4">Prix Regular</th>
                      <th className="px-6 py-4">Prix Promo</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Statut Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 text-slate-200">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-slate-700/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={product.images[0]} alt={product.name} className="w-10 h-12 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0" />
                            <div>
                              <p className="font-bold text-white text-sm line-clamp-1">{product.name}</p>
                              <div className="flex gap-1.5 mt-1">
                                {product.isNew && <span className="text-[9px] font-bold uppercase bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded">Nouveau</span>}
                                {product.isSale && <span className="text-[9px] font-bold uppercase bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">Promo</span>}
                                {product.featured && <span className="text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Top</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-300 capitalize">{product.category}</td>
                        <td className="px-6 py-4 font-bold text-slate-300">{product.price.toLocaleString('fr-MA')} MAD</td>
                        <td className="px-6 py-4">
                          {product.salePrice ? (
                            <span className="font-bold text-rose-400">{product.salePrice.toLocaleString('fr-MA')} MAD</span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold">
                          <span className={product.stock > 0 ? 'text-white' : 'text-rose-400'}>
                            {product.stock} unités
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleProductStock(product.id)}
                            className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full transition-colors ${
                              product.stock > 0
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300'
                            }`}
                          >
                            {product.stock > 0 ? 'En stock' : 'Rupture'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="bg-slate-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Éditer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: ANALYTIQUES ── */}
        {tab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sales Distribution by City */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6 flex items-center gap-2">
                <span>📍</span> Ventes par Ville au Maroc
              </h3>
              <div className="space-y-4">
                {[
                  { city: 'Casablanca', count: 18, pct: 40 },
                  { city: 'Rabat', count: 11, pct: 25 },
                  { city: 'Tanger', count: 8, pct: 18 },
                  { city: 'Agadir', count: 5, pct: 11 },
                  { city: 'Marrakech', count: 3, pct: 6 },
                ].map(c => (
                  <div key={c.city} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white">{c.city}</span>
                      <span className="text-teal-400">{c.count} commandes ({c.pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full transition-all duration-1000" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6 flex items-center gap-2">
                <span>🎣</span> Catégories les plus populaires
              </h3>
              <div className="space-y-4">
                {[
                  { cat: 'Cannes à pêche', pct: 35, color: 'bg-emerald-500' },
                  { cat: 'Moulinets', pct: 28, color: 'bg-blue-500' },
                  { cat: 'Leurres & Appâts', pct: 20, color: 'bg-purple-500' },
                  { cat: 'Natation & Plongée', pct: 17, color: 'bg-amber-500' },
                ].map(c => (
                  <div key={c.cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white">{c.cat}</span>
                      <span className="text-slate-300">{c.pct}% des ventes</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full transition-all duration-1000`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ── MODAL: DETAILS COMMANDE ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-teal-400">Détails de la Commande</p>
                <h3 className="text-xl font-mono font-bold text-white mt-1">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50 space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Informations Client</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">Nom complet:</span>
                  <span className="font-bold text-white text-sm">{selectedOrder.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Téléphone:</span>
                  <a href={`https://wa.me/${selectedOrder.customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-400 hover:underline flex items-center gap-1">
                    <span>💬</span> {selectedOrder.customer.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Ville:</span>
                  <span className="font-bold text-white">{selectedOrder.customer.city}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Adresse:</span>
                  <span className="font-medium text-slate-200">{selectedOrder.customer.address}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Articles Commandés ({selectedOrder.items.length})</p>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 rounded-xl object-cover bg-slate-800 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-sm">{item.product.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Taille: <strong className="text-slate-200">{item.size || 'Unique'}</strong> | Couleur: <strong className="text-slate-200">{item.color || 'Standard'}</strong></p>
                        <p className="text-xs text-teal-400 font-semibold mt-1">Qté: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white text-sm">
                      {((item.product.salePrice ?? item.product.price) * item.quantity).toLocaleString('fr-MA')} MAD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Total à encaisser à la livraison</span>
              <span className="text-2xl font-black text-emerald-400">{selectedOrder.total.toLocaleString('fr-MA')} MAD</span>
            </div>

          </div>
        </div>
      )}

      {/* ── MODAL: EDIT PRODUCT ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-white">Éditer: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1.5">Nom du produit</label>
                <input
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct(p => p ? { ...p, name: e.target.value } : null)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1.5">Prix Regular (MAD)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct(p => p ? { ...p, price: Number(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1.5">Prix Promo (MAD)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                    value={editingProduct.salePrice ?? ''}
                    onChange={e => setEditingProduct(p => p ? { ...p, salePrice: e.target.value ? Number(e.target.value) : undefined } : null)}
                    placeholder="Aucune promo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1.5">Stock disponible</label>
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                  value={editingProduct.stock}
                  onChange={e => setEditingProduct(p => p ? { ...p, stock: Number(e.target.value) } : null)}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="checkbox" checked={editingProduct.isNew} onChange={e => setEditingProduct(p => p ? { ...p, isNew: e.target.checked } : null)} className="accent-teal-500 w-4 h-4" />
                  Nouveau
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="checkbox" checked={editingProduct.isSale} onChange={e => setEditingProduct(p => p ? { ...p, isSale: e.target.checked } : null)} className="accent-teal-500 w-4 h-4" />
                  Promo
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input type="checkbox" checked={editingProduct.featured} onChange={e => setEditingProduct(p => p ? { ...p, featured: e.target.checked } : null)} className="accent-teal-500 w-4 h-4" />
                  Best-seller
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
                  setEditingProduct(null);
                }}
                className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-teal-600/20"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Annuler
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── MODAL: ADD NEW PRODUCT ── */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-white">Ajouter un nouveau produit</h3>
              <button onClick={() => setIsAddingProduct(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1.5">Nom du produit *</label>
                <input
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                  placeholder="Ex: Canne Daiwa Saltist 4.20m"
                  value={newProd.name}
                  onChange={e => setNewProd(p => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1.5">Catégorie *</label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 capitalize"
                    value={newProd.category}
                    onChange={e => setNewProd(p => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 uppercase font-bold mb-1.5">Prix (MAD) *</label>
                  <input
                    type="number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                    placeholder="490"
                    value={newProd.price}
                    onChange={e => setNewProd(p => ({ ...p, price: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1.5">URL de l'image</label>
                <input
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                  placeholder="https://images.unsplash.com/..."
                  value={newProd.images?.[0] || ''}
                  onChange={e => setNewProd(p => ({ ...p, images: [e.target.value] }))}
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1.5">Stock initial</label>
                <input
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
                  value={newProd.stock}
                  onChange={e => setNewProd(p => ({ ...p, stock: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleCreateProduct}
                className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-teal-600/20"
              >
                Créer le produit
              </button>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Annuler
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
