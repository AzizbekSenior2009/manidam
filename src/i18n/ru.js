const ru = {
  currency: "сум",
  loading: "Загрузка...",
  free: "бесплатно",
  delete: "удалить",
  close: "Закрыть",
  back: "Назад",
  save: "Сохранить",
  apply: "Применить",
  search: "Поиск",
  all: "Все",
  searchPlaceholder: "Поиск товаров...",
  share: "Поделиться",
  copied: "Ссылка скопирована!",

  nav: {
    home: "Главная",
    favorites: "Избранное",
    cart: "Корзина",
    profile: "Профиль"
  },

  splash: {
    tagline: "Национальный и современный магазин",
    loading: "Загрузка..."
  },

  home: {
    autumnDiscountTitle: "ОСЕННИЕ СКИДКИ!",
    autumnDiscountSubtitle: "На все товары скидки до -30%",
    shopNow: "Купить сейчас",
    searchPlaceholder: "Поиск товаров...",
    addToCart: "В корзину",
    addedToCart: "Добавлено в корзину!",
    categories: "Категории",
    filter: "Фильтр",
    allCategories: "Все",
    phones: "Телефоны",
    appliances: "Бытовая техника",
    clothing: "Одежда",
    pottery: "Керамика",
    accessories: "Аксессуары",
    noProductsFound: "Товары не найдены"
  },

  cart: {
    title: "Моя корзина",
    emptyTitle: "Ваша корзина пуста",
    emptySubtitle: "Выберите понравившиеся товары и добавьте их в корзину",
    startShopping: "Начать покупки",
    promoTitle: "Промокод (купон)",
    promoPlaceholder: "Код купона",
    promoApplied: "Скидка применена (-10%)",
    promoInvalid: "Неверный код купона",
    productsTotal: "Товары:",
    delivery: "Доставка:",
    total: "Итого к оплате:",
    checkoutBtn: "Оформить заказ"
  },

  checkout: {
    title: "Оформление заказа",
    recipientSection: "Получатель",
    firstName: "Имя",
    lastName: "Фамилия",
    phone: "Номер телефона",
    phonePlaceholder: "+998 90 123 45 67",
    addressSection: "Адрес доставки",
    addressPlaceholder: "г. Ташкент, Юнусабадский район...",
    paymentSection: "Способ оплаты",
    cash: "Наличные",
    payme: "Payme",
    click: "Click",
    confirmBtn: "Подтвердить покупку",
    fillRequired: "Пожалуйста, заполните все поля",
    orderSuccessTitle: "Ваш заказ принят!",
    orderSuccessSubtitle: "Наш оператор свяжется с вами в ближайшее время.",
    orderId: "Номер заказа",
    backToHome: "Вернуться на главную",
    orderTotal: "Общая сумма"
  },

  favorites: {
    title: "Любимые товары",
    emptyTitle: "В избранном пока пусто",
    emptySubtitle: "Нажмите на значок сердечка, чтобы сохранить понравившийся товар",
    addToCart: "Добавить в корзину"
  },

  detail: {
    title: "Детали товара",
    infoTitle: "Информация о товаре",
    rating: "Рейтинг",
    stockLeft: "Осталось:",
    pieces: "шт.",
    inStock: "В наличии",
    addToCart: "Добавить в корзину",
    buyNow: "Купить"
  },

  // Profile
  profile: {
    title: "Профиль",
    guestTitle: "Зарегистрируйтесь или войдите",
    guestSubtitle: "Чтобы отслеживать заказы и быстро совершать покупки",
    personalInfo: "Личные данные",
    myOrders: "Мои заказы",
    addresses: "Адреса доставки",
    settings: "Настройки",
    logout: "Выйти из приложения",
    adminPanel: "Панель администратора",
    roleCustomer: "Покупатель",
    roleAdmin: "Владелец магазина (Админ)",
    ordersHistoryTitle: "История заказов",
    noOrders: "У вас пока нет заказов"
  },

  // Admin
  admin: {
    title: "Панель управления",
    exitSession: "Выйти",
    addProduct: "Добавить товар",
    addProductSub: "Размещение нового товара и цен",
    orders: "Заказы",
    ordersSub: "Контроль поступивших заказов",
    customers: "Список клиентов",
    customersSub: "Пользователи и их покупки",
    stats: "Статистика",
    statsSub: "Отчет о доходах и продажах",
    totalOrders: "Всего заказов",
    totalRevenue: "Общая выручка",
    productCount: "Количество товаров",
    customersCount: "Клиенты",
    monthlySales: "Продажи за месяц (млн сум)",
    statusPending: "Ожидает",
    statusProcessing: "В пути",
    statusCompleted: "Доставлен",
    statusCancelled: "Отменен"
  },

  // Admin Login
  adminLogin: {
    title: "Вход администратора",
    subtitle: "Подтвердите пароль для доступа к панели управления",
    passwordLabel: "Пароль администратора",
    submitBtn: "Войти",
    emptyError: "Пожалуйста, введите пароль",
    wrongPassword: "Пароль неверный",
    lockedError: "Слишком много неудачных попыток. Заблокировано на 60 секунд.",
    waitText: "Подождите перед повторной попыткой:"
  },

  // Add Product
  addProductForm: {
    title: "Добавить товар",
    subtitle: "Раздел для добавления нового товара администратором.",
    uploadBox: "Загрузить фото",
    uploadHint: "Выберите фото JPG, PNG или WEBP",
    name: "Название товара",
    namePlaceholder: "Например: Глиняный ляган (национальный)",
    price: "Цена (сум)",
    pricePlaceholder: "33500",
    oldPrice: "Старая цена (до скидки)",
    oldPricePlaceholder: "45000",
    discount: "Скидка %",
    stock: "Сколько осталось?",
    stockPlaceholder: "15",
    category: "Категория",
    location: "Локация",
    description: "Описание товара",
    descriptionPlaceholder: "Подробное описание товара...",
    submitBtn: "Выставить на продажу",
    successMsg: "Товар успешно добавлен!"
  },

  // Auth modal
  auth: {
    registerTitle: "Регистрация",
    registerSubtitle: "Введите данные для совершения покупок",
    loginTitle: "Вход в аккаунт",
    loginSubtitle: "Введите номер телефона и пароль",
    nameLabel: "Имя",
    surnameLabel: "Фамилия",
    phoneLabel: "Номер телефона",
    passwordLabel: "Пароль",
    googleLogin: "Войти через Google",
    orDivider: "или",
    registerBtn: "Зарегистрироваться",
    loginBtn: "Войти",
    haveAccount: "Уже есть аккаунт?",
    loginLink: "Войти",
    noAccount: "Нет аккаунта?",
    registerLink: "Зарегистрироваться",
    fillRequired: "Пожалуйста, заполните обязательные поля",
    passwordTooShort: "Пароль должен содержать не менее 3 символов",
    loginFailed: "Неверный номер телефона или пароль",
    errorOccurred: "Произошла ошибка, попробуйте еще раз"
  },

  // Notifications
  notifications: {
    title: "Уведомления",
    empty: "Нет новых уведомлений",
    sample1Title: "Осенние скидки начались!",
    sample1Text: "Скидки до 30% на всю керамику и аксессуары.",
    sample2Title: "Ваш заказ в пути",
    sample2Text: "Курьер везет ваш заказ."
  }
};

export default ru;
