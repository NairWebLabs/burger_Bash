export interface MenuItem {
  id: string;
  name: string;
  subname: string;
  category: 'smash' | 'wagyu' | 'specialty' | 'sides' | 'beverages';
  description: string;
  price: number;
  image: string;
  videoUrl?: string;
  badge?: string;
  calories: string;
  prepTime: string;
  rating: number;
  ingredients: string[];
  chefNote: string;
  customizable: boolean;
  options?: {
    doneness?: string[];
    bun?: string[];
  };
}

export interface CartCustomization {
  doneness?: string;
  bun?: string;
  extraCheese?: boolean;
  extraPatty?: boolean;
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  customization?: CartCustomization;
  calculatedPrice: number;
}

export type OrderStatus = 'new' | 'confirmed' | 'grilling' | 'out_for_delivery' | 'delivered';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'concierge' | 'kitchen';
  text: string;
  timestamp: string;
  isOrderCard?: boolean;
  isStatusUpdate?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderType: 'delivery' | 'pickup';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  chatHistory: ChatMessage[];
  notes?: string;
}
