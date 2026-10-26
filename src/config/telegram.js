// Telegram Bot Configuration
// Agar token yoki chat_id o'zgarsa, shu yerdan yoki .env faylidan o'zgartirishingiz mumkin.

export const TELEGRAM_CONFIG = {
  token: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8448031160:AAEzLEbVYfUBuY6th4WJpvys4q_Rc0HUYbc',
  defaultChatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '5744702475'
};
