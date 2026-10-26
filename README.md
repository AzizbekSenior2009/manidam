# MANIDAM.S — Frontend Web App (Mobile-First)

A mobile-first e-commerce web application for **"MANIDAM.S"** (Milliy va Zamonaviy Onlayn Do'kon), crafted in React (Vite) with plain CSS and modern JavaScript. The interface matches the provided design mockups 1:1 with deep emerald green and gold aesthetics, phone frame preview on desktop, and smooth responsive layouts.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in your browser:
# http://localhost:5173 (or port shown in terminal)
```

To create a production build:
```bash
npm run build
npm run preview
```

---

## 🎨 Design System

- **Background Palette**:
  - Main background: `#0F2A22` (deep dark green)
  - Card background: `#153629`
  - Secondary card background: `#1B4033`
- **Gold Accent Palette**:
  - Primary gold: `#D4AF37`
  - Gold light: `#F1D675`
  - Gold dark: `#A8841F`
  - Gold gradient: `linear-gradient(135deg, #F1D675, #D4AF37, #A8841F)`
  - Gold border: `rgba(212, 175, 55, 0.25)`
- **Typography**:
  - Headings & Logo: `"Playfair Display"` (Google Fonts)
  - Body & UI: `"Inter"` (Google Fonts)
- **Radii**: Cards `16px`, Buttons `12px`, Inputs `12px`, Pills `9999px`
- **Device Frame**: On screens > 480px, the application displays in a centered iPhone 15/16 Pro frame (max width 430px) with dynamic island notch simulation; on mobile screens it fills 100% width seamlessly.

---

## 📱 Pages & Features Implemented

1. **Splash Screen (`/splash`, `/`)**:
   - Dark green background with scattered gold confetti dots
   - Centered metallic gold shopping bag logo with letter "M"
   - Gold serif `"MANIDAM.S"` title
   - Radial 12-tick golden circular spinner with `"Yuklanmoqda..."`
   - Auto-transitions to `/home` after ~2 seconds (or tap to skip)

2. **Home (`/home`)**:
   - Header with brand logo, `"MANIDAM.S"`, notification bell (opens notifications drawer with sample alerts), search icon
   - Real-time search bar `"Mahsulot qidirish..."` with filter sliders button
   - Always-accessible language switcher: `UZ / RU / EN`
   - Auto-sliding banner carousel: `"KUZGI CHEGIRMALAR! Barcha mahsulotlarga -30% gacha"` with 3D gift box illustration, `"Xarid qilish"` button, and active gold pill dots
   - Horizontal category carousel with circular gold ring borders:
     `Barchasi`, `Telefonlar`, `Maishiy texnika`, `Kiyimlar`, `Sopol idishlar`, `Aksessuarlar`
   - 2-column product grid with discount badges (`-25%`, `-15%`, `-10%`), favorites heart button, location pin, and quick `"Savatga olish"` or `"+"` add-to-cart buttons
   - Fixed bottom navigation bar with live cart count badge

3. **Cart (`/cart`)**:
   - Back button and centered title `"Mening savatim"`
   - Cart item cards with image, name, price, quantity stepper (`- 1 +`), trash icon and `"o'chirish"` text
   - Promo-code block: input `"Kupon-kod"` + apply/clear button (try coupon code `MANIDAM10` or `KUZ30` for discounts)
   - Order summary: `"Mahsulotlar: 56.500 so'm"`, `"Yetkazib berish: bepul"`
   - Primary gold button `"Buyurtma berish"` navigating to Checkout

4. **Checkout (`/checkout`)**:
   - Section `"Qabul qiluvchi"`: Ism, Familiya, Telefon raqami (`+998 XX XXX XX XX` auto-formatting mask & validation)
   - Section `"Yetkazib berish manzili"`: delivery address textarea
   - Section `"To'lov turi"`: 3 selectable pills — `Naqd`, `Payme`, `Click` (gold border on active)
   - Primary gold button `"Sotib olishni tasdiqlash"`
   - Order confirmed modal with celebratory confetti, order ID, and summary, clears the cart, and saves the order to localStorage via `services/orderService.js`

5. **Favorites (`/favorites`)**:
   - 2-column grid of saved products with filled red heart badges and `"Savatga qo'shish"` buttons
   - Interactive heart toggle and empty state

6. **Product Detail (`/product/:id`)**:
   - Back button, heart toggle, and native share button (with clipboard fallback toast)
   - Large main product image
   - Thumbnail gallery below (clicking any thumbnail dynamically updates the main image)
   - Name, price, red discount badge, stock info (`"Qolgan: 14 dona"`)
   - Description block `"Mahsulot haqida ma'lumot"` with 5-star rating (4.9)
   - Action buttons: `"Savatga qo'shish"` (outline gold) and `"Sotib olish"` (gold gradient, adds to cart and proceeds to checkout)

7. **Profile (`/profile`)**:
   - **Guest**: Friendly card with `"Ro'yxatdan o'ting yoki kiring"` and Register/Login buttons. No admin item.
   - **Customer**: Clean user card with avatar, name, and phone. Standard menu items: *Shaxsiy ma'lumotlar*, *Mening buyurtmalarim* (`/my-orders`), *Yetkazib berish manzillari*, *Sozlamalar*, *Ilovadan chiqish*. The admin item is strictly hidden and the admin route is blocked.
   - **Owner**: If logged in with owner credentials (`role === "admin"`), an additional menu item appears at the bottom with a gold shield icon: `"Admin panel"`.

8. **Admin Kirish (`/admin-login`) & Admin Panel (`/admin`)**:
   - **Dedicated Admin Login Page**: Tapping `"Admin panel"` from the owner profile opens a separate dark-green page `/admin-login` with a gold lock icon, title `"Admin kirish"`, password input, and gold `"Kirish"` button.
   - **Security Simulation**: Wrong password shows `"Parol noto'g'ri"` with a card shake animation. After 5 consecutive failed attempts, it locks out for 60 seconds with an active countdown timer.
   - **Session Verification**: Passing the password unlocks the admin session stored in `sessionStorage` (cleared when the browser tab/app is closed).
   - **Admin Panel (Boshqaruv)**:
     - 4 action cards matching the mockup:
       1. `"Mahsulot qo'shish"`: navigates to product upload form (`/admin/add-product`)
       2. `"Buyurtmalar"`: lists incoming customer orders with status toggles (`Kutilmoqda`, `Yetkazilmoqda`, `Yetkazildi`, `Bekor qilish`)
       3. `"Mijozlar ro'yxati"`: registered customers and their spending
       4. `"Statistika"`: KPIs and monthly sales CSS bar chart
     - Top bar `"Chiqish"` button: locks the admin session and returns to Profile.
   - **Route Guard (`<AdminRoute>`)**: Directly typing `/admin` or `/admin/add-product` redirects non-owners to `/home` and unverified owners to `/admin-login`.

9. **Add Product Form (`/admin/add-product`)**:
   - Dashed image upload box with camera icon `"Rasm yuklash"`, live preview, and quick image presets
   - Inputs: Mahsulot nomi, Narxi, Eski narxi, Chegirma % (auto-calculates), Qancha qolgan?, Mahsulot turi (category), Qayerda? (regions of Uzbekistan), description
   - Gold button `"Sotuvga chiqarish"`: saves to product catalog in localStorage and displays on Home immediately. Restricted strictly to admin.

10. **Auth & Guest Action Gate (`requireAuth`)**:
    - **Guest Browsing**: Guests can explore Home, categories, search, and product details freely.
    - **Action Gate**: The first time a guest taps `"Savatga olish"`, `"+"`, `"Savatga qo'shish"`, `"Sotib olish"`, or the favorite heart icon, the action is paused and the Register bottom-sheet modal opens.
    - **Register Form**: Ism, Familiya, Telefon raqami (`+998 XX XXX XX XX` auto-mask & validation), Parol, plus `"Google bilan kirish"` button and `"Hisobingiz bormi? Kirish"` link to switch to Login.
    - **Auto-Completion**: Upon successful registration or login, the modal closes and the tapped action is automatically executed (e.g. product added to cart).
    - **Checkout**: Auto-fills Ism, Familiya, and Telefon from the authenticated user.

---

## 🔑 Owner / Admin Credentials

Configured in [`src/config/owner.js`](file:///home/azizbek/manidam.s/src/config/owner.js):
- **Phone**: `+998 90 000 00 00`
- **Password**: `admin`

*Note: Entering these exact credentials during login or registration assigns the `admin` role. Any other credentials create a `customer` account.*

---

## 🔌 Where to Plug In the Backend & Telegram Bot

The data layer is isolated in `src/services/` and easy to connect:

### 1. Connecting Telegram Bot & Order API
Open [`src/services/orderService.js`](file:///home/azizbek/manidam.s/src/services/orderService.js#L54):
```javascript
sendOrder: async (orderPayload) => {
  // 1. Send order to your backend API:
  // const response = await fetch('https://api.yourdomain.uz/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(orderPayload)
  // });
  // const data = await response.json();

  // 2. Or send directly to Telegram Bot:
  // const BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
  // const CHAT_ID = "YOUR_TELEGRAM_CHAT_ID";
  // const message = `🛍 <b>Yangi Buyurtma #${orderPayload.id}</b>\n` +
  //   `👤 <b>Mijoz:</b> ${orderPayload.customer.firstName} ${orderPayload.customer.lastName}\n` +
  //   `📞 <b>Telefon:</b> ${orderPayload.customer.phone}\n` +
  //   `📍 <b>Manzil:</b> ${orderPayload.address}\n` +
  //   `💰 <b>Jami:</b> ${orderPayload.total.toLocaleString()} so'm\n` +
  //   `💳 <b>To'lov:</b> ${orderPayload.paymentMethod}`;
  //
  // await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
  // });
}
```

### 2. Connecting Product Catalog API
Open [`src/services/productService.js`](file:///home/azizbek/manidam.s/src/services/productService.js#L11):
Replace `getProducts`, `addProduct`, and `updateProduct` with your backend REST endpoints or GraphQL queries.

---

## 🗂 Project Structure

```
src/
├── assets/
│   └── images/          # Gold logo, lagan, smartphone, teapot, earbuds, etc. (SVGs)
├── components/
│   ├── AuthModal.jsx / .css
│   ├── BannerCarousel.jsx / .css
│   ├── BottomNav.jsx / .css
│   ├── CategoryCarousel.jsx / .css
│   ├── Header.jsx / .css
│   ├── LangSwitcher.jsx / .css
│   ├── NotificationModal.jsx / .css
│   ├── ProductCard.jsx / .css
│   ├── QuantityStepper.jsx / .css
│   └── StatusBar.jsx / .css
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── FavoritesContext.jsx
│   ├── LangContext.jsx
│   └── ProductsContext.jsx
├── data/
│   ├── categories.js
│   └── products.js
├── i18n/
│   ├── uz.js            # Default Uzbek dictionary
│   ├── ru.js            # Russian dictionary
│   ├── en.js            # English dictionary
│   └── index.js
├── pages/
│   ├── AddProduct.jsx / .css
│   ├── AdminPanel.jsx / .css
│   ├── Cart.jsx / .css
│   ├── Checkout.jsx / .css
│   ├── Favorites.jsx / .css
│   ├── Home.jsx / .css
│   ├── MyOrders.jsx / .css
│   ├── ProductDetail.jsx / .css
│   ├── Profile.jsx / .css
│   └── Splash.jsx / .css
├── services/
│   ├── orderService.js  # Order persistence + Telegram bot hook
│   └── productService.js# Catalog persistence + API hook
├── styles/
│   ├── variables.css    # Colors, fonts, radius tokens
│   └── global.css       # Resets, animations, phone container
├── utils/
│   └── format.js        # Money formatting ('33 500 so'm') & phone mask
├── App.jsx
├── index.css
└── main.jsx
```
# manidam
