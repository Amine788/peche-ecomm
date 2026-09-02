import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, WHATSAPP_NUMBER } from '../data/products';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';

export default function Product() {
  const { currentProductId, navigate, addToCart } = useApp();
  const product = PRODUCTS.find(p => p.id === currentProductId);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-full pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl italic mb-4">Produit introuvable</p>
          <button onClick={() => navigate('shop')} className="text-sm underline">
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const relatedProducts = PRODUCTS.filter(
    p => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const handleAddToCart = () => {
    let hasError = false;
    if (!selectedSize && product.sizes.length > 0) { setSizeError(true); hasError = true; } else setSizeError(false);
    if (!selectedColor && product.colors.length > 0) { setColorError(true); hasError = true; } else setColorError(false);
    if (hasError) return;

    addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleWhatsApp = () => {
    if (product.sizes.length > 0 && !selectedSize) { setSizeError(true); return; }
    if (product.colors.length > 0 && !selectedColor) { setColorError(true); return; }
    const msg = encodeURIComponent(
      `Bonjour, je souhaite commander :\n\n` +
      `Produit : ${product.name}\n` +
      `Taille : ${selectedSize}\n` +
      `Couleur : ${selectedColor}\n` +
      `Quantité : ${quantity}\n` +
      `Prix : ${displayPrice} MAD\n` +
      `Total : ${displayPrice * quantity} MAD\n\n` +
      `Nom :\nTéléphone :\nVille :\nAdresse :`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-full pt-24 md:pt-28">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-warm-border/40">
        <nav className="flex items-center gap-2 text-xs text-warm-gray">
          <button onClick={() => navigate('home')} className="hover:text-navy transition-colors">Accueil</button>
          <span className="text-warm-border">/</span>
          <button onClick={() => navigate('shop')} className="hover:text-navy transition-colors">Boutique</button>
          <span className="text-warm-border">/</span>
          <span className="text-navy font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20 pt-6">

          {/* ── Gallery — left ── */}
          <div className="flex flex-col-reverse md:flex-row gap-3">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-none">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-20 overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i
                        ? 'border-navy shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} — vue ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Main image */}
            <div className="flex-1 aspect-[3/4] overflow-hidden bg-sand relative group">
              <img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-ocean text-cream text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 font-bold">
                    Nouveau
                  </span>
                )}
                {product.isSale && discount > 0 && (
                  <span className="bg-gold text-cream text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 font-bold">
                    -{discount}%
                  </span>
                )}
              </div>
              {/* Image nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(i => Math.max(0, i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass-navy flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={selectedImage === 0}
                  >
                    <svg className="w-4 h-4 text-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImage(i => Math.min(product.images.length - 1, i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass-navy flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={selectedImage === product.images.length - 1}
                  >
                    <svg className="w-4 h-4 text-cream" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Details — right (sticky) ── */}
          <div className="flex flex-col md:sticky md:top-24 md:self-start">
            <p className="text-xs tracking-[0.35em] uppercase text-teal font-semibold mb-2">
              {product.category.replace('-', ' ')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-2xl font-bold ${product.isSale ? 'text-gold' : 'text-navy'}`}>
                {displayPrice.toLocaleString('fr-MA')} MAD
              </span>
              {product.salePrice && (
                <>
                  <span className="text-warm-gray line-through text-lg">
                    {product.price.toLocaleString('fr-MA')} MAD
                  </span>
                  <span className="bg-gold/15 text-gold text-xs font-bold px-2 py-0.5">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-success' : product.stock > 0 ? 'bg-amber' : 'bg-error'}`} />
              <p className="text-xs text-warm-gray">
                {product.stock > 5 ? 'En stock' : product.stock > 0 ? `Plus que ${product.stock} en stock !` : 'Rupture de stock'}
              </p>
            </div>

            <p className="text-warm-gray text-sm leading-relaxed mb-7">{product.description}</p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-[0.2em] uppercase font-semibold text-navy">
                    Couleur {selectedColor && <span className="text-warm-gray font-normal normal-case tracking-normal">— {selectedColor}</span>}
                  </p>
                  {colorError && <p className="text-error text-xs font-medium">Sélectionnez une couleur</p>}
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => { setSelectedColor(color.name); setColorError(false); }}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color.name
                          ? 'border-navy scale-125 shadow-md ring-2 ring-navy/20 ring-offset-1'
                          : 'border-warm-border hover:border-warm-gray hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-[0.2em] uppercase font-semibold text-navy">Taille</p>
                  <div className="flex items-center gap-3">
                    {sizeError && <p className="text-error text-xs font-medium">Sélectionnez une taille</p>}
                    <button
                      onClick={() => setDetailsOpen(!detailsOpen)}
                      className="text-xs underline underline-offset-2 text-teal hover:text-teal-dark transition-colors"
                    >
                      Guide des tailles
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`px-4 py-2.5 text-sm border-2 transition-all duration-200 font-medium ${
                        selectedSize === size
                          ? 'border-navy bg-navy text-cream'
                          : 'border-warm-border hover:border-navy text-navy'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs tracking-[0.2em] uppercase font-semibold mb-3 text-navy">Quantité</p>
              <div className="flex items-center gap-0 border-2 border-warm-border w-fit">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-sand transition-colors text-navy text-lg font-light"
                >
                  −
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-sm font-bold border-x-2 border-warm-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-sand transition-colors text-navy text-lg font-light"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 text-xs tracking-[0.35em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                  added
                    ? 'bg-success text-cream'
                    : product.stock === 0
                    ? 'bg-warm-border text-warm-gray cursor-not-allowed'
                    : 'sea-gradient text-cream hover:opacity-90 active:scale-[0.98]'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Ajouté au panier
                  </>
                ) : product.stock === 0 ? (
                  'Rupture de stock'
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    Ajouter au panier
                  </>
                )}
              </button>
              <button
                onClick={handleWhatsApp}
                className="w-full py-4 text-xs tracking-[0.3em] uppercase font-semibold border-2 border-navy text-navy hover:bg-navy hover:text-cream transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Commander via WhatsApp
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 pb-6 border-b border-warm-border/40 mb-6">
              {[
                { icon: '🚚', text: 'Livraison 39 MAD' },
                { icon: '💳', text: 'Paiement à la livraison' },
                { icon: '🔄', text: 'Échange 14 jours' },
              ].map(badge => (
                <div key={badge.text} className="flex items-center gap-1.5 text-[10px] text-warm-gray">
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="divide-y divide-warm-border/40">
              {[
                {
                  label: 'Description & Matières',
                  open: detailsOpen,
                  toggle: () => setDetailsOpen(!detailsOpen),
                  content: (
                    <div className="text-sm text-warm-gray leading-relaxed space-y-2">
                      <p>{product.description}</p>
                      <p>• Tissu : 80% Polyamide, 20% Élasthane</p>
                      <p>• Résistant au chlore et aux UV</p>
                      <p>• Lavage à la main recommandé</p>
                    </div>
                  ),
                },
                {
                  label: 'Livraison & Échanges',
                  open: shippingOpen,
                  toggle: () => setShippingOpen(!shippingOpen),
                  content: (
                    <div className="text-sm text-warm-gray leading-relaxed space-y-2">
                      <p>• Livraison à domicile partout au Maroc : 39 MAD</p>
                      <p>• Livraison gratuite dès 800 MAD</p>
                      <p>• Délai : 2 à 5 jours ouvrables</p>
                      <p>• Échange sous 14 jours dans leur emballage d'origine</p>
                    </div>
                  ),
                },
              ].map(({ label, open, toggle, content }) => (
                <div key={label}>
                  <button
                    onClick={toggle}
                    className="w-full flex items-center justify-between py-4 text-sm font-semibold tracking-wide text-left text-navy hover:text-teal transition-colors"
                  >
                    {label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-4' : 'max-h-0'}`}
                  >
                    {content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28">
            <ScrollReveal className="text-center mb-10">
              <p className="text-xs tracking-[0.3em] uppercase text-teal mb-2 font-semibold">Vous aimerez aussi</p>
              <h2 className="font-display text-3xl md:text-4xl italic text-navy">Produits similaires</h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 80} direction="up">
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
