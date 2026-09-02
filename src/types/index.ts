// ============================================================
// IKKA DEL MAR — Type definitions
// ============================================================

export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: Color[];
  stock: number;
  featured: boolean;
  isNew: boolean;
  isSale: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  postalCode: string;
}

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type Page =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'admin';
