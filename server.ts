import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory orders store (synced across sessions)
interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  orderType: 'delivery' | 'pickup';
  items: any[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'new' | 'confirmed' | 'grilling' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  estimatedMinutes: number;
  chatHistory: {
    id: string;
    sender: 'customer' | 'concierge' | 'kitchen';
    text: string;
    timestamp: string;
    isOrderCard?: boolean;
    isStatusUpdate?: boolean;
  }[];
  notes?: string;
}

// Initial sample seed orders so admin dashboard is rich and demonstrable immediately
let orders: OrderRecord[] = [
  {
    id: 'ord-8421',
    orderNumber: '#WA-8421',
    customerName: 'Marcus Vance',
    customerPhone: '+1 (555) 234-8901',
    deliveryAddress: '742 Evergreen Terrace, Loft 4B',
    orderType: 'delivery',
    items: [
      {
        cartItemId: 'item-1',
        item: {
          id: 'smash-saffron-double',
          name: 'The Saffron Ember Smash',
          price: 18.50,
          image: '/src/assets/images/burger_smoked_saffron_smash_1792861412281.jpg',
        },
        quantity: 2,
        customization: { doneness: 'Lacy Crust (Standard)', extraCheese: true },
        calculatedPrice: 39.00
      },
      {
        cartItemId: 'item-2',
        item: {
          id: 'sides-rosemary-parmesan-fries',
          name: 'Rosemary & Reggiano Hand-Cuts',
          price: 8.50,
          image: '/src/assets/images/sides_rosemary_parmesan_fries_1792861414104.jpg',
        },
        quantity: 1,
        calculatedPrice: 8.50
      }
    ],
    subtotal: 47.50,
    deliveryFee: 3.50,
    discount: 0,
    total: 51.00,
    paymentMethod: 'Cash / Card on Delivery',
    status: 'grilling',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    estimatedMinutes: 20,
    chatHistory: [
      {
        id: 'msg-1',
        sender: 'customer',
        text: 'Hello! Placing an order from Ember & Brioche Atelier:\n- 2x The Saffron Ember Smash (Extra Cheese)\n- 1x Rosemary & Reggiano Hand-Cuts\nDelivery to: 742 Evergreen Terrace, Loft 4B',
        timestamp: '10:15 AM',
        isOrderCard: true
      },
      {
        id: 'msg-2',
        sender: 'concierge',
        text: 'Bonjour Marcus! 🔥 Your order #WA-8421 is confirmed. Our kitchen chef just fired up the 550°F cast iron for your Saffron Ember Smashes with double melted aged cheddar. Estimated delivery is 20 minutes.',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'Awesome, can you make sure extra saffron remoulade is on the side too?',
        timestamp: '10:17 AM'
      },
      {
        id: 'msg-4',
        sender: 'concierge',
        text: 'Absolutely! Added a complimentary ramekin of our house-smoked saffron remoulade to your ticket. Our courier will notify you when departing!',
        timestamp: '10:18 AM'
      }
    ]
  },
  {
    id: 'ord-8420',
    orderNumber: '#WA-8420',
    customerName: 'Elena Rostova',
    customerPhone: '+1 (555) 789-3321',
    deliveryAddress: 'Pickup Atelier Counter (Booth 3)',
    orderType: 'pickup',
    items: [
      {
        cartItemId: 'item-3',
        item: {
          id: 'wagyu-black-truffle',
          name: 'The Black Truffle Wagyu',
          price: 26.00,
          image: '/src/assets/images/burger_truffle_wagyu_1792861412306.jpg',
        },
        quantity: 1,
        customization: { doneness: 'Medium Rare (Chef Rec)' },
        calculatedPrice: 26.00
      }
    ],
    subtotal: 26.00,
    deliveryFee: 0,
    discount: 0,
    total: 26.00,
    paymentMethod: 'UPI / Online Express',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    estimatedMinutes: 14,
    chatHistory: [
      {
        id: 'msg-elena-1',
        sender: 'customer',
        text: 'Hey! I ordered The Black Truffle Wagyu for counter pickup under Elena Rostova.',
        timestamp: '10:22 AM',
        isOrderCard: true
      },
      {
        id: 'msg-elena-2',
        sender: 'concierge',
        text: 'Welcome Elena! Order #WA-8420 logged for pickup. Chef is searing your A5 Miyazaki Wagyu blend over binchotan white embers right now. Will be ready in approx 14 mins at Counter Booth 3.',
        timestamp: '10:22 AM'
      }
    ]
  }
];

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/orders', (req, res) => {
  res.json({ orders });
});

app.post('/api/orders', (req, res) => {
  const newOrder: OrderRecord = req.body;
  if (!newOrder.id) {
    newOrder.id = 'ord-' + Math.floor(1000 + Math.random() * 9000);
  }
  if (!newOrder.orderNumber) {
    newOrder.orderNumber = '#WA-' + Math.floor(1000 + Math.random() * 9000);
  }
  if (!newOrder.createdAt) {
    newOrder.createdAt = new Date().toISOString();
  }

  // Prepend to top of list
  orders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const order = orders.find(o => o.id === id || o.orderNumber === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  if (note) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    order.chatHistory.push({
      id: 'sys-' + Date.now(),
      sender: 'kitchen',
      text: `🔔 Kitchen Status Update: ${note}`,
      timestamp: timeStr,
      isStatusUpdate: true
    });
  }

  res.json({ success: true, order });
});

app.post('/api/orders/:id/message', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const order = orders.find(o => o.id === id || o.orderNumber === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.chatHistory.push(message);
  res.json({ success: true, order });
});

// Gemini AI Chat for WhatsApp AI Concierge
app.post('/api/chat', async (req, res) => {
  try {
    const { message, orderContext, chatHistory } = req.body;

    const systemInstruction = `You are "EMBER", the passionate, charismatic, culinary AI Concierge for "EMBER & BRIOCHE", an ultra-modern artistic artisanal burger atelier.
You interact with customers directly through their WhatsApp order channel.
Key personality attributes:
- Warm, sophisticated, food-enthusiastic, highly efficient and reassuring.
- You know every detail of the menu: 550°F cast iron smash patties, lacy Maillard crusts, A5 Miyazaki Wagyu, freshly shaved black truffles, French butter brioche toasted on plancha, hand-cut triple-cooked duck fat rosemary fries, smoked saffron emulsions.
- If the customer just submitted an order, give them a vivid, mouthwatering automatic confirmation, confirm their delivery or pickup details, quote the estimated kitchen preparation time (~18-25 mins), and give them an order number like ${orderContext?.orderNumber || '#WA-8924'}.
- If they ask for substitutions, modifications, allergies, beverage pairings (e.g., our Smoked Madagascar Malt Shake), respond courteously and confirm you've marked it for the kitchen brigade.
- Keep WhatsApp messages punchy, visually clean with minimal tasteful emojis (🔥, 🍔, ✨, ⏱️, 🛵), and formatted like real luxury restaurant WhatsApp dispatches.
- If an order is already placed, reference the specific burgers and address in context.`;

    if (geminiClient) {
      // Format chat context
      const formattedHistory = (chatHistory || []).map((msg: any) => ({
        role: msg.sender === 'customer' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Append current message
      formattedHistory.push({
        role: 'user',
        parts: [{
          text: `Customer WhatsApp message: "${message}". Current Order Context: ${JSON.stringify(orderContext || {})}`
        }]
      });

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "Merci! Your ticket is active in the atelier. Chef is attending to your burgers now!";
      return res.json({ reply: replyText });
    } else {
      // Fallback high-fidelity smart conversational generator if API key is not yet set
      let reply = "";
      const lower = (message || "").toLowerCase();

      if (lower.includes('order') || lower.includes('hello') || lower.includes('hi') || !chatHistory?.length) {
        reply = `Bonjour! 🔥 Welcome to EMBER & BRIOCHE Atelier. Your order ${orderContext?.orderNumber || '#WA-8924'} is officially confirmed and relayed to our kitchen brigade!\n\n👨‍🍳 Chef Marcus just dropped your patties onto the 550°F plancha for that signature crisp lacy Maillard crust.\n⏱️ Estimated preparation & dispatch: ~22 minutes.\n🛵 We'll send live pings as your courier departs! Let me know if you need any sauce add-ons or special handling!`;
      } else if (lower.includes('sauce') || lower.includes('remoulade') || lower.includes('aioli')) {
        reply = `Consider it done! ✨ We've added an extra complimentary ramekin of our house-smoked saffron remoulade to your order ticket. The kitchen is prepping it right now.`;
      } else if (lower.includes('pickles') || lower.includes('onion') || lower.includes('cheese') || lower.includes('allergy')) {
        reply = `Noted with utmost care! I have flagged your customization: "${message}" directly on Chef's digital line monitor. Rest assured it will be crafted exactly to your specifications. 🍔`;
      } else if (lower.includes('where') || lower.includes('status') || lower.includes('time') || lower.includes('eta')) {
        reply = `Checking live with the grill line... ⏱️ Your patties are seared, cheese is melted under the steam cloche, and buns are golden toasted. Your order is roughly 12-15 minutes out!`;
      } else {
        reply = `Understood! I've noted that for the kitchen crew. Is there anything else I can coordinate for your EMBER & BRIOCHE feast? 🔥`;
      }

      return res.json({ reply });
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process concierge chat',
      reply: "Merci! We've received your note and relayed it directly to the head chef on duty."
    });
  }
});

// Dev vs Production Setup
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
