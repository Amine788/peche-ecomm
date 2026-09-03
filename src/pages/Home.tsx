import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import CategoryCarousel from '../components/CategoryCarousel';
import ScrollReveal from '../components/ScrollReveal';

const INSTAGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1605499668117-5ae480112f54?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1593974595229-2fe505c273b5?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1601226041388-8bbabdd6e37e?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1483899528283-bc33678e9153?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1634540391897-f7929a7674ba?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1607524191306-7fec3d6b44b6?w=400&h=400&fit=crop&auto=format',
];

const STATS = [
  { value: '79+', label: 'Produits disponibles' },
  { value: '9',   label: 'Catégories' },
  { value: '39',  label: 'MAD livraison Maroc' },
  { value: '100%', label: 'Paiement à la livraison' },
];

const WHY_ITEMS = [
  {
    icon: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    title: 'Qualité garantie',
    desc: 'Sélection rigoureuse des meilleures marques et matériaux disponibles sur le marché.',
  },
  {
    icon: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    title: 'Livraison rapide',
    desc: '2 à 5 jours ouvrables partout au Maroc. Livraison gratuite dès 600 MAD.',
  },
  {
    icon: <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    title: 'Conseil expert',
    desc: "Notre équipe de pêcheurs passionnés vous conseille par WhatsApp 7j/7.",
  },
  {
    icon: <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    title: 'Paiement à la livraison',
    desc: "Payez uniquement à la réception de votre commande. Aucune avance requise.",
  },
];

export default function Home() {
  const { navigate, setShopCategory } = useApp();

  const newProducts = PRODUCTS.filter(p => p.isNew).slice(0, 4);
  const featuredProducts = PRODUCTS.filter(p => p.featured).slice(0, 4);
  const saleProducts = PRODUCTS.filter(p => p.isSale).slice(0, 4);

  const goShop = (cat?: string) => {
    setShopCategory(cat ?? 'all');
    navigate('shop');
  };

  return (
    <div className="min-h-full">

      {/* ── HERO — Photo premium ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden bg-noir flex items-end">
        {/* Photo plein écran haute qualité */}
        <img
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&auto=format&q=90"
          alt="IKKA DEL MAR — mer turquoise Maroc"
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[slowZoom_12s_ease-out_forwards]"
        />

        {/* Gradient overlay multicouche */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-navy/50 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/60 via-transparent to-transparent" />

        {/* Ambient glow subtil */}
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-teal/8 blur-[150px] pointer-events-none" />

        {/* Hero content — en bas à gauche, style Apple */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28 w-full">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-[11px] tracking-[0.6em] uppercase text-teal-light mb-6 font-bold flex items-center gap-3">
              <span className="w-8 h-px bg-teal-light" />
              Boating · Fishing · Spearfishing — Maroc
            </p>
            <h1 className="font-display font-black uppercase leading-none mb-1 tracking-tight">
              <span className="block text-7xl sm:text-8xl md:text-[9rem] text-cream">IKKA</span>
              <span className="block text-6xl sm:text-7xl md:text-8xl text-gradient-ocean italic">DEL MAR</span>
            </h1>
            <p className="text-base md:text-lg text-blue-glow/75 mt-6 mb-10 max-w-md leading-relaxed">
              Équipement de pêche professionnel — Cannes, moulinets, leurres, combinaisons.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => goShop()}
                className="bg-teal text-cream px-10 py-4 text-[11px] tracking-[0.35em] uppercase font-black hover:bg-teal-light hover:text-navy transition-all duration-200"
              >
                Explorer le catalogue
              </button>
              <button
                onClick={() => goShop('sale')}
                className="coral-gradient text-cream px-8 py-4 text-[11px] tracking-[0.3em] uppercase font-black hover:opacity-90 transition-opacity"
              >
                Soldes
              </button>
              <button
                onClick={() => goShop('new')}
                className="border border-teal/50 text-cream px-8 py-4 text-[11px] tracking-[0.3em] uppercase font-bold hover:border-teal hover:bg-teal/10 transition-all flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-light animate-pulse-dot" />
                Nouveautés
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-3 text-cream/40 animate-fade-up delay-400">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-cream/40" />
          <span className="text-[9px] tracking-[0.5em] uppercase rotate-90 origin-center mt-2">Scroll</span>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="sea-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`py-6 px-4 text-center ${i < 3 ? 'border-r border-cream/20' : ''}`}>
                <p className="font-display text-3xl md:text-4xl font-black text-cream">{stat.value}</p>
                <p className="text-[10px] text-cream/70 tracking-wider uppercase mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NOUVEAUTÉS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <ScrollReveal className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-7 bg-teal" />
              <p className="text-[10px] tracking-[0.45em] uppercase text-teal font-bold flex items-center gap-2">
                Dernières arrivées
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-dot" />
              </p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-navy">Nouveautés</h2>
          </div>
          <button
            onClick={() => goShop('new')}
            className="hidden sm:flex items-center gap-2 text-[11px] tracking-widest uppercase text-navy hover:text-teal transition-colors font-semibold border-b border-transparent hover:border-teal pb-0.5"
          >
            Voir tout
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </ScrollReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 80} direction="up">
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-8 sm:hidden text-center">
          <button onClick={() => goShop('new')} className="text-xs tracking-widest uppercase border-b border-navy pb-0.5 text-navy hover:text-blue transition-colors">
            Voir toutes les nouveautés
          </button>
        </div>
      </section>

      {/* ── FISHING — Storytelling section ── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=900&fit=crop&auto=format"
          alt="IKKA DEL MAR — pêche en mer bleue professionnelle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent" />

        {/* Vertical chapter label */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-teal/40" />
          <span className="text-[9px] tracking-[0.6em] uppercase text-teal/60 rotate-90 origin-center my-4 whitespace-nowrap">Chapter 01</span>
          <div className="w-px h-16 bg-teal/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="right" className="max-w-xl">
            <p className="text-[10px] tracking-[0.5em] uppercase text-teal mb-5 font-bold">La Pêche</p>
            <h2 className="font-display text-5xl md:text-7xl text-cream font-black uppercase leading-none mb-6">
              FISHING<br />
              <span className="italic font-light text-4xl md:text-5xl text-teal-light">sans limites</span>
            </h2>
            <p className="text-cream/70 mb-8 leading-relaxed max-w-md">
              Du surfcasting au jigging, de la carpe à la truite, IKKA DEL MAR vous équipe avec le matériel qu'il vous faut pour chaque session, chaque mer, chaque défi.
            </p>
            <button
              onClick={() => goShop()}
              className="border border-cream/60 text-cream px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-cream hover:text-navy transition-all group flex items-center gap-3"
            >
              Découvrir l'équipement
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="bg-sea border-y border-teal/20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-7 bg-amber" />
                <p className="text-[10px] tracking-[0.45em] uppercase text-amber font-bold">Les plus vendus</p>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-navy">Best Sellers</h2>
            </div>
            <button
              onClick={() => goShop()}
              className="hidden sm:flex items-center gap-2 text-[11px] tracking-widest uppercase text-navy hover:text-amber transition-colors font-semibold border-b border-transparent hover:border-amber pb-0.5"
            >
              Voir tout
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 80} direction="up">
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SWIMMING — Storytelling section ── */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center">
        <img
          src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1920&h=900&fit=crop&auto=format"
          alt="IKKA DEL MAR — natation et équipement de plongée"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-navy/90 via-navy/60 to-transparent" />

        {/* Vertical chapter label */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-aqua/40" />
          <span className="text-[9px] tracking-[0.6em] uppercase text-aqua/60 rotate-90 origin-center my-4 whitespace-nowrap">Chapter 02</span>
          <div className="w-px h-16 bg-aqua/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end">
          <ScrollReveal direction="left" className="max-w-xl text-right">
            <p className="text-[10px] tracking-[0.5em] uppercase text-aqua mb-5 font-bold">La Mer</p>
            <h2 className="font-display text-5xl md:text-7xl text-cream font-black uppercase leading-none mb-6">
              SWIMMING<br />
              <span className="italic font-light text-4xl md:text-5xl text-teal-light">en profondeur</span>
            </h2>
            <p className="text-cream/70 mb-8 leading-relaxed">
              Palmes, masques, combinaisons, plongée libre. Équipez-vous pour explorer chaque recoin de la mer Méditerranée et de l'Atlantique marocain.
            </p>
            <button
              onClick={() => goShop('natation')}
              className="ml-auto border border-cream/60 text-cream px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-cream hover:text-navy transition-all group flex items-center gap-3 justify-end"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Voir la collection
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <CategoryCarousel onSelect={(id) => goShop(id)} variant="light" animated />

      {/* ── PROMOTIONS ── */}
      {saleProducts.length > 0 && (
        <section className="bg-slate-950 text-white py-20 md:py-28 relative overflow-hidden border-t border-slate-800">
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.3em] text-red-400 bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-full mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Offres Spéciales
                </span>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
                  PROMOTIONS
                </h2>
                <p className="text-slate-400 text-sm md:text-base mt-2 max-w-md">
                  Profitez de nos remises exclusives sur une sélection d'équipements de pêche et plongée.
                </p>
              </div>
              <button
                onClick={() => goShop('sale')}
                className="self-start md:self-auto bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-lg shadow-red-600/25 hover:scale-105 flex items-center gap-2"
              >
                Tout voir en promo
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </ScrollReveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 80}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY IKKA DEL MAR ── */}
      <section className="bg-navy py-20 md:py-24 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue/5 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-teal/60 mb-3">Pourquoi nous choisir</p>
            <h2 className="font-display text-4xl md:text-5xl text-cream italic font-light">Notre engagement</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_ITEMS.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100} direction="up">
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-teal/30 rounded-sm bg-teal/10 group-hover:border-teal/60 group-hover:bg-teal/15 transition-all duration-300">
                    <svg className="w-6 h-6 text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="font-display text-xl text-cream italic mb-2">{item.title}</h3>
                  <p className="text-cream/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM WALL ── */}
      <section className="py-12 md:py-16 bg-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-8">
            <p className="text-xs tracking-[0.4em] uppercase text-warm-gray mb-2">Suivez-nous</p>
            <a
              href="https://www.instagram.com/ikka_del_mar33_34"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-3xl md:text-4xl italic text-navy hover:text-teal transition-colors"
            >
              @ikka_del_mar33_34
            </a>
          </ScrollReveal>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
            {INSTAGRAM_IMAGES.map((src, i) => (
              <a
                key={i}
                href="https://www.instagram.com/ikka_del_mar33_34"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden group bg-sand"
              >
                <img
                  src={src}
                  alt={`IKKA DEL MAR Instagram — photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 text-cream opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
