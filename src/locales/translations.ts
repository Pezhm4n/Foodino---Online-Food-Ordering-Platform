export type Language = 'fa' | 'en';

interface Translation {
  [key: string]: string;
}

interface TranslationSet {
  fa: Translation;
  en: Translation;
}

// متن‌های هدر
const header: TranslationSet = {
  fa: {
    home: 'خانه',
    restaurants: 'رستوران‌ها',
    categories: 'دسته‌بندی‌ها',
    orderTracking: 'پیگیری سفارش',
    about: 'درباره ما',
    contact: 'تماس با ما',
    profile: 'پروفایل کاربری',
    login: 'ورود',
    signup: 'ثبت‌نام',
    logout: 'خروج از حساب کاربری',
    search: 'جستجوی رستوران یا غذا...',
    favorites: 'علاقه‌مندی‌ها',
    cart: 'سبد خرید',
    changeToEnglish: 'تغییر به انگلیسی',
    changeToPersian: 'تغییر به فارسی',
  },
  en: {
    home: 'Home',
    restaurants: 'Restaurants',
    categories: 'Categories',
    orderTracking: 'Order Tracking',
    about: 'About',
    contact: 'Contact',
    profile: 'Profile',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    search: 'Search for restaurants or food...',
    favorites: 'Favorites',
    cart: 'Cart',
    changeToEnglish: 'Change to English',
    changeToPersian: 'Change to Persian',
  },
};

// متن‌های صفحه اصلی
const home: TranslationSet = {
  fa: {
    welcome: 'به فودینو خوش آمدید',
    slogan: 'سفارش آنلاین غذا از بهترین رستوران‌های شهر',
    findFood: 'جستجوی غذای مورد علاقه خود',
    popularCategories: 'دسته‌بندی‌های محبوب',
    popularRestaurants: 'رستوران‌های برتر',
    viewAll: 'مشاهده همه',
    seeMenu: 'مشاهده منو',
  },
  en: {
    welcome: 'Welcome to Foodino',
    slogan: 'Online food delivery from the best restaurants in town',
    findFood: 'Find your favorite food',
    popularCategories: 'Popular Categories',
    popularRestaurants: 'Top Restaurants',
    viewAll: 'View All',
    seeMenu: 'See Menu',
  },
};

// متن‌های فوتر
const footer: TranslationSet = {
  fa: {
    aboutUs: 'درباره فودینو',
    aboutText: 'فودینو، پلتفرم آنلاین سفارش غذا از بهترین رستوران‌های شهر شما. با ما طعم‌های جدیدی را تجربه کنید.',
    quickLinks: 'دسترسی سریع',
    customerService: 'خدمات مشتریان',
    faq: 'سوالات متداول',
    contactUs: 'تماس با ما',
    termsOfService: 'قوانین و مقررات',
    privacyPolicy: 'حریم خصوصی',
    copyright: 'تمامی حقوق محفوظ است © فودینو',
  },
  en: {
    aboutUs: 'About Foodino',
    aboutText: 'Foodino is an online platform for food delivery from the best restaurants in your city. Experience new flavors with us.',
    quickLinks: 'Quick Links',
    customerService: 'Customer Service',
    faq: 'FAQ',
    contactUs: 'Contact Us',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    copyright: 'All Rights Reserved © Foodino',
  },
};

// متن‌های سبد خرید
const cart: TranslationSet = {
  fa: {
    title: 'سبد خرید',
    empty: 'سبد خرید شما خالی است',
    continueShopping: 'ادامه خرید',
    subtotal: 'جمع کل',
    deliveryFee: 'هزینه ارسال',
    total: 'مبلغ قابل پرداخت',
    checkout: 'تکمیل خرید',
    minOrderNotMet: 'حداقل سفارش:',
    clearCart: 'خالی کردن سبد',
  },
  en: {
    title: 'Shopping Cart',
    empty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    checkout: 'Checkout',
    minOrderNotMet: 'Minimum Order:',
    clearCart: 'Clear Cart',
  },
};

// ترکیب همه ترجمه‌ها
export const translations = {
  header,
  home,
  footer,
  cart,
};

// هوک برای دسترسی به ترجمه‌ها
export const getTranslation = (language: Language, section: keyof typeof translations, key: string): string => {
  const sectionTranslations = translations[section];
  if (!sectionTranslations) {
    console.warn(`Translation section "${section}" not found`);
    return key;
  }
  
  const translation = sectionTranslations[language][key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found in section "${section}" for language "${language}"`);
    return key;
  }
  
  return translation;
}; 