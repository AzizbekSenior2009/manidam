import { OWNER_CONFIG } from '../config/owner';

const USER_KEY = 'manidam_user';
const USERS_LIST_KEY = 'manidam_users_database';
const ADMIN_SESSION_KEY = 'manidam_admin_unlocked';

/**
 * Isolated Authentication Service
 * Currently mock with localStorage / sessionStorage.
 * Ready for future backend/JWT/Firebase replacement.
 */
export const authService = {
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  getAllUsers: () => {
    try {
      const stored = localStorage.getItem(USERS_LIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  register: async ({ name, surname, phone, password }) => {
    const cleanPhone = phone.trim();
    const cleanOwnerPhone = OWNER_CONFIG.phone.replace(/\s+/g, '');
    const cleanInputPhone = cleanPhone.replace(/\s+/g, '');

    const isOwnerMatch = cleanInputPhone === cleanOwnerPhone && password === OWNER_CONFIG.password;
    const role = isOwnerMatch ? 'admin' : 'customer';

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      surname: surname.trim(),
      phone: cleanPhone,
      role
    };

    // Save to registered users list (for mock login verification)
    const allUsers = authService.getAllUsers();
    const existingIndex = allUsers.findIndex(u => u.phone.replace(/\s+/g, '') === cleanInputPhone);
    const userToSave = { ...newUser, password };
    if (existingIndex > -1) {
      allUsers[existingIndex] = userToSave;
    } else {
      allUsers.push(userToSave);
    }
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(allUsers));

    // Set active session
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
  },

  login: async ({ phone, password }) => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const cleanOwnerPhone = OWNER_CONFIG.phone.replace(/\s+/g, '');

    // Check owner credentials
    if (cleanPhone === cleanOwnerPhone && password === OWNER_CONFIG.password) {
      const ownerUser = {
        id: 'owner-1',
        name: OWNER_CONFIG.name || 'Alisher',
        surname: OWNER_CONFIG.surname || 'Halimov',
        phone: OWNER_CONFIG.phone,
        role: 'admin'
      };
      localStorage.setItem(USER_KEY, JSON.stringify(ownerUser));
      return { success: true, user: ownerUser };
    }

    // Check mock registered users
    const allUsers = authService.getAllUsers();
    const user = allUsers.find(u => u.phone.replace(/\s+/g, '') === cleanPhone && u.password === password);

    if (user) {
      const sessionUser = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
        role: user.role || 'customer'
      };
      localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }

    // For effortless mock demo: if user entered valid phone and password >= 3 chars, accept as customer
    if (cleanPhone.length >= 9 && password && password.length >= 3) {
      const demoUser = {
        id: 'usr-' + Date.now(),
        name: 'Foydalanuvchi',
        surname: '',
        phone,
        role: 'customer'
      };
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    return { success: false, error: 'Parol yoki telefon raqami noto\'g\'ri' };
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  },

  verifyAdminPassword: (password) => {
    const clean = String(password || '').trim();
    if (clean === '3066' || clean === OWNER_CONFIG.password || clean === 'admin') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  },

  isAdminSessionActive: () => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  },

  exitAdminSession: () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
};
