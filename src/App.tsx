import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from './data/menu';
import { MenuItem, CartItem, Order, OrderStatus, CartCustomization } from './types';
import { whatsappCheckoutConfig, OrderMessagePayload } from './config/whatsappCheckout';
import { calculateTrustedOrder } from './utils/whatsappCheckout';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CollageMotion } from './components/CollageMotion';
import { MenuSection } from './components/MenuSection';
import { MotionReels } from './components/MotionReels';
import { BurgerModal } from './components/BurgerModal';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppChatModal } from './components/WhatsAppChatModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { kitchenSound } from './utils/audio';

export default function App() {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Seed cart with 1 delicious item so user immediately sees a working bag if they want
    const defaultItem = MENU_ITEMS[0];
    return [
      {
        cartItemId: 'init-item-1',
        item: defaultItem,
        quantity: 1,
        customization: {
          doneness: 'Lacy Crust (Standard)',
          bun: 'Signature Golden Brioche',
          extraCheese: true
        },
        calculatedPrice: defaultItem.price + 2.00
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedBurger, setSelectedBurger] = useState<MenuItem | null>(null);

  // WhatsApp AI Chat State
  const [activeWhatsAppOrder, setActiveWhatsAppOrder] = useState<Order | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // WhatsApp Checkout Receipt Modal State
  const [receiptOrder, setReceiptOrder] = useState<OrderMessagePayload | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Gemini AI Sommelier Chatbot State
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);

  // Admin Dashboard State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Sound State
  const [soundActive, setSoundActive] = useState(false);

  // Fetch initial orders from server
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      }
    } catch (e) {
      console.warn('Could not fetch server orders:', e);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 5 seconds for real-time kitchen updates
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.calculatedPrice * item.quantity), 0);

  const toggleSound = () => {
    const active = kitchenSound.toggle();
    setSoundActive(active);
  };

  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    customization: CartCustomization,
    unitPrice: number
  ) => {
    const newItem: CartItem = {
      cartItemId: 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      item,
      quantity,
      customization,
      calculatedPrice: unitPrice
    };

    setCart((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart(item, 1, {}, item.price);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null)
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  // User submits Cart -> Direct to WhatsApp Checkout with trusted calculation & invoice preview
  const handleProceedToWhatsApp = async (customerDetails: {
    name: string;
    phone: string;
    address: string;
    orderType: 'delivery' | 'pickup';
    notes: string;
  }) => {
    if (cart.length === 0) return;

    // Security: Recalculate trusted totals directly from master catalog
    const calcResult = calculateTrustedOrder(cart, customerDetails, MENU_ITEMS, whatsappCheckoutConfig);
    if (!calcResult.isValid || !calcResult.payload || !calcResult.whatsappUrl) {
      alert(calcResult.errorMessage || 'Unable to compute order totals.');
      return;
    }

    const payload = calcResult.payload;
    const whatsappUrl = calcResult.whatsappUrl;

    const initialCustomerMessage = whatsappCheckoutConfig.templates.formatOrderMessage(payload);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: payload.orderReference,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      deliveryAddress: payload.deliveryAddress,
      orderType: payload.orderType,
      items: [...cart],
      subtotal: payload.subtotal,
      deliveryFee: payload.deliveryFee,
      discount: payload.discount,
      total: payload.total,
      paymentMethod: 'Cash / Card on Delivery / UPI',
      status: 'new',
      createdAt: new Date().toISOString(),
      estimatedMinutes: 22,
      chatHistory: [
        {
          id: 'msg-cust-init',
          sender: 'customer',
          text: initialCustomerMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOrderCard: true
        }
      ],
      notes: payload.notes
    };

    // Close cart drawer
    setIsCartOpen(false);

    // Save payload to receipt modal
    setReceiptOrder(payload);
    setReceiptUrl(whatsappUrl);
    setIsReceiptOpen(true);

    // Also link to in-app concierge & admin dashboard sync
    setActiveWhatsAppOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);

    // Open WhatsApp Click-to-Chat in new tab with prefilled message
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Popup blocked, customer can click directly in receipt modal:', err);
    }

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (e) {
      console.error('Failed to post order to server:', e);
    }

    // Clear cart
    setCart([]);
  };

  const handleUpdateActiveOrder = (updatedOrder: Order) => {
    setActiveWhatsAppOrder(updatedOrder);
    setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (activeWhatsAppOrder && activeWhatsAppOrder.id === orderId) {
      setActiveWhatsAppOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note })
      });
      fetchOrders();
    } catch (e) {
      console.error('Failed to update status on server:', e);
    }
  };

  const handleSendKitchenMessage = async (orderId: string, messageText: string) => {
    const kitchenMsg = {
      id: 'kitch-' + Date.now(),
      sender: 'kitchen' as const,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStatusUpdate: true
    };

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, chatHistory: [...o.chatHistory, kitchenMsg] } : o
      )
    );

    if (activeWhatsAppOrder && activeWhatsAppOrder.id === orderId) {
      setActiveWhatsAppOrder((prev) =>
        prev ? { ...prev, chatHistory: [...prev.chatHistory, kitchenMsg] } : null
      );
    }

    try {
      await fetch(`/api/orders/${orderId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: kitchenMsg })
      });
    } catch (e) {
      console.error('Failed to send kitchen message:', e);
    }
  };

  // Demo helper: simulate incoming customer order to demonstrate admin realtime updates
  const handleSimulateNewOrder = async () => {
    const randomNum = '#WA-' + Math.floor(1000 + Math.random() * 9000);
    const mockOrder: Order = {
      id: 'ord-sim-' + Date.now(),
      orderNumber: randomNum,
      customerName: 'Sophie Chevalier',
      customerPhone: '+1 (555) 602-9912',
      deliveryAddress: '55 Wall St, Suite 1204',
      orderType: 'delivery',
      items: [
        {
          cartItemId: 'sim-item-1',
          item: MENU_ITEMS[1], // Wagyu
          quantity: 1,
          customization: { doneness: 'Medium Rare (Chef Rec)' },
          calculatedPrice: 26.00
        },
        {
          cartItemId: 'sim-item-2',
          item: MENU_ITEMS[4], // Rosemary fries
          quantity: 2,
          calculatedPrice: 8.50
        }
      ],
      subtotal: 43.00,
      deliveryFee: 3.50,
      discount: 0,
      total: 46.50,
      paymentMethod: 'Cash on Delivery',
      status: 'new',
      createdAt: new Date().toISOString(),
      estimatedMinutes: 24,
      chatHistory: [
        {
          id: 'sim-msg-1',
          sender: 'customer',
          text: `Hello! Just placed order ${randomNum} for delivery to 55 Wall St. Can you ensure the truffle aioli is extra cold?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOrderCard: true
        },
        {
          id: 'sim-msg-2',
          sender: 'concierge',
          text: `Bonjour Sophie! Order ${randomNum} received. Handing to chef right now and flagging your truffle aioli note!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setOrders((prev) => [mockOrder, ...prev]);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockOrder)
      });
    } catch (e) {
      console.warn('Could not post simulated order:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-100 selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        isAdminView={isAdminOpen}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        soundActive={soundActive}
        onToggleSound={toggleSound}
        onToggleGeminiChat={() => setIsGeminiChatOpen(!isGeminiChatOpen)}
      />

      {/* Main Page Flow */}
      <main>
        {/* Hero Section with motion video & text reveals */}
        <Hero
          onExploreMenu={() => {
            const el = document.getElementById('menu');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenWhatsAppDirect={() => {
            if (!activeWhatsAppOrder) {
              // Open default demo ticket
              if (orders.length > 0) {
                setActiveWhatsAppOrder(orders[0]);
              }
            }
            setIsWhatsAppOpen(true);
          }}
        />

        {/* Collage-Style Motion & Craft Section */}
        <CollageMotion />

        {/* Curated Menu & Product Cards */}
        <MenuSection
          items={MENU_ITEMS}
          onSelectItem={(item) => setSelectedBurger(item)}
          onQuickAdd={handleQuickAdd}
        />

        {/* Motion Video Cinema Reels & Sizzle Cam */}
        <MotionReels
          soundActive={soundActive}
          onToggleSound={toggleSound}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Burger Customizer Modal */}
      <BurgerModal
        item={selectedBurger}
        onClose={() => setSelectedBurger(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToWhatsApp={handleProceedToWhatsApp}
      />

      {/* WhatsApp AI Chat Modal Interface */}
      <WhatsAppChatModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        order={activeWhatsAppOrder || orders[0] || null}
        onUpdateOrder={handleUpdateActiveOrder}
      />

      {/* Official WhatsApp Checkout Receipt & Invoice Modal */}
      <OrderReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        order={receiptOrder}
        whatsappUrl={receiptUrl}
      />

      {/* Multi-turn Gemini AI Chatbot: Chef Antoine Sommelier */}
      <GeminiChatbot
        isOpen={isGeminiChatOpen}
        onToggle={() => setIsGeminiChatOpen(!isGeminiChatOpen)}
        onQuickAddToCart={handleQuickAdd}
      />

      {/* Real-time Kitchen Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onSendKitchenMessage={handleSendKitchenMessage}
          onSimulateNewOrder={handleSimulateNewOrder}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
