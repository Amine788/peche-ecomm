import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import { CATEGORIES } from '../data/categories';
import { useScrollY } from '../hooks/useScrollY';

export default function Navbar() {
  const { navigate, cartCount, setShopCategory, currentPage } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const scrollY = useScrollY();

  const scrolled = scrollY > 40;
  const isHome = currentPage === 'home';
  const hasSolidHeader = scrolled || !isHome;

  const handleNav = (
    page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'confirmation' | 'admin',
    category?: string,
  ) => {
    if (category) setShopCategory(category);
    navigate(page);
    setMenuOpen(false);
    setCatOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hasSolidHeader
            ? 'glass-navy shadow-xl shadow-navy/30 border-b border-teal/15'
            : 'bg-gradient-to-b from-noir/85 via-noir/40 to-transparent border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16 md:h-20' : 'h-20 md:h-24'}`}>

            {/* ── Logo — gauche ── */}
            <button
              onClick={() => handleNav('home')}
              aria-label="Accueil IKKA DEL MAR"
              className="flex items-center gap-3 group shrink-0"
            >
              <Logo size={scrolled ? 'sm' : 'md'} variant="gold" />
            </button>

            {/* ── Navigation desktop — parfaitement centrée ── */}
            <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">

              {/* Accueil */}
              <button
                onClick={() => handleNav('home')}
                className="relative px-5 py-2 text-[11px] tracking-[0.25em] uppercase font-semibold text-cream/70 hover:text-cream transition-colors group"
              >
                Accueil
                <span className="absolute bottom-1 left-5 right-5 h-px bg-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>

              {/* Boutique */}
              <button
                onClick={() => handleNav('shop', 'all')}
                className="relative px-5 py-2 text-[11px] tracking-[0.25em] uppercase font-semibold text-cream/70 hover:text-cream transition-colors group"
              >
                Boutique
                <span className="absolute bottom-1 left-5 right-5 h-px bg-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>

              {/* Nouveautés */}
              <button
                onClick={() => handleNav('shop', 'new')}
                className="relative px-5 py-2 text-[11px] tracking-[0.25em] uppercase font-semibold text-cream/70 hover:text-cream transition-colors group flex items-center gap-2"
              >
                Nouveautés
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-dot shrink-0" />
                <span className="absolute bottom-1 left-5 right-5 h-px bg-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>

              {/* Catégories — mega menu */}
              <div
                className="relative"
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
              >
                <button className="relative px-5 py-2 text-[11px] tracking-[0.25em] uppercase font-semibold text-cream/70 hover:text-cream transition-colors group flex items-center gap-1.5">
                  Catégories
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  <span className="absolute bottom-1 left-5 right-5 h-px bg-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>

                {/* Mega dropdown */}
                {catOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-2 animate-slide-down">
                    <div className="glass-navy shadow-2xl rounded-sm overflow-hidden w-[340px]">
                      <div className="px-4 pt-4 pb-2">
                        <p className="text-[9px] tracking-[0.5em] uppercase text-teal/60 font-bold mb-3">Toutes les catégories</p>
                      </div>
                      <div className="grid grid-cols-2 gap-px bg-teal/10">
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleNav('shop', cat.id)}
                            className="bg-navy/80 hover:bg-teal/10 px-4 py-3 text-left transition-colors group/cat"
                          >
                            <span className="text-[11px] tracking-wider uppercase text-cream/60 group-hover/cat:text-cream transition-colors font-medium">
                              {cat.name}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="px-4 py-3 border-t border-teal/10">
                        <button
                          onClick={() => handleNav('shop', 'all')}
                          className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold hover:text-teal-light transition-colors flex items-center gap-2"
                        >
                          Voir tout le catalogue
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Soldes */}
              <button
                onClick={() => handleNav('shop', 'sale')}
                className="ml-2 px-4 py-1.5 border border-coral/50 text-coral text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-coral hover:text-cream transition-all duration-200 flex items-center gap-1.5 rounded-sm"
              >
                <span className="w-1 h-1 rounded-full bg-coral animate-pulse-dot" />
                Soldes
              </button>
            </nav>

            {/* ── Actions — droite ── */}
            <div className="flex items-center gap-3 shrink-0">

              {/* Admin — discret */}
              <button
                onClick={() => handleNav('admin')}
                className="hidden md:block text-[9px] tracking-[0.3em] uppercase text-cream/20 hover:text-cream/40 transition-colors"
              >
                Admin
              </button>

              {/* Panier */}
              <button
                onClick={() => handleNav('cart')}
                className="relative flex items-center justify-center w-10 h-10 border border-cream/15 hover:border-teal/50 hover:bg-teal/10 transition-all duration-200 group rounded-sm"
                aria-label={`Panier (${cartCount} article${cartCount !== 1 ? 's' : ''})`}
              >
                <svg className="w-4.5 h-4.5 text-cream/60 group-hover:text-cream transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-teal text-cream text-[9px] font-black rounded-full flex items-center justify-center leading-none px-1">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger mobile */}
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
                aria-label="Ouvrir le menu"
              >
                <span className="block w-5 h-[1.5px] bg-cream/80 transition-all" />
                <span className="block w-5 h-[1.5px] bg-cream/80" />
                <span className="block w-3 h-[1.5px] bg-cream/80 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile fullscreen menu ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-noir/90 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
          />

          {/* Panel */}
          <div className="relative h-full w-[320px] max-w-[90vw] bg-navy flex flex-col shadow-2xl border-r border-teal/15">

            {/* Header du menu */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-teal/15">
              <Logo size="sm" variant="gold" />
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center border border-cream/15 text-cream/50 hover:text-cream hover:border-cream/40 transition-all rounded-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation mobile */}
            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">

              {[
                { label: 'Accueil', page: 'home' as const },
                { label: 'Toute la boutique', page: 'shop' as const, cat: 'all' },
                { label: 'Nouveautés', page: 'shop' as const, cat: 'new', dot: true },
                { label: 'Soldes', page: 'shop' as const, cat: 'sale', coral: true },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => handleNav(item.page, item.cat)}
                  className={`w-full text-left py-3.5 px-3 text-sm tracking-wide border-b border-cream/8 transition-colors flex items-center gap-2 ${
                    item.coral ? 'text-coral font-semibold' : 'text-cream/70 hover:text-cream'
                  }`}
                >
                  {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-dot" />}
                  {item.label}
                </button>
              ))}

              {/* Catégories */}
              <div className="pt-4">
                <p className="text-[9px] tracking-[0.5em] uppercase text-teal/60 font-bold mb-3 px-3">Catégories</p>
                <div className="space-y-0.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleNav('shop', cat.id)}
                      className="w-full text-left py-2.5 px-3 text-xs tracking-wide text-cream/50 hover:text-cream hover:bg-teal/5 border-b border-cream/5 transition-colors"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Panier mobile */}
            <div className="px-6 py-4 border-t border-teal/15">
              <button
                onClick={() => handleNav('cart')}
                className="w-full py-3 flex items-center justify-center gap-2 border border-teal/40 text-teal text-xs tracking-[0.3em] uppercase font-bold hover:bg-teal hover:text-cream transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Panier {cartCount > 0 && `(${cartCount})`}
              </button>
              <button
                onClick={() => handleNav('admin')}
                className="w-full text-center mt-3 text-[9px] text-cream/20 tracking-widest uppercase hover:text-cream/40 transition-colors"
              >
                Administration
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
