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
  const [isHovered, setIsHovered] = useState(false);

  const displayPrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.images.length > 1) setImgIdx(1);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
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
      className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-warm-border/30 hover:border-teal/20"
      onClick={() => navigate('product', { productId: product.id })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image area */}
      <div className="relative overflow-hidden bg-sand aspect-[4/5]">
        {/* Images — crossfade */}
        {product.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? product.name : `${product.name} — vue ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-600 ${
              imgIdx === i ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
            }`}
            loading="lazy"
          />
        ))}

        {/* Gradient vignette bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges — top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isSale && discount > 0 && (
            <span className="bg-coral text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-black leading-none rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-teal text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-black leading-none rounded-full shadow-sm">
              Nouveau
            </span>
          )}
          {product.featured && !product.isNew && (
            <span className="bg-amber text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-black leading-none rounded-full shadow-sm">
              ★ Top
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-warm-gray/90 text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-black leading-none rounded-full">
              Épuisé
            </span>
          )}
        </div>

        {/* Wishlist button — top right */}
        {onFavoriteToggle && (
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
              favorite || wishlistFeedback
                ? 'bg-gold/90 text-white scale-110'
                : 'bg-white/90 text-warm-gray hover:bg-white hover:text-gold hover:scale-110'
            }`}
            aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <svg
              className="w-4 h-4 transition-all duration-300"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill={favorite || wishlistFeedback ? 'currentColor' : 'none'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        )}

        {/* Image nav dots */}
        {product.images.length > 1 && isHovered && (
          <div className="absolute bottom-[60px] left-0 right-0 flex justify-center gap-1.5 z-10 animate-fade-in">
            {product.images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${imgIdx === i ? 'bg-white scale-150' : 'bg-white/60 hover:bg-white/90'}`}
              />
            ))}
          </div>
        )}

        {/* Quick actions — slides up on hover */}
        <div className={`absolute inset-x-0 bottom-0 flex transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <button
            onClick={e => { e.stopPropagation(); navigate('product', { productId: product.id }); }}
            className="flex-1 bg-navy/95 backdrop-blur-sm text-cream py-3.5 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-navy transition-colors"
          >
            Voir le produit
          </button>
          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className={`w-14 flex items-center justify-center text-white transition-all duration-300 ${
                addedFeedback ? 'bg-teal' : 'bg-teal/80 hover:bg-teal'
              }`}
              aria-label="Ajouter au panier"
            >
              {addedFeedback ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Info area — generous padding */}
      <div className="flex flex-col flex-1 p-4 md:p-5 gap-2">

        {/* Category tag */}
        <p className="text-[9px] text-warm-gray tracking-[0.3em] uppercase font-semibold">
          {product.category}
        </p>

        {/* Product name */}
        <h3 className="font-display text-[15px] md:text-base font-semibold text-navy leading-snug group-hover:text-teal transition-colors duration-200 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex gap-1.5 items-center pt-1">
            {product.colors.slice(0, 6).map(color => (
              <span
                key={color.name}
                title={color.name}
                className="w-3.5 h-3.5 rounded-full border border-warm-border/60 hover:scale-125 transition-transform duration-150 cursor-pointer shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 6 && (
              <span className="text-[10px] text-warm-gray ml-0.5">+{product.colors.length - 6}</span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-warm-border/30 my-1" />

        {/* Price row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-bold ${product.isSale ? 'text-coral' : 'text-navy'}`}>
              {displayPrice.toLocaleString('fr-MA')} <span className="text-xs font-semibold">MAD</span>
            </span>
            {product.salePrice && (
              <span className="text-xs text-warm-gray line-through tabular-nums">
                {product.price.toLocaleString('fr-MA')}
              </span>
            )}
          </div>
          {/* Stock indicator */}
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            product.stock > 5
              ? 'bg-teal/10 text-teal'
              : product.stock > 0
              ? 'bg-amber/10 text-amber'
              : 'bg-error/10 text-error'
          }`}>
            {product.stock > 5 ? 'En stock' : product.stock > 0 ? `${product.stock} restant${product.stock > 1 ? 's' : ''}` : 'Épuisé'}
          </span>
        </div>
      </div>
    </article>
  );
}
