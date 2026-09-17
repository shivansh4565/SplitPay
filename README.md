# 💸 SplitPay - Smart UPI Bill Splitter

A modern, privacy-focused, zero-database UPI installment payment web application that splits large merchant payments into multiple smaller installments where **each individual payment is strictly below ₹2,000** (default max: ₹1,999.00).

Built with **React 18**, **Vite**, **Tailwind CSS**, and **LocalStorage** for 100% client-side privacy, instantaneous performance, and effortless deployment to **Vercel**.

---

## 🌟 Key Features

1. **Merchant QR Scanner & Decoder**:
   - Drag & drop or upload merchant QR code images (PNG, JPG, WebP).
   - Real-time webcam / camera QR scanner built with `jsQR` and HTML5 Canvas.
   - Automatically decodes merchant name (`pn`), UPI VPA (`pa`), and merchant category codes (`mc`).
   - Built-in sample test merchant presets (Cafe Bliss, Apollo Pharmacy, Croma).

2. **Safe Integer-Paise Split Algorithm**:
   - Strictly enforces Indian banking limits: `0 < paymentAmount < ₹2,000`.
   - Default maximum installment chunk: `₹1,999.00`.
   - Uses integer-paise math (`totalPaise = Math.round(amount * 100)`) to eliminate JavaScript IEEE-754 floating-point rounding bugs.

3. **UPI Deep Linking & Desktop QR**:
   - **Launch App**: Seamlessly opens installed UPI apps on mobile (Google Pay, PhonePe, Paytm, CRED, BHIM) via standard `upi://pay` intents.
   - **Show QR**: Generates dynamic on-screen scannable QR codes for desktop users with one-tap payment confirmation.

4. **Sequential Installment Unlocking**:
   - Payments unlock sequentially (Part 1 ➔ Part 2 ➔ Part 3).
   - Real-time progress bar tracking paid amounts and remaining balances.

5. **Client Local Storage & Receipt System (No Database Required)**:
   - **Zero Database Dependency**: Active sessions and history are saved locally in browser `localStorage`.
   - **Automatic Receipt Archiving**: Completed payments are saved to local history.
   - **Print / Save as PDF**: Formatted digital invoice modal with dedicated single-page print stylesheet.
   - **Copy Text Summary**: One-click copy formatted receipt for WhatsApp, SMS, or notes.
   - **Receipts Manager**: Accessible anytime via the "Receipts" button in the navigation bar.

6. **Design & Polish**:
   - High-fidelity Emerald Dark (`#051811`) and Light themes with seamless toggling.
   - Floating pill navbar, interactive hero mockup cards, 8-card feature showcase, and animated celebration confetti.

---

## 🛠 Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti, QRCode, jsQR
* **Storage**: Browser `localStorage` (Zero database setup needed)
* **Backend (Optional API)**: Node.js, Express.js (In-memory session engine)
* **Deployment**: Optimized for Vercel (Static SPA + client routing)

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/splitpay.git
cd splitpay
```

### 2. Run the Frontend (Vite)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Backend (Optional)
```bash
cd server
npm install
npm run test    # Runs splitAmount test suite
npm start       # Starts server on port 5000
```


## 📁 Project Structure

```text
upi-splitter/
├── vercel.json                  # Vercel deployment configuration
├── README.md                    # Project documentation
│
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Floating pill navbar with theme & receipts
│   │   │   ├── HeroSection.jsx          # Hero header & live interactive preview cards
│   │   │   ├── MerchantQRCard.jsx       # QR upload, camera scanner & presets
│   │   │   ├── CameraScannerModal.jsx   # Live webcam / camera QR scanner
│   │   │   ├── AmountInputCard.jsx      # Amount input with live split preview
│   │   │   ├── PaymentProgressCard.jsx  # Visual progress meter
│   │   │   ├── PaymentPartCard.jsx      # Installment card (Launch App / Show QR)
│   │   │   ├── PaymentQrModal.jsx       # Scannable desktop QR modal
│   │   │   ├── PaymentConfirmModal.jsx  # Confirmation modal
│   │   │   ├── CompletionState.jsx      # Celebration, summary & receipt actions
│   │   │   ├── ReceiptModal.jsx         # Printable PDF receipt template
│   │   │   ├── ReceiptHistoryModal.jsx  # Saved receipts history manager
│   │   │   ├── FeaturesSection.jsx      # 8-card feature showcase
│   │   │   ├── HowItWorksSection.jsx    # 4-step workflow cards
│   │   │   └── Footer.jsx               # Footer
│   │   ├── hooks/
│   │   │   ├── useTheme.js              # Dark/light mode hook
│   │   │   └── usePaymentSession.js     # Session state & localStorage sync
│   │   ├── utils/
│   │   │   ├── formatters.js            # Currency & number formatters
│   │   │   ├── receiptStorage.js        # LocalStorage receipt manager
│   │   │   ├── splitAmount.js           # Safe integer paise splitting logic (< ₹2,000)
│   │   │   ├── upiDecoder.js            # QR code parsing with jsQR
│   │   │   └── upiDeepLink.js           # upi://pay intent generation
│   │   ├── App.jsx                      # Main app component
│   │   ├── main.jsx                     # Vite entry
│   │   └── index.css                    # Tailwind CSS & animations
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
│
└── server/                      # Optional lightweight Node/Express API
    ├── controllers/
    │   ├── paymentController.js
    │   └── paymentSessionController.js
    ├── routes/
    │   ├── paymentRoutes.js
    │   └── paymentSessionRoutes.js
    ├── utils/
    │   ├── splitAmount.js
    │   └── splitAmount.test.js
    ├── server.js
    └── package.json
```

---

## 🔒 Security & Privacy

* **No Financial Credentials**: The application never touches or asks for UPI PINs, OTPs, CVVs, or bank logins.
* **Direct Peer-to-Peer**: All UPI intents open directly in your authentic UPI applications (Google Pay, PhonePe, Paytm, BHIM, etc.).
* **100% Client-Side Privacy**: Payment plans and receipts remain safely on your personal device in browser `localStorage`.

---

## ⚠️ Disclaimer

This application is an open-source utility designed to facilitate bill splitting and standard UPI intent links. It does not act as a payment gateway, banking institution, or payment aggregator. All transactions take place directly between your banking app and the recipient merchant.
