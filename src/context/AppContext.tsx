import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Order, OrderStatus, Page, Product } from '../types';
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '../data/products';

interface NavParams {
  productId?: string;
}

interface AppContextType {
  currentPage: Page;
  navigate: (page: Page, params?: NavParams) => void;
  currentProductId: string | null;

  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartShipping: number;
  cartTotal: number;

  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;

  shopCategory: string;
  setShopCategory: (cat: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [shopCategory, setShopCategory] = useState<string>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ikka_cart');
      if (saved) setCartItems(JSON.parse(saved));
      const savedOrders = localStorage.getItem('ikka_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('ikka_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('ikka_orders', JSON.stringify(orders));
  }, [orders]);

  const navigate = (page: Page, params?: NavParams) => {
    setCurrentPage(page);
    if (params?.productId) setCurrentProductId(params.productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.findIndex(
        i => i.product.id === item.product.id && i.size === item.size && i.color === item.color
      );
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + item.quantity };
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, qty: number) => {
    if (qty < 1) return;
    setCartItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: qty };
      return updated;
    });
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
    0
  );
  const cartShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const cartTotal = cartSubtotal + cartShipping;

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setLastOrder(order);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        currentProductId,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartShipping,
        cartTotal,
        orders,
        addOrder,
        updateOrderStatus,
        lastOrder,
        setLastOrder,
        shopCategory,
        setShopCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
