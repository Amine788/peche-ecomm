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

  // Cycle image on hover
  const handleMouseEnter = () => {
    if (product.images.length > 1) setImgIdx(1);
  };
  const handleMouseLeave = () => setImgIdx(0);

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
      className="card-premium group cursor-pointer"
      onClick={() => navigate('product', { productId: product.id })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-sand aspect-[3/4] mb-3">
        {/* Images — crossfade */}
        {product.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? product.name : `${product.name} — vue ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              imgIdx === i ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            loading="lazy"
          />
        ))}

        {/* Image dots (on hover if multiple images) */}
        {product.images.length > 1 && (
          <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {product.images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${imgIdx === i ? 'bg-cream scale-150' : 'bg-cream/50 hover:bg-cream/80'}`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isSale && discount > 0 && (
            <span className="bg-gold text-cream text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 font-bold leading-none">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-ocean text-cream text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 font-bold leading-none">
              Nouveau
            </span>
          )}
          {product.featured && !product.isNew && (
            <span className="bg-navy-light text-gold text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 font-bold leading-none">
              ★ Best-seller
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-warm-gray text-cream text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 font-bold leading-none">
              Épuisé
            </span>
          )}
        </div>

        {/* Wishlist button */}
        {onFavoriteToggle && (
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
              favorite ? 'bg-gold/20 border border-gold/40' : 'bg-cream/80 hover:bg-cream'
            }`}
            aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                favorite || wishlistFeedback ? 'text-gold fill-gold scale-125' : 'text-warm-dark fill-none scale-100'
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        )}

        {/* Quick Add button — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 flex">
          <button
            onClick={e => { e.stopPropagation(); navigate('product', { productId: product.id }); }}
            className="flex-1 bg-navy-mid/90 backdrop-blur-sm text-cream py-3 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-navy transition-colors border-r border-teal/20"
          >
            Voir le produit
          </button>
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className={`w-12 flex items-center justify-center text-cream transition-all duration-300 ${
                addedFeedback
                  ? 'bg-teal'
                  : 'bg-navy-light/90 backdrop-blur-sm hover:bg-teal'
              }`}
              aria-label="Ajouter au panier"
              title="Ajouter au panier"
            >
              {addedFeedback ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Subtle image shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-[10px] text-warm-gray tracking-[0.25em] uppercase">
          {product.category}
        </p>
        <h3 className="font-display text-base md:text-[17px] leading-snug group-hover:text-ocean transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className={`text-sm font-semibold ${product.isSale ? 'text-gold' : 'text-warm-dark'}`}>
            {displayPrice.toLocaleString('fr-MA')} MAD
          </span>
          {product.salePrice && (
            <span className="text-xs text-warm-gray line-through tabular-nums">
              {product.price.toLocaleString('fr-MA')} MAD
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex gap-1.5 pt-0.5">
            {product.colors.slice(0, 5).map(color => (
              <span
                key={color.name}
                title={color.name}
                className="w-3 h-3 rounded-full border border-warm-border/80 ring-offset-1 hover:scale-125 transition-transform duration-150 cursor-pointer"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-warm-gray leading-3 pt-0.5">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
