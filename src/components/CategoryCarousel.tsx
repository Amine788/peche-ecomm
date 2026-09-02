import { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';

interface Props {
  onSelect: (id: string) => void;
  variant?: 'dark' | 'light';
  animated?: boolean;
}

const CARD_W = 220;
const CARD_H = 293;
const SPREAD = 195;

export default function CategoryCarousel({ onSelect, variant = 'dark', animated = false }: Props) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(!animated);
  const touchRef = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const total = CATEGORIES.length;

  useEffect(() => {
    if (!animated) return;
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animated]);

  const prev = () => setActive(i => Math.max(0, i - 1));
  const next = () => setActive(i => Math.min(total - 1, i + 1));

  const handleTouchStart = (e: React.TouchEvent) => { touchRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  const isDark = variant === 'dark';
  const bg = isDark ? 'navy-gradient' : 'sea-gradient';
  const headingColor = isDark ? 'text-cream' : 'text-cream';
  const subColor = isDark ? 'text-teal-light/60' : 'text-cream/50';
  const btnBorder = isDark
    ? 'border-teal/30 text-teal-light/60 hover:border-teal hover:text-teal-light'
    : 'border-cream/30 text-cream/60 hover:border-cream hover:text-cream';
  const dotActive = 'bg-teal-light w-6 h-1.5';
  const dotIdle = isDark ? 'bg-teal/20 hover:bg-teal/40 w-1.5 h-1.5' : 'bg-cream/30 hover:bg-cream/60 w-1.5 h-1.5';

  return (
    <div
      ref={sectionRef}
      className={`${bg} border-b border-teal-dark/20 py-14 overflow-hidden transition-all duration-1000 ${
        animated ? (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10') : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`flex items-end justify-between mb-10 transition-all duration-700 delay-200 ${
          animated ? (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6') : ''
        }`}>
          <div>
            <p className={`text-[10px] tracking-[0.45em] uppercase ${subColor} mb-2`}>IKKA DEL MAR</p>
            <h2 className={`font-display text-2xl md:text-4xl italic ${headingColor} leading-none`}>
              Explorer par catégorie
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prev} disabled={active === 0}
              className={`w-10 h-10 flex items-center justify-center border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${btnBorder}`}
              aria-label="Précédent"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={next} disabled={active === total - 1}
              className={`w-10 h-10 flex items-center justify-center border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${btnBorder}`}
              aria-label="Suivant"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3D Stage */}
        <div
          className={`relative mx-auto select-none transition-all duration-700 delay-300 ${
            animated ? (visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95') : ''
          }`}
          style={{ height: CARD_H + 40, perspective: '1100px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {CATEGORIES.map((cat, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            const sign = offset < 0 ? -1 : 1;
            const isCenter = offset === 0;

            const tx = offset * SPREAD;
            const ry = isCenter ? 0 : sign * Math.min(abs * 38, 72);
            const scale = isCenter ? 1 : Math.max(0.52, 1 - abs * 0.19);
            const opacity = isCenter ? 1 : Math.max(0.18, 1 - abs * 0.28);
            const z = 20 - abs * 3;
            const count = PRODUCTS.filter(p => p.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => isCenter ? onSelect(cat.id) : setActive(i)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: CARD_W,
                  height: CARD_H,
                  marginLeft: -CARD_W / 2,
                  transform: `translateX(${tx}px) rotateY(${ry}deg) scale(${scale})`,
                  opacity,
                  zIndex: z,
                  transition: 'all 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                }}
                role="button"
                aria-label={cat.name}
              >
                <div className="relative w-full h-full overflow-hidden bg-warm-gray/30">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isCenter ? 'scale-100' : 'scale-110'}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                  {isCenter && (
                    <div className="absolute inset-0 ring-1 ring-teal/60 pointer-events-none" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {isCenter && (
                      <p className="text-[9px] tracking-[0.3em] uppercase text-teal-light font-semibold mb-1">
                        {count} produits
                      </p>
                    )}
                    <p className={`font-display italic leading-tight text-cream transition-all ${isCenter ? 'text-lg' : 'text-sm'}`}>
                      {cat.name}
                    </p>
                    {isCenter && (
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-cream/60">
                        <span>Explorer</span>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className={`flex justify-center gap-1.5 mt-8 transition-all duration-700 delay-500 ${
          animated ? (visible ? 'opacity-100' : 'opacity-0') : ''
        }`}>
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? dotActive : dotIdle}`}
              aria-label={`Catégorie ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
