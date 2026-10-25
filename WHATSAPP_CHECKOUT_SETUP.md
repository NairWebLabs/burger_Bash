# Reusable WhatsApp Checkout Integration — Setup & Client Onboarding Guide

This guide explains how to enable, configure, test, and deploy the reusable WhatsApp checkout flow for any freelance client without rewriting the core frontend code.

---

## 1. Architecture Overview

The checkout integration is designed as a **modular, configuration-driven, low-cost workflow**:
- **Zero code rewrites per client**: All client-specific identity, phone numbers, currencies, delivery fees, and message templates are centralized in `src/config/whatsappCheckout.ts` (with environment variable overrides).
- **Price Security & Integrity**: Order totals are calculated from the trusted master menu/product catalog in `src/utils/whatsappCheckout.ts`, not from unchecked client payloads.
- **Official Click-to-Chat**: Uses the official WhatsApp protocol (`https://wa.me/<CLEAN_PHONE>?text=<ENCODED_MESSAGE>`).
- **Customer Consent**: The browser opens WhatsApp with the order prefilled; the customer must tap **Send** themselves.
- **Invoice & Merchant Toolkit**: An integrated Receipt & Invoice Modal (`OrderReceiptModal.tsx`) provides verified line item breakdowns, unverified draft disclaimers, merchant payment instructions (UPI / COD), and copy-ready templates.

---

## 2. Client Onboarding Checklist

When onboarding a new freelance client, you only need to configure values in **one of two ways**:
1. Via **Environment Variables** (recommended for production deployments), OR
2. Directly inside **`src/config/whatsappCheckout.ts`** (defaults for client repository).

### Quick Onboarding Steps:
1. **Business Name**: Set client's trading name (`VITE_BUSINESS_NAME`).
2. **WhatsApp Number**: Set international format without `+` or spaces (e.g., `15552348901` for US or `919876543210` for India).
3. **Display Phone**: Set formatted display phone for UI header (`VITE_WHATSAPP_PHONE_DISPLAY`).
4. **Currency**: Set currency symbol (`VITE_CURRENCY_SYMBOL`, e.g., `$`, `₹`, `£`, `€`) and ISO code (`USD`, `INR`, `EUR`).
5. **Delivery Rules**:
   - `VITE_DELIVERY_FEE`: Flat shipping/delivery charge (e.g. `3.50` or `50`).
   - `VITE_FREE_DELIVERY_THRESHOLD`: Cart subtotal for free delivery (e.g. `45.00` or `500`). Set to `0` or `999999` to disable free delivery.
   - `VITE_MIN_ORDER_AMOUNT`: Minimum checkout amount if applicable.
6. **Payment & UPI**:
   - `VITE_MERCHANT_UPI_ID`: (Optional for Indian merchants) e.g., `store@okhdfcbank`.
7. **Message Templates**: Customize message wording in `whatsappCheckoutConfig.templates` if client prefers custom phrasing.

---

## 3. Configuration Reference Table

| Setting | Env Variable | Example Value | Description |
|---|---|---|---|
| Business Name | `VITE_BUSINESS_NAME` | `"EMBER & BRIOCHE ATELIER"` | Store name shown on site, invoice, and message |
| WhatsApp Phone | `VITE_WHATSAPP_PHONE` | `"15552348901"` | Pure digits: country code + subscriber number (no `+`, no `-`) |
| Phone Display | `VITE_WHATSAPP_PHONE_DISPLAY` | `"+1 (555) 234-8901"` | Formatted string shown to customers in UI |
| Store Address | `VITE_BUSINESS_ADDRESS` | `"148 Franklin St, Tribeca, NY"` | Physical store location or city tagline |
| Currency Symbol | `VITE_CURRENCY_SYMBOL` | `"$"` or `"₹"` | Symbol prefixed to all item and order prices |
| Currency Code | `VITE_CURRENCY_CODE` | `"USD"` or `"INR"` | 3-letter ISO 4217 code |
| Delivery Fee | `VITE_DELIVERY_FEE` | `3.50` | Default delivery charge |
| Free Delivery Over | `VITE_FREE_DELIVERY_THRESHOLD` | `45.00` | Subtotal where delivery fee becomes $0 |
| Minimum Order | `VITE_MIN_ORDER_AMOUNT` | `0.00` | Minimum subtotal required before checkout |
| Order Ref Prefix | `VITE_ORDER_PREFIX` | `"ORD"` or `"BURGER"` | Prefix for browser reference (e.g. `ORD-261024-8492`) |
| Merchant UPI ID | `VITE_MERCHANT_UPI_ID` | `"merchant@upi"` | Optional UPI ID for direct payment requests |

---

## 4. How to Test the Entire Checkout Flow

1. **Open the Website**:
   - Navigate to the storefront in your browser.
2. **Add Products to Bag**:
   - Select any burger, configure doneness/bun/add-ons in the modal, and click **Add to Atelier Bag**.
3. **Open Cart Drawer**:
   - Click the **Bag** button in the top navigation.
   - Verify that quantity adjustments and item removals recalculate the subtotal.
   - Switch between **Direct Delivery** and **Atelier Counter Pickup**. Note that the delivery fee updates dynamically based on the configured free threshold.
4. **Enter Customer Details**:
   - Fill in Customer Name, WhatsApp Phone Number, and Delivery Address.
5. **Click "Proceed to WhatsApp Checkout"**:
   - The system triggers trusted calculation, verifies prices against the catalog, and generates a unique browser draft reference (e.g., `ORD-261024-XXXX`).
   - A new browser tab opens to the official WhatsApp URL (`https://wa.me/<CLEAN_PHONE>?text=...`).
   - The message in WhatsApp contains the itemized order breakdown, quantities, delivery address, notes, and total.
6. **Inspect the In-App Order Receipt Modal**:
   - Verify that the **Order Receipt & Draft Summary** modal appears with the exact line item breakdown, delivery fee, and payment instructions.
   - Test copying the **Text Receipt**, **Payment Request Message**, and **Thank-You Message** via the quick-copy buttons.

---

## 5. Security & Trust Principles

1. **Client-Side Pricing Defense**:
   - The `calculateTrustedOrder` function in `src/utils/whatsappCheckout.ts` looks up every item by its ID in the master catalog. If a client attempts to pass a modified price, the trusted catalog price is used.
2. **Clear Distinction from Database Orders**:
   - All outgoing messages and UI banners explicitly designate the order as an **unverified draft inquiry** (`ORD-YYMMDD-XXXX`), preventing any misunderstanding that an automated backend processed or verified payment.
3. **No Secret Exposure**:
   - Only `VITE_` public client settings exist in frontend bundles. No private keys, gateway credentials, or webhook secrets are placed in client code.

---

## 6. Hosting & Deployment Guide

The frontend is a Vite + React SPA that can be built into a static bundle (`npm run build` outputs to `dist/`), or run as a full-stack Node/Express server (`server.ts`).

### Recommended Free / Low-Cost Hosting Options

| Hosting Provider | Compatibility | Custom Domain | Commercial Terms Warning |
|---|---|---|---|
| **Cloudflare Pages** *(Recommended for Freelance)* | 100% SPA compatible (upload `dist/`) | Free custom domain + SSL | Free tier allows commercial projects; unlimited bandwidth. Excellent for client sites. |
| **Netlify** | 100% SPA compatible | Free custom domain + SSL | Free plan allows commercial projects with 100GB bandwidth/month and 300 build minutes. |
| **Vercel** | 100% SPA compatible | Free custom domain + SSL | **Important:** Vercel Hobby (Free) plan terms strictly prohibit commercial/for-profit client projects. Paid Pro ($20/mo) is required for client commercial stores. |
| **Render / Cloud Run** | Full-stack (with `server.ts`) | Free custom domain | Free web service on Render spins down after inactivity. AI Studio Cloud Run hosts automatically. |

### Build Command & Publish Directory:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Rewrite Rule** (for Netlify `_redirects` or Cloudflare `_routes.json`):
  ```
  /*    /index.html   200
  ```

---

## 7. Migration Roadmap: Future Paid WhatsApp Business & Payment Gateways

The current architecture is intentionally structured so that upgrading to an automated, paid enterprise workflow requires zero frontend redesign:

```
[Current Low-Cost Version]
Customer Cart -> Browser Click-to-Chat (wa.me) -> Manual WhatsApp Confirmation by Merchant -> Manual UPI/COD

                              ⬇ Upgrade Path

[Future Automated Enterprise Version]
Customer Cart -> Razorpay / Stripe Order API -> Verified Webhook Payment -> WhatsApp Cloud API Automated Webhook Dispatch
```

### Steps to Implement Paid APIs Later:
1. **WhatsApp Cloud API (Meta for Developers)**:
   - Register a Meta Business Manager account and verify a dedicated phone number.
   - Implement an automated server endpoint (`POST /api/webhooks/whatsapp`) to receive incoming messages.
   - Send automated WhatsApp Template Messages (`order_confirmation`, `shipping_update`) via the Meta Graph API without relying on client `wa.me` clicks.
2. **Payment Gateway Integration (Razorpay / Stripe)**:
   - Implement backend endpoint `/api/payment/create-order` returning a signed order token.
   - Mount Razorpay Checkout (`new window.Razorpay(options)`) or Stripe Elements in the frontend.
   - On successful payment signature verification on the server webhook, transition order status to `PAID` and automatically trigger WhatsApp delivery notification.
