import { productService } from './productService';
import { TELEGRAM_CONFIG } from '../config/telegram';

const STORAGE_KEY = 'manidam_orders';

// Initial mock orders for demonstration in Admin and Profile
const INITIAL_ORDERS = [
  {
    id: 'ORD-9482',
    date: '2026-10-23T14:32:00.000Z',
    customer: {
      firstName: 'Alisher',
      lastName: 'Halimov',
      phone: '+998 90 123 45 67'
    },
    address: "Toshkent shahar, Yunusobod tumani, 12-mavze, 45-uy",
    paymentMethod: 'Naqd',
    items: [
      { id: '1', name: "Sopol lagan (milliy)", price: 33500, quantity: 1, image: '/src/assets/images/lagan.svg' },
      { id: '3', name: "Milliy choynak", price: 25000, quantity: 1, image: '/src/assets/images/teapot.svg' }
    ],
    itemsTotal: 58500,
    discountAmount: 0,
    deliveryFee: 0,
    total: 58500,
    status: 'completed' // pending, processing, completed, cancelled
  },
  {
    id: 'ORD-9451',
    date: '2026-10-20T11:15:00.000Z',
    customer: {
      firstName: 'Nodira',
      lastName: 'Karimova',
      phone: '+998 99 876 54 32'
    },
    address: "Toshkent shahar, Chilonzor tumani, Bunyodkor ko'chasi 8",
    paymentMethod: 'Payme',
    items: [
      { id: '4', name: "Sifatli quloqchin", price: 120000, quantity: 2, image: '/src/assets/images/earbuds.svg' }
    ],
    itemsTotal: 240000,
    discountAmount: 24000,
    deliveryFee: 0,
    total: 216000,
    status: 'processing'
  }
];

export const orderService = {
  /**
   * Get list of all orders
   */
  getOrders: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  },

  /**
   * Send / create an order.
   * Dispatches real-time Telegram notification to the owner bot.
   * Automatically deducts product stock; if stock reaches 0, removes it.
   */
  sendOrder: async (orderPayload) => {
    const orders = orderService.getOrders();
    const orderId = orderPayload.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      ...orderPayload,
      id: orderId,
      date: new Date().toISOString(),
      status: 'pending'
    };

    // 1. Deduct stock and remove depleted products ("u tugasa o'chib ketadi")
    if (newOrder.items && newOrder.items.length) {
      try {
        productService.deductStock(newOrder.items);
      } catch (stockErr) {
        console.warn('Stock deduction error:', stockErr);
      }
    }

    // 2. Save order to localStorage
    const updated = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // 3. Dispatch Telegram Notification
    try {
      const savedChatId = localStorage.getItem('manidam_telegram_chat_id');
      const chatId = savedChatId || TELEGRAM_CONFIG.defaultChatId;

      const customerName = `${newOrder.customer?.firstName || ''} ${newOrder.customer?.lastName || ''}`.trim() || 'Mijoz';
      const customerPhone = newOrder.customer?.phone || '-';
      const address = newOrder.address || "Ko'rsatilmadi";
      const payment = newOrder.paymentMethod || 'Naqd';
      const totalFormatted = (newOrder.total || 0).toLocaleString('uz-UZ');

      let itemsListText = '';
      if (newOrder.items && newOrder.items.length) {
        itemsListText = newOrder.items.map((it, idx) => {
          const itemTotal = ((it.price || 0) * (it.quantity || 1)).toLocaleString('uz-UZ');
          return `${idx + 1}. <b>${it.name}</b> (x${it.quantity}) — ${itemTotal} so'm`;
        }).join('\n');
      }

      const telegramMsg = `🛍 <b>YANGI BUYURTMA #${orderId}</b>\n\n` +
        `👤 <b>Mijoz:</b> ${customerName}\n` +
        `📞 <b>Telefon:</b> ${customerPhone}\n` +
        `📍 <b>Manzil:</b> ${address}\n` +
        `💳 <b>To'lov:</b> ${payment}\n\n` +
        `📦 <b>Buyurtma tarkibi:</b>\n${itemsListText}\n\n` +
        `💰 <b>Jami summa:</b> ${totalFormatted} so'm\n` +
        `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}`;

      // Send via Telegram Bot API
      fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMsg,
          parse_mode: 'HTML'
        })
      }).catch(err => console.warn('Telegram send failed:', err));
    } catch (telegramErr) {
      console.warn('Telegram bot dispatch error:', telegramErr);
    }

    return newOrder;
  },

  /**
   * Update order status (for admin)
   */
  updateOrderStatus: (orderId, newStatus) => {
    const orders = orderService.getOrders();
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
