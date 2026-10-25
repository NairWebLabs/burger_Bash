import React, { useState } from 'react';
import { OrderMessagePayload, whatsappCheckoutConfig } from '../config/whatsappCheckout';
import { 
  X, Check, Copy, ExternalLink, ShieldAlert, 
  Receipt, MessageSquare, AlertCircle, FileText, CheckCircle2 
} from 'lucide-react';

interface OrderReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderMessagePayload | null;
  whatsappUrl?: string;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  isOpen,
  onClose,
  order,
  whatsappUrl
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const cur = whatsappCheckoutConfig.currency.symbol;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const receiptText = whatsappCheckoutConfig.templates.formatReceiptMessage(order);
  const paymentText = whatsappCheckoutConfig.templates.formatPaymentRequestMessage(order);
  const thankYouText = whatsappCheckoutConfig.templates.formatThankYouMessage(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#111217] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#16171f] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/10 text-amber-400 rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                ORDER RECEIPT & DRAFT SUMMARY
              </h2>
              <div className="text-xs font-mono-num text-zinc-400">
                Reference: <span className="text-amber-400 font-bold">{order.orderReference}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Important Workflow Notice (Requirement 3 & 4) */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300/90 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-amber-300">Action Required: </span>
              Your order draft is generated in the browser. It is <strong className="underline">not automatically sent</strong> or charged. You must click below to open WhatsApp and tap <strong>Send</strong> so our team can confirm availability and coordinate payment.
            </div>
          </div>

          {/* Business & Customer Info Card */}
          <div className="p-4 bg-zinc-900/60 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono-num text-zinc-500 uppercase tracking-wider block mb-1">
                Merchant Details
              </span>
              <p className="font-bold text-white font-display text-sm">{whatsappCheckoutConfig.businessName}</p>
              <p className="text-zinc-400">{whatsappCheckoutConfig.businessAddress}</p>
              <p className="text-amber-400/90 font-mono-num mt-1">WhatsApp: {whatsappCheckoutConfig.businessPhoneDisplay}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono-num text-zinc-500 uppercase tracking-wider block mb-1">
                Customer & Delivery
              </span>
              <p className="font-bold text-white text-sm">{order.customerName}</p>
              <p className="text-zinc-400 font-mono-num">{order.customerPhone}</p>
              <p className="text-zinc-300 mt-1">
                {order.orderType === 'delivery' ? `📍 ${order.deliveryAddress}` : '🏪 Atelier Counter Pickup'}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h4 className="text-[11px] font-mono-num text-zinc-400 uppercase tracking-wider mb-2 font-bold">
              Item Breakdown (Verified Pricing)
            </h4>
            <div className="divide-y divide-white/5 border border-white/5 rounded-xl bg-zinc-900/40 overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-white">
                      {item.quantity}x {item.name}
                    </div>
                    {item.customizationDetails && (
                      <div className="text-[11px] text-zinc-400 font-mono-num">
                        {item.customizationDetails}
                      </div>
                    )}
                  </div>
                  <div className="font-mono-num text-white font-semibold">
                    {cur}{item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="p-4 bg-zinc-900/60 rounded-xl border border-white/5 space-y-1.5 font-mono-num">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span className="text-white">{cur}{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Delivery Charge</span>
              <span className="text-white">
                {order.deliveryFee === 0 ? 'FREE' : `${cur}${order.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
              <span className="font-display uppercase tracking-wider">Total Amount</span>
              <span className="text-amber-400">{cur}{order.total.toFixed(2)}</span>
            </div>
            <div className="pt-2 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Payment Status</span>
              <span className="text-amber-400 font-bold uppercase">Pending Manual Confirmation</span>
            </div>
          </div>

          {/* Payment Instructions Card */}
          <div className="p-4 bg-zinc-900/60 rounded-xl border border-white/5 space-y-2">
            <h4 className="text-[11px] font-mono-num text-zinc-300 uppercase tracking-wider font-bold">
              Payment Instructions (Merchant Policy)
            </h4>
            <p className="text-zinc-300 leading-relaxed">
              {whatsappCheckoutConfig.payment.instructions}
            </p>
            {whatsappCheckoutConfig.payment.upiId && (
              <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between font-mono-num text-[11px]">
                <span className="text-zinc-400">Official UPI ID:</span>
                <span className="text-amber-400 font-bold">{whatsappCheckoutConfig.payment.upiId}</span>
              </div>
            )}
            <p className="text-[10px] text-zinc-500 italic">
              * Note: Sending payment screenshot does not automatically mark an order paid. The business owner verifies payment in their bank or merchant account before cooking.
            </p>
          </div>

          {/* Merchant Toolkit Copy Actions */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono-num text-zinc-500 uppercase tracking-wider block mb-2">
              Merchant Communication Templates (Quick Copy)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(receiptText, 'receipt')}
                className="p-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[11px] transition-colors cursor-pointer border border-white/5 flex items-center justify-center gap-1.5"
              >
                {copiedType === 'receipt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copiedType === 'receipt' ? 'Copied Receipt' : 'Copy Text Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(paymentText, 'payment')}
                className="p-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[11px] transition-colors cursor-pointer border border-white/5 flex items-center justify-center gap-1.5"
              >
                {copiedType === 'payment' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copiedType === 'payment' ? 'Copied UPI Request' : 'Copy Payment Msg'}</span>
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(thankYouText, 'thankyou')}
                className="p-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[11px] transition-colors cursor-pointer border border-white/5 flex items-center justify-center gap-1.5"
              >
                {copiedType === 'thankyou' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copiedType === 'thankyou' ? 'Copied Thank You' : 'Copy Thank-You'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#16171f] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Close Summary
          </button>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-zinc-950" />
              <span>Open WhatsApp & Send Order</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-950" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
