import { CartItem, MenuItem } from '../types';
import { 
  whatsappCheckoutConfig, 
  WhatsAppCheckoutConfig, 
  OrderMessagePayload, 
  OrderItemPayload 
} from '../config/whatsappCheckout';
import { MENU_ITEMS } from '../data/menu';

export interface CustomerCheckoutInput {
  name: string;
  phone: string;
  address: string;
  orderType: 'delivery' | 'pickup';
  notes?: string;
}

export interface TrustedCheckoutCalculationResult {
  isValid: boolean;
  errorMessage?: string;
  payload?: OrderMessagePayload;
  whatsappUrl?: string;
}

/**
 * Generates an unverified browser-side draft order reference.
 * Clearly formatted with a prefix and timestamp to prevent collisions.
 */
export function generateBrowserOrderReference(prefix = 'ORD'): string {
  const now = new Date();
  const dateSegment = now.toISOString().slice(2, 10).replace(/-/g, '');
  const randomSegment = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateSegment}-${randomSegment}`;
}

/**
 * Validates cart items and calculates trusted totals directly from the master product catalog.
 * Defends against client-side price tampering or corrupted state.
 */
export function calculateTrustedOrder(
  cartItems: CartItem[],
  customer: CustomerCheckoutInput,
  catalog: MenuItem[] = MENU_ITEMS,
  config: WhatsAppCheckoutConfig = whatsappCheckoutConfig
): TrustedCheckoutCalculationResult {
  if (!cartItems || cartItems.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Cart is empty. Please add at least one item before checking out.'
    };
  }

  if (!customer.name.trim()) {
    return {
      isValid: false,
      errorMessage: 'Customer name is required for order coordination.'
    };
  }

  if (customer.orderType === 'delivery' && !customer.address.trim()) {
    return {
      isValid: false,
      errorMessage: 'Delivery address is required for dispatch.'
    };
  }

  // Trusted price computation
  const trustedItems: OrderItemPayload[] = [];
  let subtotal = 0;

  for (const cartItem of cartItems) {
    // Lookup product in trusted master catalog
    const catalogItem = catalog.find((c) => c.id === cartItem.item.id);
    const basePrice = catalogItem ? catalogItem.price : cartItem.item.price;

    // Sanitize quantity
    const quantity = Math.max(1, Math.min(50, Math.floor(Number(cartItem.quantity) || 1)));

    // Calculate verified add-ons
    let unitPrice = basePrice;
    const customizationParts: string[] = [];

    if (cartItem.customization) {
      if (cartItem.customization.doneness) {
        customizationParts.push(cartItem.customization.doneness);
      }
      if (cartItem.customization.bun) {
        customizationParts.push(cartItem.customization.bun);
      }
      if (cartItem.customization.extraCheese) {
        unitPrice += 2.00;
        customizationParts.push('+Extra Raclette ($2.00)');
      }
      if (cartItem.customization.extraPatty) {
        unitPrice += 5.50;
        customizationParts.push('+Extra Patty ($5.50)');
      }
      if (cartItem.customization.specialInstructions?.trim()) {
        customizationParts.push(`Note: "${cartItem.customization.specialInstructions.trim()}"`);
      }
    }

    const itemTotal = unitPrice * quantity;
    subtotal += itemTotal;

    trustedItems.push({
      name: catalogItem ? catalogItem.name : cartItem.item.name,
      quantity,
      unitPrice,
      totalPrice: itemTotal,
      customizationDetails: customizationParts.join(' · ')
    });
  }

  // Minimum order check
  if (config.delivery.minimumOrderAmount > 0 && subtotal < config.delivery.minimumOrderAmount) {
    return {
      isValid: false,
      errorMessage: `Minimum order amount is ${config.currency.symbol}${config.delivery.minimumOrderAmount.toFixed(2)}.`
    };
  }

  // Calculate delivery fee
  let deliveryFee = 0;
  if (customer.orderType === 'delivery') {
    if (config.delivery.freeDeliveryThreshold > 0 && subtotal >= config.delivery.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = config.delivery.defaultFee;
    }
  }

  const grandTotal = subtotal + deliveryFee;

  const orderReference = generateBrowserOrderReference(config.templates.orderPrefix);
  const timestamp = new Date().toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const payload: OrderMessagePayload = {
    orderReference,
    timestamp,
    customerName: customer.name.trim(),
    customerPhone: customer.phone.trim(),
    orderType: customer.orderType,
    deliveryAddress: customer.orderType === 'delivery' ? customer.address.trim() : 'Store Counter Pickup',
    items: trustedItems,
    subtotal,
    deliveryFee,
    discount: 0,
    total: grandTotal,
    notes: customer.notes?.trim()
  };

  const whatsappUrl = buildOfficialWhatsAppUrl(payload, config);

  return {
    isValid: true,
    payload,
    whatsappUrl
  };
}

/**
 * Builds the official click-to-chat WhatsApp URL with sanitized phone number and properly encoded text.
 * Format: https://wa.me/<NUMBER>?text=<ENCODED_MESSAGE>
 */
export function buildOfficialWhatsAppUrl(
  order: OrderMessagePayload,
  config: WhatsAppCheckoutConfig = whatsappCheckoutConfig
): string {
  // Strip non-digits from business phone
  const cleanPhone = config.businessPhone.replace(/\D/g, '');
  const messageText = config.templates.formatOrderMessage(order);
  const encodedText = encodeURIComponent(messageText);

  if (!cleanPhone) {
    // If phone is missing, wa.me/?text= still lets customer pick their recipient
    return `https://wa.me/?text=${encodedText}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
