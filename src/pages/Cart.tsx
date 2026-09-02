import { useApp } from '../context/AppContext';
import { FREE_SHIPPING_THRESHOLD } from '../data/products';

export default function Cart() {
  const {
    navigate,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartShipping,
    cartTotal,
  } = useApp();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-full pt-24 md:pt-28 flex items-center justify-center">
        <div className="text-center px-4 py-24">
          <svg className="w-16 h-16 mx-auto text-warm-border mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <p className="font-display text-3xl italic mb-3">Votre panier est vide</p>
          <p className="text-warm-gray text-sm mb-8">Découvrez notre nouvelle collection.</p>
          <button
            onClick={() => navigate('shop')}
            className="sea-gradient text-cream px-10 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity"
          >
            Voir la boutique
          </button>
        </div>
      </div>
    );
  }

  const remaining = FREE_SHIPPING_THRESHOLD - cartSubtotal;

  return (
    <div className="min-h-full pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl italic mb-2">Votre panier</h1>
        <p className="text-warm-gray text-sm mb-10">
          {cartItems.reduce((s, i) => s + i.quantity, 0)} article{cartItems.reduce((s, i) => s + i.quantity, 0) > 1 ? 's' : ''}
        </p>

        {/* Free shipping progress */}
        {remaining > 0 && (
          <div className="mb-8 bg-sand p-4">
            <p className="text-xs text-warm-gray mb-2">
              Plus que <strong className="text-warm-dark">{remaining} MAD</strong> pour bénéficier de la livraison gratuite
            </p>
            <div className="h-1 bg-warm-border rounded-full overflow-hidden">
              <div
                className="h-full bg-warm-dark rounded-full transition-all"
                style={{ width: `${Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
        )}
        {remaining <= 0 && (
          <div className="mb-8 bg-success/10 border border-success/20 p-4 text-success text-sm font-semibold flex items-center gap-2">
            <span>✓</span> Livraison gratuite appliquée !
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0 divide-y divide-warm-border border-t border-warm-border">
            {cartItems.map((item, index) => {
              const price = item.product.salePrice ?? item.product.price;
              return (
                <div key={index} className="flex gap-4 py-6">
                  {/* Image */}
                  <button
                    onClick={() => navigate('product', { productId: item.product.id })}
                    className="shrink-0 w-20 h-26 md:w-24 md:h-32 overflow-hidden bg-sand"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </button>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg leading-tight">{item.product.name}</h3>
                        <p className="text-xs text-warm-gray mt-0.5">
                          {item.size} · {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="shrink-0 text-warm-gray hover:text-warm-dark transition-colors p-1"
                        aria-label="Supprimer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty */}
                      <div className="flex items-center border border-warm-border">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-sand transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-warm-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-sand transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      {/* Price */}
                      <p className="font-semibold text-sm">
                        {(price * item.quantity).toLocaleString('fr-MA')} MAD
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-sand p-6 sticky top-24">
              <h2 className="font-display text-xl mb-6">Récapitulatif</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-gray">Sous-total</span>
                  <span>{cartSubtotal.toLocaleString('fr-MA')} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray">Livraison</span>
                  <span className={cartShipping === 0 ? 'text-success font-semibold' : ''}>
                    {cartShipping === 0 ? 'Gratuite' : `${cartShipping} MAD`}
                  </span>
                </div>
                <div className="border-t border-warm-border pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{cartTotal.toLocaleString('fr-MA')} MAD</span>
                </div>
              </div>

              <button
                onClick={() => navigate('checkout')}
                className="w-full sea-gradient text-cream mt-6 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity"
              >
                Passer la commande
              </button>

              <button
                onClick={() => navigate('shop')}
                className="w-full mt-3 py-3 text-xs tracking-wider uppercase text-warm-gray hover:text-warm-dark transition-colors"
              >
                ← Continuer mes achats
              </button>

              {/* Reassurance */}
              <div className="mt-6 space-y-2 text-xs text-warm-gray">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Paiement sécurisé à la livraison
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" rx="1" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Livraison 2-5 jours ouvrables
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Partout au Maroc
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
