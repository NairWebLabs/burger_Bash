/**
 * REUSABLE CLIENT CONFIGURATION FOR WHATSAPP CHECKOUT
 * ===================================================
 * 
 * To onboard a new freelance client:
 * 1. Update the default values in this file OR set the corresponding VITE_* environment variables.
 * 2. Configure the WhatsApp phone number in pure international format (digits only, e.g. '15552348901' for US or '919876543210' for India).
 * 3. Update the currency symbol, delivery fee thresholds, and payment instructions.
 * 
 * Never hardcode personal credentials or secret keys here.
 */

export interface WhatsAppCheckoutConfig {
  /** The public display name of the client's business */
  businessName: string;

  /** The business WhatsApp phone number in international format WITHOUT '+' or dashes (e.g., '15552348901' or '447123456789') */
  businessPhone: string;

  /** Human-readable display formatted phone number for the UI */
  businessPhoneDisplay: string;

  /** Business physical location or city tagline */
  businessAddress: string;

  /** Currency configuration */
  currency: {
    symbol: string;
    code: string;
    position: 'prefix' | 'suffix';
  };

  /** Delivery & logistics settings */
  delivery: {
    /** Fixed delivery charge when below free threshold */
    defaultFee: number;
    /** Free delivery threshold; set to Infinity or 0 to disable */
    freeDeliveryThreshold: number;
    /** Whether store counter pickup is allowed */
    allowsPickup: boolean;
    /** Minimum order subtotal required to checkout */
    minimumOrderAmount: number;
  };

  /** Payment instructions shown to customer and sent in WhatsApp message */
  payment: {
    /** Available payment methods */
    acceptedMethods: string[];
    /** UPI ID for Indian merchants or payment handle */
    upiId?: string;
    /** Default instructions provided before manual confirmation */
    instructions: string;
  };

  /** Message formatting and template builders */
  templates: {
    orderPrefix: string;
    /** Formats the prefilled WhatsApp order request message */
    formatOrderMessage: (order: OrderMessagePayload) => string;
    /** Formats the merchant's optional formal receipt / invoice text */
    formatReceiptMessage: (order: OrderMessagePayload) => string;
    /** Formats the merchant's payment request / QR message */
    formatPaymentRequestMessage: (order: OrderMessagePayload) => string;
    /** Formats the final thank you message once order is confirmed */
    formatThankYouMessage: (order: OrderMessagePayload) => string;
  };
}

export interface OrderItemPayload {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizationDetails?: string;
}

export interface OrderMessagePayload {
  orderReference: string;
  timestamp: string;
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress: string;
  items: OrderItemPayload[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  notes?: string;
}

/**
 * Global client configuration instance
 * Reads from Vite environment variables when available, falling back to client defaults.
 */
export const whatsappCheckoutConfig: WhatsAppCheckoutConfig = {
  businessName: (import.meta.env.VITE_BUSINESS_NAME as string) || 'EMBER & BRIOCHE ATELIER',
  
  // WhatsApp number in digits only (country code + subscriber number)
  businessPhone: (import.meta.env.VITE_WHATSAPP_PHONE as string)?.replace(/\D/g, '') || '15552348901',
  
  businessPhoneDisplay: (import.meta.env.VITE_WHATSAPP_PHONE_DISPLAY as string) || '+1 (555) 234-8901',
  
  businessAddress: (import.meta.env.VITE_BUSINESS_ADDRESS as string) || '148 Franklin St, Tribeca, NY',

  currency: {
    symbol: (import.meta.env.VITE_CURRENCY_SYMBOL as string) || '$',
    code: (import.meta.env.VITE_CURRENCY_CODE as string) || 'USD',
    position: 'prefix'
  },

  delivery: {
    defaultFee: Number(import.meta.env.VITE_DELIVERY_FEE ?? 3.50),
    freeDeliveryThreshold: Number(import.meta.env.VITE_FREE_DELIVERY_THRESHOLD ?? 45.00),
    allowsPickup: true,
    minimumOrderAmount: Number(import.meta.env.VITE_MIN_ORDER_AMOUNT ?? 0.00)
  },

  payment: {
    acceptedMethods: [
      'Cash / Card on Delivery',
      'UPI / Online Payment (Google Pay, PhonePe, Paytm)',
      'Bank Transfer'
    ],
    upiId: (import.meta.env.VITE_MERCHANT_UPI_ID as string) || '',
    instructions: 
      'Payment is manually confirmed by the merchant on WhatsApp. We accept Cash on Delivery, Card on Delivery, or UPI. Payment details and official QR will be confirmed in this chat.'
  },

  templates: {
    orderPrefix: (import.meta.env.VITE_ORDER_PREFIX as string) || 'ORD',

    /**
     * Builds the customer's outgoing WhatsApp draft message.
     * Note: This is an unverified browser draft that the customer must manually send.
     */
    formatOrderMessage: (order: OrderMessagePayload): string => {
      const cur = whatsappCheckoutConfig.currency.symbol;
      const lines: string[] = [];

      lines.push(`🍔 *${whatsappCheckoutConfig.businessName}*`);
      lines.push(`*ORDER INQUIRY & CHECKOUT DRAFT*`);
      lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`📋 *Reference:* ${order.orderReference}`);
      lines.push(`⏱️ *Date:* ${order.timestamp}`);
      lines.push(``);
      lines.push(`👤 *Customer:* ${order.customerName}`);
      lines.push(`📞 *Phone:* ${order.customerPhone}`);
      lines.push(`🛵 *Fulfillment:* ${order.orderType === 'delivery' ? 'Direct Delivery' : 'Atelier Pickup'}`);
      if (order.orderType === 'delivery') {
        lines.push(`📍 *Address:* ${order.deliveryAddress}`);
      }
      lines.push(``);
      lines.push(`📦 *ITEMS ORDERED:*`);

      order.items.forEach((item, index) => {
        lines.push(`${index + 1}. *${item.quantity}x ${item.name}* — ${cur}${item.totalPrice.toFixed(2)}`);
        if (item.customizationDetails) {
          lines.push(`   └ _${item.customizationDetails}_`);
        }
      });

      lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`Subtotal: ${cur}${order.subtotal.toFixed(2)}`);
      lines.push(`Delivery: ${order.deliveryFee === 0 ? 'FREE' : `${cur}${order.deliveryFee.toFixed(2)}`}`);
      if (order.discount > 0) {
        lines.push(`Discount: -${cur}${order.discount.toFixed(2)}`);
      }
      lines.push(`*ESTIMATED TOTAL: ${cur}${order.total.toFixed(2)}*`);

      if (order.notes && order.notes.trim()) {
        lines.push(``);
        lines.push(`💬 *Special Instructions:*`);
        lines.push(`"${order.notes.trim()}"`);
      }

      lines.push(``);
      lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`_Please reply to confirm order availability, kitchen prep time, and payment instructions._`);
      lines.push(`_(Note: Order reference generated in browser. Final confirmation is verified directly by merchant)._`);

      return lines.join('\n');
    },

    /**
     * Formal merchant receipt/invoice template that can be copied or shared back to customer.
     */
    formatReceiptMessage: (order: OrderMessagePayload): string => {
      const cur = whatsappCheckoutConfig.currency.symbol;
      const lines: string[] = [];

      lines.push(`🧾 *TAX INVOICE / ORDER RECEIPT*`);
      lines.push(`*${whatsappCheckoutConfig.businessName}*`);
      lines.push(`${whatsappCheckoutConfig.businessAddress}`);
      lines.push(`WhatsApp Support: ${whatsappCheckoutConfig.businessPhoneDisplay}`);
      lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`Invoice Ref: ${order.orderReference}`);
      lines.push(`Date: ${order.timestamp}`);
      lines.push(`Billed To: ${order.customerName} (${order.customerPhone})`);
      lines.push(`Type: ${order.orderType.toUpperCase()}`);
      lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`ITEMIZED SUMMARY:`);

      order.items.forEach((item) => {
        lines.push(`• ${item.quantity} x ${item.name} @ ${cur}${item.unitPrice.toFixed(2)} = ${cur}${item.totalPrice.toFixed(2)}`);
        if (item.customizationDetails) {
          lines.push(`  (${item.customizationDetails})`);
        }
      });

      lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`Subtotal: ${cur}${order.subtotal.toFixed(2)}`);
      lines.push(`Delivery Fee: ${order.deliveryFee === 0 ? 'FREE' : `${cur}${order.deliveryFee.toFixed(2)}`}`);
      lines.push(`*GRAND TOTAL: ${cur}${order.total.toFixed(2)}*`);
      lines.push(`━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`Status: PENDING MERCHANT RECONCILIATION`);
      lines.push(`_Thank you for supporting artisanal craftsmanship!_`);

      return lines.join('\n');
    },

    /**
     * Template for merchant requesting payment via UPI / Bank / COD
     */
    formatPaymentRequestMessage: (order: OrderMessagePayload): string => {
      const cur = whatsappCheckoutConfig.currency.symbol;
      const lines: string[] = [];

      lines.push(`💳 *PAYMENT INSTRUCTIONS FOR ORDER ${order.orderReference}*`);
      lines.push(`Total Amount Payable: *${cur}${order.total.toFixed(2)}*`);
      lines.push(``);
      if (whatsappCheckoutConfig.payment.upiId) {
        lines.push(`📲 *UPI ID:* \`${whatsappCheckoutConfig.payment.upiId}\``);
        lines.push(`(Open Google Pay / PhonePe / Paytm / BHIM and enter UPI ID)`);
        lines.push(``);
      }
      lines.push(`💵 *Cash / Card on Delivery:* Available upon courier arrival.`);
      lines.push(``);
      lines.push(`Please share transaction ID or reference after sending. Once verified on our merchant statement, we dispatch immediately.`);

      return lines.join('\n');
    },

    /**
     * Thank you / Order complete template
     */
    formatThankYouMessage: (order: OrderMessagePayload): string => {
      return `🎉 *Order ${order.orderReference} Confirmed & Dispatched!*\n\nThank you for choosing ${whatsappCheckoutConfig.businessName}. Chef has completed preparation and your order is on its way.\n\nEnjoy your meal, and feel free to message us here for any assistance! 🔥`;
    }
  }
};
