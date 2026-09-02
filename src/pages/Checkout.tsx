import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerInfo, Order } from '../types';

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès',
  'Oujda', 'Kenitra', 'Tétouan', 'El Jadida', 'Safi', 'Mohammedia', 'Laâyoune',
  'Khouribga', 'Béni Mellal', 'Nador', 'Settat', 'Berrechid', 'Khémisset',
];

function generateOrderId() {
  return 'IDM-' + Date.now().toString(36).toUpperCase();
}

export default function Checkout() {
  const {
    navigate,
    cartItems,
    cartSubtotal,
    cartShipping,
    cartTotal,
    addOrder,
    clearCart,
  } = useApp();

  const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const update = (field: keyof CustomerInfo, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Partial<CustomerInfo> = {};
    if (!form.fullName.trim()) e.fullName = 'Nom requis';
    if (!form.phone.trim() || !/^[0-9+\s-]{9,15}$/.test(form.phone.trim())) e.phone = 'Numéro invalide';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (!form.city) e.city = 'Ville requise';
    if (!form.address.trim()) e.address = 'Adresse requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = () => {
    setSubmitting(true);
    const order: Order = {
      id: generateOrderId(),
      customer: form,
      items: cartItems,
      subtotal: cartSubtotal,
      shipping: cartShipping,
      total: cartTotal,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setTimeout(() => {
      addOrder(order);
      clearCart();
      setStep('done');
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  if (step === 'done') {
    return (
      <div className="min-h-full pt-24 md:pt-28 flex items-center justify-center bg-cream">
        <div className="max-w-lg w-full mx-auto px-6 py-16 text-center animate-fade-up">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-xs tracking-[0.4em] uppercase text-warm-gray mb-3">Commande confirmée</p>
          <h1 className="font-display text-4xl md:text-5xl italic mb-4">
            Merci, {form.fullName.split(' ')[0]} !
          </h1>
          <p className="text-warm-gray leading-relaxed mb-8">
            Votre commande a été reçue. Notre équipe vous contactera par téléphone sous 24h pour confirmer la livraison.
          </p>
          <div className="bg-sand p-6 text-sm text-left space-y-2 mb-8">
            <div className="flex justify-between">
              <span className="text-warm-gray">Total payé à la livraison</span>
              <span className="font-semibold">{cartTotal.toLocaleString('fr-MA')} MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-gray">Livraison à</span>
              <span>{form.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-gray">Téléphone</span>
              <span>{form.phone}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('home')}
              className="sea-gradient text-cream px-8 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={() => navigate('shop')}
              className="border border-navy text-navy px-8 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:bg-sand-deep transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Field = ({
    label, field, type = 'text', placeholder, required = false,
  }: {
    label: string;
    field: keyof CustomerInfo;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-xs tracking-widest uppercase font-semibold mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={e => update(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full border bg-cream px-4 py-3 text-sm outline-none transition-colors ${
          errors[field]
            ? 'border-error focus:border-error'
            : 'border-warm-border focus:border-warm-dark'
        }`}
      />
      {errors[field] && <p className="text-error text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-full pt-24 md:pt-28 bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          <div className={`flex items-center gap-2 text-xs tracking-wider uppercase ${step === 'form' ? 'text-navy font-semibold' : 'text-warm-gray'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'form' ? 'bg-navy text-cream' : 'bg-warm-border text-warm-gray'}`}>1</span>
            Informations
          </div>
          <div className="flex-1 h-px bg-warm-border" />
          <div className={`flex items-center gap-2 text-xs tracking-wider uppercase ${step === 'confirm' ? 'text-navy font-semibold' : 'text-warm-gray'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'confirm' ? 'bg-navy text-cream' : 'bg-warm-border text-warm-gray'}`}>2</span>
            Confirmation
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form / Confirm */}
          <div className="lg:col-span-2">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer info */}
                <div>
                  <h2 className="font-display text-2xl italic mb-6">Informations client</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Nom complet" field="fullName" placeholder="Votre nom et prénom" required />
                    </div>
                    <Field label="Téléphone" field="phone" type="tel" placeholder="+212 6XX XXX XXX" required />
                    <Field label="Email" field="email" type="email" placeholder="votre@email.com" />
                    <div className="sm:col-span-2">
                      <label className="block text-xs tracking-widest uppercase font-semibold mb-2">
                        Ville <span className="text-error">*</span>
                      </label>
                      <select
                        value={form.city}
                        onChange={e => update('city', e.target.value)}
                        className={`w-full border bg-cream px-4 py-3 text-sm outline-none transition-colors cursor-pointer ${
                          errors.city ? 'border-error' : 'border-warm-border focus:border-warm-dark'
                        }`}
                      >
                        <option value="">Sélectionnez votre ville</option>
                        {MOROCCAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p className="text-error text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Adresse complète" field="address" placeholder="Rue, numéro, quartier..." required />
                    </div>
                    <Field label="Code postal" field="postalCode" placeholder="20000" />
                  </div>
                </div>

                {/* Shipping */}
                <div>
                  <h2 className="font-display text-2xl italic mb-4">Livraison</h2>
                  <div className="border border-navy-mid bg-cream p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-navy-mid flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-navy-mid" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Livraison à domicile</p>
                        <p className="text-xs text-warm-gray">2 à 5 jours ouvrables · Partout au Maroc</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {cartShipping === 0 ? 'Gratuit' : `${cartShipping} MAD`}
                    </span>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <h2 className="font-display text-2xl italic mb-4">Paiement</h2>
                  <div className="border border-navy-mid bg-cream p-4 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-navy-mid flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-navy-mid" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Paiement à la livraison — Cash on Delivery</p>
                      <p className="text-xs text-warm-gray">Vous payez en espèces à la réception de votre commande.</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sea-gradient text-cream py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity"
                >
                  Confirmer la commande
                </button>
              </form>
            )}

            {step === 'confirm' && (
              <div className="animate-fade-up">
                <h2 className="font-display text-2xl italic mb-6">Vérifiez votre commande</h2>

                {/* Items summary */}
                <div className="space-y-4 mb-8">
                  {cartItems.map((item, i) => {
                    const price = item.product.salePrice ?? item.product.price;
                    return (
                      <div key={i} className="flex gap-4 py-4 border-b border-warm-border">
                        <div className="w-16 h-20 bg-sand shrink-0 overflow-hidden">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-semibold font-display">{item.product.name}</p>
                          <p className="text-warm-gray text-xs">{item.size} · {item.color} · Qté: {item.quantity}</p>
                          <p className="font-semibold mt-1">{(price * item.quantity).toLocaleString('fr-MA')} MAD</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery info */}
                <div className="bg-sand p-5 text-sm space-y-2 mb-8">
                  <p className="font-semibold text-xs tracking-widest uppercase mb-3">Livraison à</p>
                  <p className="font-display text-base">{form.fullName}</p>
                  <p className="text-warm-gray">{form.address}, {form.city} {form.postalCode}</p>
                  <p className="text-warm-gray">{form.phone}</p>
                  {form.email && <p className="text-warm-gray">{form.email}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep('form')}
                    className="flex-1 border border-navy text-navy py-4 text-xs tracking-widest uppercase font-semibold hover:bg-sand-deep transition-colors"
                  >
                    ← Modifier
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="flex-1 sea-gradient text-cream py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? 'Traitement...' : 'Valider ma commande'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-sand p-6 sticky top-24">
              <h2 className="font-display text-xl mb-5">Récapitulatif</h2>
              <div className="space-y-2 text-sm mb-5">
                {cartItems.map((item, i) => {
                  const price = item.product.salePrice ?? item.product.price;
                  return (
                    <div key={i} className="flex justify-between gap-2">
                      <span className="text-warm-gray truncate">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="shrink-0">{(price * item.quantity).toLocaleString('fr-MA')} MAD</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-warm-border pt-4 space-y-2 text-sm">
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
                <div className="flex justify-between font-semibold text-base border-t border-warm-border pt-3">
                  <span>Total</span>
                  <span>{cartTotal.toLocaleString('fr-MA')} MAD</span>
                </div>
              </div>
              <p className="text-xs text-warm-gray mt-4">
                Paiement à la livraison en espèces (MAD)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
