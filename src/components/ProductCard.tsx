import { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface Props {
  product: Product;
  favorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

export default function ProductCard({ product, favorite = false, onFavoriteToggle }: Props) {
  const { navigate, addToCart } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [wishlistFeedback, setWishlistFeedback] = useState(false);

  const displayPrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleMouseEnter = () => {
    if (product.images.length > 1) setImgIdx(1);
  };
  const handleMouseLeave = () => {
    setImgIdx(0);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart({
      product,
      size: product.sizes[0] ?? '',
      color: product.colors[0]?.name ?? '',
      quantity: 1,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) onFavoriteToggle(product.id);
    setWishlistFeedback(true);
    setTimeout(() => setWishlistFeedback(false), 1000);
  };

  return (
    <article
      className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
      onClick={() => navigate('product', { productId: product.id })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container — Rounded inner frame */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 mb-3.5">
        {/* Images */}
        {product.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? product.name : `${product.name} — vue ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imgIdx === i ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        ))}

        {/* Badges — Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isSale && discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] tracking-wider uppercase font-black px-2.5 py-1 rounded-full shadow-md">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-teal-600 text-white text-[10px] tracking-wider uppercase font-black px-2.5 py-1 rounded-full shadow-md">
              Nouveau
            </span>
          )}
          {product.featured && !product.isNew && (
            <span className="bg-amber-500 text-white text-[10px] tracking-wider uppercase font-black px-2.5 py-1 rounded-full shadow-md">
              ★ Best-seller
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-slate-700 text-white text-[10px] tracking-wider uppercase font-black px-2.5 py-1 rounded-full shadow-md">
              Épuisé
            </span>
          )}
        </div>

        {/* Wishlist Button — Top Right */}
        {onFavoriteToggle && (
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all duration-200 ${
              favorite || wishlistFeedback
                ? 'bg-amber-500 text-white scale-110'
                : 'bg-white/80 hover:bg-white text-slate-600 hover:text-amber-500 hover:scale-110'
            }`}
            aria-label="Ajouter aux favoris"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill={favorite || wishlistFeedback ? 'currentColor' : 'none'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={e => { e.stopPropagation(); navigate('product', { productId: product.id }); }}
            className="w-full bg-slate-900/90 backdrop-blur-md text-white py-2.5 rounded-xl text-xs tracking-wider uppercase font-bold hover:bg-slate-900 transition-colors shadow-lg"
          >
            Aperçu rapide
          </button>
        </div>
      </div>

      {/* Info Content Container — Generous Spacing */}
      <div className="flex flex-col flex-1 px-1 pt-1 pb-0.5 justify-between">
        <div className="space-y-1.5">
          {/* Category Tag */}
          <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Color Swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.slice(0, 5).map(color => (
                <span
                  key={color.name}
                  title={color.name}
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 hover:scale-125 transition-transform duration-150 cursor-pointer shadow-xs"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[10px] text-slate-400 font-semibold">+ {product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section: Separator + Price + Quick Add Button */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base sm:text-lg font-black ${product.isSale ? 'text-red-600' : 'text-slate-900'}`}>
                {displayPrice.toLocaleString('fr-MA')} <span className="text-xs font-bold">MAD</span>
              </span>
            </div>
            {product.salePrice && (
              <span className="text-xs text-slate-400 line-through font-normal tabular-nums">
                {product.price.toLocaleString('fr-MA')} MAD
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          {product.stock > 0 ? (
            <button
              onClick={handleQuickAdd}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-md ${
                addedFeedback
                  ? 'bg-emerald-600 scale-110'
                  : 'bg-slate-900 hover:bg-teal-600 hover:scale-110'
              }`}
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              {addedFeedback ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Épuisé
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
