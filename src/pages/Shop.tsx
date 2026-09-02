import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import ProductCard from '../components/ProductCard';
import CategoryCarousel from '../components/CategoryCarousel';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'featured' | 'promo';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: "Nouveautés d'abord" },
  { value: 'featured', label: 'Best-sellers' },
  { value: 'promo', label: 'Promotions' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
];

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const CATEGORY_TITLES: Record<string, string> = {
  all: 'Toute la collection',
  new: 'Nouveautés',
  sale: 'Promotions & Soldes',
  bestsellers: 'Best-Sellers',
};

const GLOBAL_MAX_PRICE = Math.ceil(Math.max(...PRODUCTS.map(p => p.price)) / 500) * 500;


const QUICK_TABS = [
  { id: 'all',        label: 'Tous',         accent: false },
  { id: 'new',        label: 'Nouveautés',   accent: false },
  { id: 'sale',       label: 'Promotions',   accent: true  },
  { id: 'bestsellers',label: 'Best-Sellers', accent: false },
  { id: 'natation',   label: 'Natation',     accent: false },
  { id: 'cannes',     label: 'Cannes',       accent: false },
  { id: 'moulinets',  label: 'Moulinets',    accent: false },
  { id: 'leurres',    label: 'Leurres',      accent: false },
  { id: 'hamecons',   label: 'Hameçons',     accent: false },
  { id: 'accessoires',label: 'Accessoires',  accent: false },
];

export default function Shop() {
  const { shopCategory, setShopCategory } = useApp();
  const [sort, setSort] = useState<SortOption>('newest');
  const [search, setSearch] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(GLOBAL_MAX_PRICE);
  const [filterOpen, setFilterOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    PRODUCTS.forEach(p => p.colors.forEach(c => { if (!map.has(c.name)) map.set(c.name, c.hex); }));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  const sidebarCategories = useMemo(() => [
    { id: 'all',        name: 'Tous les produits', count: PRODUCTS.length },
    { id: 'new',        name: 'Nouveautés',         count: PRODUCTS.filter(p => p.isNew).length },
    { id: 'sale',       name: 'Promotions',          count: PRODUCTS.filter(p => p.isSale).length },
    { id: 'bestsellers',name: 'Best-Sellers',        count: PRODUCTS.filter(p => p.featured).length },
    ...CATEGORIES.map(c => ({
      id: c.id,
      name: c.name,
      count: PRODUCTS.filter(p => p.category === c.id).length,
    })),
  ], []);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (shopCategory === 'new')        list = list.filter(p => p.isNew);
    else if (shopCategory === 'sale')  list = list.filter(p => p.isSale);
    else if (shopCategory === 'bestsellers') list = list.filter(p => p.featured);
    else if (shopCategory !== 'all')   list = list.filter(p => p.category === shopCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (selectedSizes.length > 0) list = list.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    if (selectedColors.length > 0) list = list.filter(p => p.colors.some(c => selectedColors.includes(c.name)));
    if (inStockOnly) list = list.filter(p => p.stock > 0);
    list = list.filter(p => (p.salePrice ?? p.price) <= maxPrice);

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)); break;
      case 'price-desc': list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)); break;
      case 'featured':   list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
      case 'promo':      list.sort((a, b) => (b.isSale ? 1 : 0) - (a.isSale ? 1 : 0)); break;
      default:           list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return list;
  }, [shopCategory, sort, search, selectedSizes, selectedColors, maxPrice, inStockOnly]);

  const toggleSize = (s: string) =>
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleColor = (name: string) =>
    setSelectedColors(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);

  const activeFilterCount = [
    search.trim() ? 1 : 0,
    selectedSizes.length,
    selectedColors.length,
    inStockOnly ? 1 : 0,
    maxPrice < GLOBAL_MAX_PRICE ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const resetFilters = () => {
    setSearch('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(GLOBAL_MAX_PRICE);
    setInStockOnly(false);
  };

  const activeTitle =
    CATEGORY_TITLES[shopCategory] ??
    CATEGORIES.find(c => c.id === shopCategory)?.name ??
    shopCategory;

  const categoryDescription: Record<string, string> = {
    all: "Explorez l'intégralité de notre catalogue.",
    new: 'Les dernières arrivées de la saison.',
    sale: "Jusqu'à -30% sur une sélection de produits.",
    bestsellers: 'Les produits plébiscités par notre communauté.',
    natation: 'Combinaisons, palmes, lunettes et accessoires de natation.',
    cannes: 'Cannes spinning, surfcasting et mer de qualité professionnelle.',
    moulinets: 'Moulinets front drag, baitcasting et surfcasting.',
    leurres: 'Leurres souples, poissons nageurs, vinyles et appâts.',
  };

  const FilterPanel = ({ compact = false }: { compact?: boolean }) => (
    <div className={`space-y-5 ${compact ? '' : ''}`}>

      {/* ── Accès rapide ── */}
      <div className="space-y-2">
        <p className="text-[9px] tracking-[0.45em] uppercase text-warm-gray/60 mb-3">Accès rapide</p>

        {/* Nouveautés */}
        <button
          onClick={() => setShopCategory('new')}
          className={`w-full flex items-center justify-between px-3 py-2.5 transition-all ${
            shopCategory === 'new'
              ? 'bg-teal text-cream'
              : 'bg-teal/10 text-teal-dark hover:bg-teal/20 border border-teal/30'
          }`}
        >
          <span className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-dot" />
            Nouveautés
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
            shopCategory === 'new' ? 'bg-cream/20' : 'bg-teal/20'
          }`}>
            {PRODUCTS.filter(p => p.isNew).length}
          </span>
        </button>

        {/* Promotions */}
        <button
          onClick={() => setShopCategory('sale')}
          className={`w-full flex items-center justify-between px-3 py-2.5 transition-all ${
            shopCategory === 'sale'
              ? 'coral-gradient text-cream'
              : 'bg-coral/10 text-coral hover:bg-coral/20 border border-coral/40'
          }`}
        >
          <span className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold">
            <span>✦</span>
            Promotions
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
            shopCategory === 'sale' ? 'bg-cream/20' : 'bg-coral/20'
          }`}>
            {PRODUCTS.filter(p => p.isSale).length}
          </span>
        </button>

        {/* Best-sellers */}
        <button
          onClick={() => setShopCategory('bestsellers')}
          className={`w-full flex items-center justify-between px-3 py-2.5 transition-all ${
            shopCategory === 'bestsellers'
              ? 'bg-navy text-cream'
              : 'bg-navy/8 text-navy hover:bg-navy/15 border border-navy/20'
          }`}
        >
          <span className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-bold">
            <span>★</span>
            Best-Sellers
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
            shopCategory === 'bestsellers' ? 'bg-cream/20' : 'bg-navy/15'
          }`}>
            {PRODUCTS.filter(p => p.featured).length}
          </span>
        </button>
      </div>

      <div className="border-t border-warm-border" />

      {/* Search */}
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase text-warm-gray/70 mb-2.5 flex items-center gap-2">
          <span className="w-4 h-px bg-ocean/50" />Recherche
        </p>
        <div className="relative">
          <input
            type="search"
            placeholder="Nom, description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-sand border border-warm-border px-3 py-2.5 text-sm text-navy placeholder-warm-gray/50 outline-none focus:border-teal transition-colors pr-8"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-warm-gray hover:text-gold transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase text-warm-gray/70 mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-gold/50" />Catégories
        </p>
        <ul className="space-y-0.5">
          {sidebarCategories.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => setShopCategory(cat.id)}
                className={`w-full flex items-center justify-between py-2 px-2.5 text-sm transition-all group ${
                  shopCategory === cat.id
                    ? 'bg-teal/10 text-teal-dark font-semibold border-l-2 border-teal'
                    : 'text-warm-gray hover:text-navy hover:bg-sand border-l-2 border-transparent'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 ${
                  shopCategory === cat.id
                    ? 'bg-teal/20 text-teal-dark'
                    : 'bg-sand text-warm-gray/60 group-hover:text-warm-gray'
                }`}>
                  {cat.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase text-warm-gray/70 mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-gold/50" />Budget max
        </p>
        <div className="bg-teal/10 border border-teal/20 px-3 py-2 mb-3 flex items-baseline justify-between">
          <span className="text-warm-gray text-xs">0 MAD</span>
          <span className="font-display text-lg italic text-teal-dark">{maxPrice.toLocaleString('fr-MA')}</span>
          <span className="text-warm-gray text-xs">MAD</span>
        </div>
        <input
          type="range"
          min={0}
          max={GLOBAL_MAX_PRICE}
          step={100}
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
          className="w-full accent-teal cursor-pointer"
        />
      </div>

      {/* Sizes */}
      <div>
        <p className="text-[9px] tracking-[0.4em] uppercase text-warm-gray/70 mb-3 flex items-center gap-2">
          <span className="w-4 h-px bg-gold/50" />Taille
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CLOTHING_SIZES.map(s => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`w-9 h-9 text-xs border transition-all ${
                selectedSizes.includes(s)
                  ? 'border-teal bg-teal text-cream font-bold'
                  : 'border-warm-border text-navy hover:border-teal/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-warm-gray mb-3">Couleur</p>
        <div className="flex flex-wrap gap-2">
          {allColors.slice(0, 16).map(({ name, hex }) => (
            <button
              key={name}
              onClick={() => toggleColor(name)}
              title={name}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                selectedColors.includes(name)
                  ? 'border-ocean scale-110 shadow-sm'
                  : 'border-warm-border hover:border-warm-gray'
              }`}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
        {selectedColors.length > 0 && (
          <p className="text-[11px] text-warm-gray mt-2">
            {selectedColors.join(', ')}
            <button onClick={() => setSelectedColors([])} className="ml-2 text-teal underline">effacer</button>
          </p>
        )}
      </div>

      {/* Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-9 h-5 rounded-full flex items-center transition-colors cursor-pointer ${
              inStockOnly ? 'bg-teal' : 'bg-warm-border'
            }`}
          >
            <div className={`w-4 h-4 bg-cream rounded-full shadow transition-transform mx-0.5 ${inStockOnly ? 'translate-x-4' : ''}`} />
          </div>
          <span className="text-sm text-navy group-hover:text-teal transition-colors">En stock uniquement</span>
        </label>
      </div>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-warm-gray hover:text-teal transition-colors border border-warm-border hover:border-teal py-2.5"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 109-9M3 3v4h4" />
          </svg>
          Réinitialiser ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-full pt-24 md:pt-28">

      {/* ── Quick navigation tabs ── */}
      <div className="bg-navy border-b border-teal/20 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center min-w-max">

            {/* SOLDES — pill toujours visible */}
            <button
              onClick={() => setShopCategory('sale')}
              className={`flex items-center gap-2 mx-3 my-2 px-4 py-2 text-[11px] tracking-[0.2em] uppercase font-bold transition-all whitespace-nowrap ${
                shopCategory === 'sale'
                  ? 'coral-gradient text-cream'
                  : 'bg-coral/15 border border-coral/60 text-coral hover:bg-coral/25'
              }`}
            >
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h.01M7 3H5a2 2 0 00-2 2v2c0 1.1.9 2 2 2h2a2 2 0 002-2V5a2 2 0 00-2-2zM17 3h-2a2 2 0 00-2 2v2c0 1.1.9 2 2 2h2a2 2 0 002-2V5a2 2 0 00-2-2zM7 13H5a2 2 0 00-2 2v2c0 1.1.9 2 2 2h2a2 2 0 002-2v-2a2 2 0 00-2-2z" />
              </svg>
              Soldes
            </button>

            <span className="w-px h-6 bg-blue/20 mx-1" />

            {/* NOUVEAUTÉS — dot animé */}
            <button
              onClick={() => setShopCategory('new')}
              className={`flex items-center gap-1.5 px-4 py-4 text-[11px] tracking-[0.18em] uppercase font-bold border-b-2 transition-all whitespace-nowrap ${
                shopCategory === 'new'
                  ? 'border-teal text-teal'
                  : 'border-transparent text-silver/60 hover:text-teal/80'
              }`}
            >
              Nouveautés
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse-dot shrink-0" />
            </button>

            {/* Autres tabs */}
            {QUICK_TABS.filter(t => t.id !== 'sale' && t.id !== 'new').map(tab => (
              <button
                key={tab.id}
                onClick={() => setShopCategory(tab.id)}
                className={`px-4 py-4 text-[11px] tracking-[0.18em] uppercase font-semibold border-b-2 transition-all whitespace-nowrap ${
                  shopCategory === tab.id
                    ? 'border-teal text-teal'
                    : 'border-transparent text-silver/50 hover:text-silver'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Promo banner ── */}
      {shopCategory === 'sale' && (
        <div className="coral-gradient relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
            <svg className="w-4 h-4 text-cream/80 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z" />
            </svg>
            <span className="text-cream text-[12px] tracking-[0.3em] uppercase font-black">
              Soldes — Jusqu'à -30% sur notre sélection
            </span>
            <svg className="w-4 h-4 text-cream/80 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z" />
            </svg>
          </div>
        </div>
      )}

      {/* ── Nouveautés banner ── */}
      {shopCategory === 'new' && (
        <div className="bg-teal border-b border-teal-dark/40">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cream animate-pulse-dot" />
            <span className="text-cream text-[10px] tracking-[0.4em] uppercase font-semibold">
              Dernières arrivées de la saison
            </span>
            <span className="w-2 h-2 rounded-full bg-cream animate-pulse-dot" />
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className={`relative border-b overflow-hidden ${
        shopCategory === 'sale'
          ? 'navy-gradient border-coral/30'
          : shopCategory === 'new'
          ? 'bg-teal-dark border-teal/30'
          : 'bg-sand border-warm-border'
      }`}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className={`text-[10px] tracking-[0.5em] uppercase font-bold mb-2 ${
                shopCategory === 'sale' ? 'text-coral' :
                shopCategory === 'new'  ? 'text-teal-light' : 'text-warm-gray'
              }`}>
                {shopCategory === 'sale' ? '★ Offres limitées ★' :
                 shopCategory === 'new'  ? '● Nouvelles arrivées' : 'IKKA DEL MAR — Boutique'}
              </p>
              <h1 className={`font-display text-4xl md:text-6xl font-black uppercase tracking-wide mb-2 ${
                shopCategory === 'sale' ? 'text-cream' :
                shopCategory === 'new'  ? 'text-cream' : 'text-navy'
              }`}>
                {activeTitle}
              </h1>
              {categoryDescription[shopCategory] && (
                <p className={`text-sm max-w-md ${
                  shopCategory === 'sale' || shopCategory === 'new' ? 'text-silver/60' : 'text-warm-gray'
                }`}>
                  {categoryDescription[shopCategory]}
                </p>
              )}
            </div>
            <div className={`shrink-0 hidden sm:flex flex-col items-end gap-0.5 px-5 py-3 border ${
              shopCategory === 'sale' ? 'border-coral/30 bg-coral/10' :
              shopCategory === 'new'  ? 'border-teal/30 bg-teal/10' :
              'border-warm-border bg-cream'
            }`}>
              <p className={`font-display text-4xl font-black ${
                shopCategory === 'sale' ? 'text-cream' :
                shopCategory === 'new'  ? 'text-teal-light' : 'text-navy'
              }`}>
                {filtered.length}
              </p>
              <p className={`text-[9px] tracking-[0.3em] uppercase ${
                shopCategory === 'sale' || shopCategory === 'new' ? 'text-silver/50' : 'text-warm-gray'
              }`}>
                produit{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Explorer par catégorie — Carousel 3D ── */}
      {shopCategory === 'all' && (
        <CategoryCarousel onSelect={setShopCategory} variant="dark" />
      )}

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <div className="bg-teal-dark text-cream px-4 py-3 mb-4 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-teal-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-teal-light">Filtres</span>
                {activeFilterCount > 0 && (
                  <span className="ml-auto bg-teal-light text-navy text-[9px] font-black px-1.5 py-0.5 rounded">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Product area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-3 pb-4 border-b-2 border-warm-border">
              {/* Mobile filter button */}
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-teal-dark text-cream px-4 py-2.5 text-[11px] tracking-widest uppercase font-bold hover:bg-teal transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M7 12h10M10 18h4" />
                </svg>
                Filtres
                {activeFilterCount > 0 && (
                  <span className="bg-teal-light text-navy text-[9px] font-black w-5 h-5 rounded flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-warm-gray lg:hidden">
                  <strong className="text-navy">{filtered.length}</strong> résultat{filtered.length !== 1 ? 's' : ''}
                </span>
                <span className="text-[11px] text-warm-gray hidden md:inline tracking-wider">Trier :</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  className="text-[11px] border border-warm-border bg-cream px-3 py-2.5 text-navy outline-none focus:border-blue cursor-pointer tracking-wide"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Favorites strip */}
            {favorites.size > 0 && (
              <div className="mb-6 flex items-center gap-2 bg-navy/5 border-l-4 border-amber px-4 py-3">
                <svg className="w-3.5 h-3.5 text-amber fill-amber" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <p className="text-[11px] tracking-wider uppercase text-navy font-semibold">
                  {favorites.size} favori{favorites.size > 1 ? 's' : ''} sauvegardé{favorites.size > 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Empty state */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 md:py-32">
                <div className="w-16 h-16 bg-sand border border-warm-border rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-warm-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <p className="font-display text-2xl italic text-warm-dark mb-2">Aucun produit trouvé</p>
                <p className="text-sm text-warm-gray mb-6">Essayez d'élargir vos critères de recherche.</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 border border-navy text-xs tracking-widest uppercase text-navy hover:bg-navy hover:text-cream transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {/* Highlighted sections when viewing all */}
                {shopCategory === 'all' && (
                  <>
                    {/* ── Nouveautés strip ── */}
                    {PRODUCTS.filter(p => p.isNew).length > 0 && (
                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-5 bg-teal px-4 py-3">
                          <h2 className="font-display text-2xl font-black uppercase tracking-wide text-cream flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cream animate-pulse-dot" />
                            Nouveautés
                          </h2>
                          <button
                            onClick={() => setShopCategory('new')}
                            className="text-[10px] tracking-widest uppercase text-cream/80 hover:text-cream transition-colors font-bold flex items-center gap-1"
                          >
                            Voir tout
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                          {PRODUCTS.filter(p => p.isNew).slice(0, 4).map(p => (
                            <ProductCard key={p.id} product={p} favorite={favorites.has(p.id)} onFavoriteToggle={toggleFavorite} />
                          ))}
                        </div>
                        <div className="border-b border-warm-border mt-10" />
                      </div>
                    )}

                    {/* ── Promotions strip ── */}
                    {PRODUCTS.filter(p => p.isSale).length > 0 && (
                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-5 coral-gradient px-4 py-3">
                          <h2 className="font-display text-2xl font-black uppercase tracking-wide text-cream flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z" />
                            </svg>
                            Promotions
                          </h2>
                          <button onClick={() => setShopCategory('sale')}
                            className="text-[10px] tracking-widest uppercase text-cream/80 hover:text-cream transition-colors font-black">
                            Voir tout →
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                          {PRODUCTS.filter(p => p.isSale).slice(0, 4).map(p => (
                            <ProductCard key={p.id} product={p} favorite={favorites.has(p.id)} onFavoriteToggle={toggleFavorite} />
                          ))}
                        </div>
                        <div className="border-b border-warm-border mt-10" />
                      </div>
                    )}

                    {/* ── Best-Sellers strip ── */}
                    {PRODUCTS.filter(p => p.featured).length > 0 && (
                      <div className="mb-10">
                        <div className="flex items-center justify-between mb-5 bg-navy px-4 py-3">
                          <h2 className="font-display text-2xl font-black uppercase tracking-wide text-cream flex items-center gap-2">
                            <svg className="w-4 h-4 text-amber" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01z" />
                            </svg>
                            Best-Sellers
                          </h2>
                          <button onClick={() => setShopCategory('bestsellers')}
                            className="text-[10px] tracking-widest uppercase text-silver/60 hover:text-silver transition-colors font-bold">
                            Voir tout →
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                          {PRODUCTS.filter(p => p.featured).slice(0, 4).map(p => (
                            <ProductCard key={p.id} product={p} favorite={favorites.has(p.id)} onFavoriteToggle={toggleFavorite} />
                          ))}
                        </div>
                        <div className="border-b border-warm-border mt-10" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-5 border-b-2 border-navy pb-3">
                      <h2 className="font-display text-2xl font-black uppercase tracking-wide text-navy">
                        Tous les produits
                      </h2>
                    </div>
                  </>
                )}

                {/* Main product grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {filtered.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      favorite={favorites.has(product.id)}
                      onFavoriteToggle={toggleFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in lg:hidden">
          <div className="absolute inset-0 bg-navy-mid/50 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          <div className="relative ml-auto w-80 max-w-[90vw] bg-cream h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 h-16 border-b border-warm-border shrink-0">
              <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-warm-dark">Filtres</span>
              <button onClick={() => setFilterOpen(false)} className="p-2 -mr-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterPanel compact />
            </div>
            <div className="px-6 py-4 border-t border-warm-border space-y-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 text-[11px] tracking-widest uppercase text-warm-gray border border-warm-border hover:border-warm-dark transition-colors"
                >
                  Réinitialiser ({activeFilterCount})
                </button>
              )}
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full bg-teal text-cream py-3.5 text-[11px] tracking-widest uppercase font-semibold hover:bg-teal-light hover:text-navy transition-colors"
              >
                Voir {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
