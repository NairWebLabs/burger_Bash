import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { 
  Flame, Clock, CheckCircle2, Bike, AlertCircle, RefreshCw, 
  Search, MessageSquare, ArrowRight, User, Phone, MapPin, 
  DollarSign, ChefHat, X, Send, Sparkles, Filter
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  onSendKitchenMessage: (orderId: string, messageText: string) => void;
  onSimulateNewOrder: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onSendKitchenMessage,
  onSimulateNewOrder,
  onClose
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [customKitchenNote, setCustomKitchenNote] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Keep selected order updated when orders array updates
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(o => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  }, [orders]);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered').length;

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'confirmed': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'grilling': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'out_for_delivery': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const handleAdvanceStatus = (order: Order) => {
    let nextStatus: OrderStatus = 'confirmed';
    let note = '';

    if (order.status === 'new') {
      nextStatus = 'confirmed';
      note = 'Order ticket accepted by Chef Marcus.';
    } else if (order.status === 'confirmed') {
      nextStatus = 'grilling';
      note = 'Patties sizzling on 550°F cast iron.';
    } else if (order.status === 'grilling') {
      nextStatus = 'out_for_delivery';
      note = 'Order boxed in thermo-pack & handed to courier.';
    } else if (order.status === 'out_for_delivery') {
      nextStatus = 'delivered';
      note = 'Delivered to customer. Bon Appetit!';
    } else {
      return;
    }

    onUpdateOrderStatus(order.id, nextStatus, note);
  };

  const handleSendCustomPing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !customKitchenNote.trim()) return;
    onSendKitchenMessage(selectedOrder.id, customKitchenNote.trim());
    setCustomKitchenNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090a0d] flex flex-col overflow-hidden text-left animate-in fade-in duration-200">
      {/* Admin Top Navigation */}
      <header className="px-6 py-4 bg-[#111218] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-lg font-bold font-display text-white tracking-wide uppercase">
              LIVE KITCHEN COMMAND & WHATSAPP MONITOR
            </h1>
          </div>
          <span className="hidden sm:inline-block font-mono-num text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
            Real-Time Socket Synced
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSimulateNewOrder}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Incoming WhatsApp Order</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="px-6 py-4 bg-[#0d0e13] border-b border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
          <div className="text-[11px] font-mono-num text-zinc-500 uppercase tracking-wider mb-1">
            Active WhatsApp Orders
          </div>
          <div className="text-2xl font-bold font-mono-num text-amber-400">
            {activeOrdersCount}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
          <div className="text-[11px] font-mono-num text-zinc-500 uppercase tracking-wider mb-1">
            Today's Gross Sales
          </div>
          <div className="text-2xl font-bold font-mono-num text-white">
            ${totalRevenue.toFixed(2)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
          <div className="text-[11px] font-mono-num text-zinc-500 uppercase tracking-wider mb-1">
            Total Tickets Logged
          </div>
          <div className="text-2xl font-bold font-mono-num text-white">
            {orders.length}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5">
          <div className="text-[11px] font-mono-num text-zinc-500 uppercase tracking-wider mb-1">
            Avg Grill & Box Time
          </div>
          <div className="text-2xl font-bold font-mono-num text-emerald-400">
            18.2 Min
          </div>
        </div>
      </div>

      {/* Main Split Layout: Orders List (Left) + Order Details & Live WhatsApp Transcript (Right) */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Filterable Orders Stream (5 cols) */}
        <div className="lg:col-span-5 border-r border-white/10 flex flex-col h-full bg-[#0d0e13] overflow-hidden">
          {/* Search & Filter Toolbar */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket #, customer, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {['all', 'new', 'confirmed', 'grilling', 'out_for_delivery', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-mono-num whitespace-nowrap uppercase tracking-wider text-[10px] cursor-pointer ${
                    filterStatus === st
                      ? 'bg-amber-400 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-white bg-zinc-900 border border-white/5'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                No orders match current criteria.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400/50 shadow-md'
                        : 'bg-zinc-900/60 border-white/5 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white font-mono-num">
                            {order.orderNumber}
                          </span>
                          <span className={`text-[10px] font-mono-num uppercase px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-300 font-medium block mt-0.5">
                          {order.customerName}
                        </span>
                      </div>

                      <span className="font-bold font-mono-num text-sm text-amber-400">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-400 line-clamp-1 mb-3">
                      {order.items.map(i => `${i.quantity}x ${i.item.name}`).join(' · ')}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono-num pt-2 border-t border-white/5">
                      <span className="truncate max-w-[200px]">
                        {order.deliveryAddress}
                      </span>
                      <span>
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Order Details & Live WhatsApp Transcript (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#111218] overflow-hidden">
          {selectedOrder ? (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Order Detail Header */}
              <div className="p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#14151c]">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold font-display text-white tracking-tight">
                      {selectedOrder.orderNumber}
                    </h2>
                    <span className={`text-xs font-mono-num uppercase px-2.5 py-0.5 rounded border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono-num mt-1">
                    <span>{selectedOrder.customerName}</span>
                    <span>·</span>
                    <span>{selectedOrder.customerPhone}</span>
                    <span>·</span>
                    <span className="text-amber-400">{selectedOrder.orderType.toUpperCase()}</span>
                  </div>
                </div>

                {/* Pipeline Advance Button */}
                {selectedOrder.status !== 'delivered' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder)}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-2"
                  >
                    <span>Advance Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Order Items & Live WhatsApp Transcript Split */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Kitchen Ticket Summary */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-white/10">
                  <h3 className="text-xs uppercase font-mono-num text-zinc-400 tracking-wider mb-3 flex items-center gap-2">
                    <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kitchen Production Ticket</span>
                  </h3>

                  <div className="space-y-3">
                    {selectedOrder.items.map((cartItem, idx) => (
                      <div key={idx} className="flex justify-between items-start pb-2 border-b border-white/5 last:border-0 last:pb-0">
                        <div>
                          <div className="text-sm font-bold text-white font-display">
                            {cartItem.quantity}x {cartItem.item.name}
                          </div>
                          {cartItem.customization && (
                            <div className="text-xs text-amber-400/90 font-mono-num">
                              {cartItem.customization.doneness && <span>· {cartItem.customization.doneness} </span>}
                              {cartItem.customization.bun && <span>· {cartItem.customization.bun} </span>}
                              {cartItem.customization.extraCheese && <span>· +Extra Raclette </span>}
                              {cartItem.customization.extraPatty && <span>· +Extra Patty </span>}
                              {cartItem.customization.specialInstructions && (
                                <div className="text-zinc-400 italic">"{cartItem.customization.specialInstructions}"</div>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="font-mono-num text-xs text-white">
                          ${(cartItem.calculatedPrice * cartItem.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono-num">
                    <span className="text-zinc-400">Total Billed</span>
                    <span className="font-bold text-base text-amber-400">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Real-time WhatsApp Transcript */}
                <div>
                  <h3 className="text-xs uppercase font-mono-num text-zinc-400 tracking-wider mb-3 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live WhatsApp Conversation Stream</span>
                  </h3>

                  <div className="p-4 rounded-xl bg-[#0b141a] border border-[#2a3942] space-y-3 max-h-72 overflow-y-auto">
                    {selectedOrder.chatHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs ${
                            msg.sender === 'customer'
                              ? 'bg-[#202c33] text-[#e9edef]'
                              : msg.sender === 'kitchen'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-[#005c4b] text-[#e9edef]'
                          }`}
                        >
                          <div className="text-[10px] font-mono-num font-bold text-zinc-400 mb-0.5">
                            {msg.sender === 'customer' ? '👤 Customer' : msg.sender === 'kitchen' ? '🔥 Kitchen Status' : '🤖 EMBER AI Concierge'}
                          </div>
                          <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                          <div className="text-[9px] text-zinc-500 text-right mt-1 font-mono-num">{msg.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Send Direct Kitchen Message / Status Ping */}
                  <form onSubmit={handleSendCustomPing} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Send real-time kitchen WhatsApp dispatch to customer..."
                      value={customKitchenNote}
                      onChange={(e) => setCustomKitchenNote(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={!customKitchenNote.trim()}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Ping</span>
                    </button>
                  </form>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-500">
              Select an order from the stream to view production details and WhatsApp transcript.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
