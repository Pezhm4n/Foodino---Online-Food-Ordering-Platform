import { Order, Product, Restaurant } from "@/types";

// داده‌های نمونه برای رستوران‌ها
export const restaurantsData: Restaurant[] = [
  {
    id: '1',
    slug: 'best-pizza',
    name: 'پیتزا برتر',
    description: 'بهترین پیتزا با طعم‌های متنوع و مواد اولیه تازه',
    categories: ['پیتزا', 'ایتالیایی', 'فست فود'],
    priceRange: 'متوسط',
    rating: 4.7,
    reviewCount: 245,
    image: '/images/restaurants/pizza-restaurant.jpg',
    logo: '/images/logo/best-pizza.jpg',
    coverImage: '/images/cover/best-pizza.jpg',
    deliveryTime: '30-45',
    deliveryFee: '15,000 تومان',
    minOrder: '50,000 تومان',
    address: 'خیابان ولیعصر، نرسیده به پارک وی',
    workingHours: '۸ صبح تا ۱۲ شب',
    type: 'فست فود',
    icon: '🍕',
    tags: ['پیتزا', 'فست فود', 'ایتالیایی'],
    contactNumber: '021-12345678'
  },
  // رستوران r1 که به پیتزا برتر اشاره می‌کند
  {
    id: 'r1',
    slug: 'best-pizza',
    name: 'پیتزا برتر',
    description: 'بهترین پیتزا با طعم‌های متنوع و مواد اولیه تازه',
    categories: ['پیتزا', 'ایتالیایی', 'فست فود'],
    priceRange: 'متوسط',
    rating: 4.7,
    reviewCount: 420,
    image: '/images/restaurants/pizza-restaurant.jpg',
    logo: '/images/restaurants/pizza-logo.png',
    coverImage: '/images/restaurants/pizza-cover.jpg',
    deliveryTime: '30-45',
    deliveryFee: '15,000 تومان',
    minOrder: '50,000 تومان',
    address: 'خیابان ولیعصر، نرسیده به پارک وی',
    workingHours: '۹ صبح تا ۱۱ شب',
    type: 'رستوران',
    icon: '🍕',
    tags: ['پیتزا', 'فست فود'],
    contactNumber: '021-12345678'
  },
  {
    id: '2',
    slug: 'burger-land',
    name: 'برگرلند',
    description: 'برگرهای خوشمزه با گوشت تازه و سس‌های خانگی',
    categories: ['فست فود', 'برگر', 'ساندویچ'],
    priceRange: 'متوسط',
    rating: 4.4,
    reviewCount: 165,
    image: '/images/restaurants/burger-restaurant.jpg',
    logo: '/images/logo/burger-land.jpg',
    coverImage: '/images/cover/burger-land.jpg',
    deliveryTime: '25-40',
    deliveryFee: '18,000 تومان',
    minOrder: '70,000 تومان',
    address: 'خیابان کریم خان، نبش ویلا',
    workingHours: '۱۱ صبح تا ۱۱ شب',
    type: 'فست فود',
    icon: '🍔',
    tags: ['برگر', 'فرنچ فرایز', 'سیب زمینی'],
    contactNumber: '021-56789012'
  },
  {
    id: '3',
    slug: 'sushi-tako',
    name: 'سوشی تاکو',
    description: 'اولین رستوران تخصصی سوشی در منطقه با طعم اصیل ژاپنی',
    categories: ['ژاپنی', 'سوشی', 'آسیایی'],
    priceRange: 'بالا',
    rating: 4.5,
    reviewCount: 156,
    image: '/images/restaurants/sushi-restaurant.jpg',
    logo: '/images/logo/sushi-tako.jpg',
    coverImage: '/images/cover/sushi-tako.jpg',
    deliveryTime: '35-50',
    deliveryFee: '25,000 تومان',
    minOrder: '100,000 تومان',
    address: 'بلوار اندرزگو، خیابان سلیمی',
    workingHours: '۱۲ ظهر تا ۱۰ شب',
    type: 'ژاپنی',
    icon: '🍣',
    tags: ['سوشی', 'ساشیمی', 'رامن'],
    contactNumber: '021-23456789'
  },
  {
    id: 'r3',
    slug: 'traditional-iranian',
    name: 'رستوران ایرانی سنتی',
    description: 'تجربه طعم اصیل غذاهای ایرانی با بهترین مواد اولیه و دستور پخت‌های سنتی',
    categories: ['ایرانی', 'کباب', 'خورشت'],
    priceRange: 'گران',
    rating: 4.6,
    reviewCount: 310,
    image: '/images/restaurants/iranian-restaurant.jpg',
    logo: '/images/restaurants/iranian-logo.png',
    coverImage: '/images/restaurants/iranian-cover.jpg',
    deliveryTime: '45-60',
    deliveryFee: '20,000 تومان',
    minOrder: '100,000 تومان',
    address: 'خیابان فرشته، نبش کوچه دوم',
    workingHours: '۱۱ صبح تا ۱۱ شب',
    type: 'رستوران',
    icon: '🍖',
    tags: ['ایرانی', 'سنتی', 'کباب'],
    contactNumber: '021-76543210'
  },
  {
    id: '4',
    slug: 'green-salad',
    name: 'سالاد و اسموتی سبز',
    description: 'غذاهای سالم و ارگانیک برای سبک زندگی سالم',
    categories: ['سالاد', 'نوشیدنی', 'وگان'],
    priceRange: 'متوسط',
    rating: 4.7,
    reviewCount: 210,
    image: '/images/restaurants/salad-restaurant.jpg',
    logo: '/images/logo/green-salad.jpg',
    coverImage: '/images/cover/green-salad.jpg',
    deliveryTime: '20-35',
    deliveryFee: '15,000 تومان',
    minOrder: '60,000 تومان',
    address: 'میدان ونک، خیابان گاندی',
    workingHours: '۹ صبح تا ۹ شب',
    type: 'سالم و ارگانیک',
    icon: '🥗',
    tags: ['سالاد', 'اسموتی', 'دسر'],
    contactNumber: '021-34567890'
  },
  {
    id: 'r4',
    slug: 'green-salad',
    name: 'سالاد سبز',
    description: 'انواع سالادهای سالم و خوشمزه با مواد تازه و ارگانیک',
    categories: ['سالاد', 'گیاهی', 'سالم'],
    priceRange: 'متوسط',
    rating: 4.5,
    reviewCount: 290,
    image: '/images/restaurants/salad-restaurant.jpg',
    logo: '/images/restaurants/salad-logo.png',
    coverImage: '/images/restaurants/salad-cover.jpg',
    deliveryTime: '20-30',
    deliveryFee: '12,000 تومان',
    minOrder: '40,000 تومان',
    address: 'خیابان سعادت آباد، نبش خیابان چهارم',
    workingHours: '۸ صبح تا ۱۰ شب',
    type: 'رستوران',
    icon: '🥗',
    tags: ['سالاد', 'گیاهی', 'رژیمی'],
    contactNumber: '021-23456789'
  },
  {
    id: '5',
    slug: 'kabab-khan',
    name: 'کباب خان',
    description: 'بهترین کباب‌های شهر با گوشت تازه و باکیفیت',
    categories: ['کباب', 'ایرانی', 'کبابی'],
    priceRange: 'بالا',
    rating: 4.9,
    reviewCount: 278,
    image: '/images/restaurants/kabab-restaurant.jpg',
    logo: '/images/logo/kabab-khan.jpg',
    coverImage: '/images/cover/kabab-khan.jpg',
    deliveryTime: '35-45',
    deliveryFee: '20,000 تومان',
    minOrder: '90,000 تومان',
    address: 'خیابان پاسداران، نبش گلستان پنجم',
    workingHours: '۱۲ ظهر تا ۱۱ شب',
    type: 'کباب',
    icon: '🥩',
    tags: ['کباب برگ', 'کباب کوبیده', 'جوجه کباب'],
    contactNumber: '021-45678901'
  },
  {
    id: 'r2',
    slug: 'burger-land',
    name: 'برگرلند',
    description: 'تجربه لذت برگرهای خانگی با گوشت تازه و سس‌های مخصوص',
    categories: ['فست فود', 'برگر', 'ساندویچ'],
    priceRange: 'متوسط',
    rating: 4.8,
    reviewCount: 380,
    image: '/images/restaurants/burger-restaurant.jpg',
    logo: '/images/restaurants/burger-logo.png',
    coverImage: '/images/restaurants/burger-cover.jpg',
    deliveryTime: '25-40',
    deliveryFee: '18,000 تومان',
    minOrder: '65,000 تومان',
    address: 'خیابان کریم خان، نبش خیابان ویلا',
    workingHours: '۱۱ صبح تا ۱۱:۳۰ شب',
    type: 'رستوران',
    icon: '🍔',
    tags: ['برگر', 'فست فود', 'ساندویچ'],
    contactNumber: '021-87654321'
  },
  {
    id: 'r5',
    slug: 'sushi-tako',
    name: 'سوشی تاکو',
    description: 'تجربه طعم بی‌نظیر غذاهای ژاپنی با مواد اولیه تازه و با کیفیت',
    categories: ['ژاپنی', 'سوشی', 'دریایی'],
    priceRange: 'گران',
    rating: 4.7,
    reviewCount: 245,
    image: '/images/restaurants/sushi-restaurant.jpg',
    logo: '/images/restaurants/sushi-logo.png',
    coverImage: '/images/restaurants/sushi-cover.jpg',
    deliveryTime: '35-50',
    deliveryFee: '25,000 تومان',
    minOrder: '120,000 تومان',
    address: 'خیابان ظفر، بعد از چهارراه شریعتی',
    workingHours: '۱۲ ظهر تا ۱۱ شب',
    type: 'رستوران',
    icon: '🍣',
    tags: ['ژاپنی', 'سوشی', 'غذای دریایی'],
    contactNumber: '021-98765432'
  },
  {
    id: '6',
    slug: 'drinks-cafe',
    name: 'کافه نوشیدنی',
    description: 'انواع نوشیدنی‌های گرم و سرد با طعم‌های مختلف و لذت‌بخش',
    categories: ['کافه', 'نوشیدنی', 'آبمیوه'],
    priceRange: 'متوسط',
    rating: 4.5,
    reviewCount: 320,
    image: '/images/restaurants/cafe-restaurant.jpg',
    logo: '/images/restaurants/cafe-logo.png',
    coverImage: '/images/restaurants/cafe-cover.jpg',
    deliveryTime: '20-30',
    deliveryFee: '15,000 تومان',
    minOrder: '50,000 تومان',
    address: 'خیابان ولیعصر، نبش پارک ساعی',
    workingHours: '۹ صبح تا ۱۱ شب',
    type: 'کافه',
    icon: '☕',
    tags: ['قهوه', 'نوشیدنی گرم', 'آبمیوه'],
    contactNumber: '021-56789012'
  }
];

// داده‌های نمونه برای دسته‌بندی‌ها
export const categoriesData = [
  {
    id: '1',
    name: 'فست فود',
    icon: '🍔',
    slug: 'fast-food',
    description: 'انواع فست فود، برگر، پیتزا و ساندویچ'
  },
  {
    id: '2',
    name: 'غذای ایرانی',
    icon: '🍖',
    slug: 'iranian-food',
    description: 'انواع غذاهای سنتی و اصیل ایرانی'
  },
  {
    id: '3',
    name: 'پیتزا',
    icon: '🍕',
    slug: 'pizza',
    description: 'انواع پیتزا با طعم‌های مختلف و متنوع'
  },
  {
    id: '4',
    name: 'دسر',
    icon: '🍰',
    slug: 'dessert',
    description: 'انواع دسر، کیک، شیرینی و بستنی'
  },
  {
    id: '5',
    name: 'نوشیدنی',
    icon: '🥤',
    slug: 'drinks',
    description: 'انواع نوشیدنی‌های سرد و گرم'
  }
];

// داده‌های نمونه برای محصولات
export const productsData: Product[] = [
  {
    id: '1',
    name: 'پیتزا پپرونی',
    description: 'پیتزا با خمیر تازه، سس مخصوص، پپرونی گوشت و پنیر موزارلا',
    price: 150000,
    discountedPrice: 135000,
    image: '/images/products/pepperoni-pizza.jpg',
    category: '3',
    restaurant: '1',
    rating: 4.8,
    isAvailable: true,
    variants: [
      { id: 'size-1', name: 'کوچک', priceAdjustment: -20000 },
      { id: 'size-2', name: 'متوسط', priceAdjustment: 0 },
      { id: 'size-3', name: 'بزرگ', priceAdjustment: 30000 }
    ],
    options: [
      { id: 'option-1', name: 'پنیر اضافه', price: 15000 },
      { id: 'option-2', name: 'قارچ اضافه', price: 10000 },
      { id: 'option-3', name: 'فلفل اضافه', price: 5000 }
    ]
  },
  {
    id: '2',
    name: 'چلو کباب کوبیده',
    description: 'دو سیخ کباب کوبیده با برنج ایرانی، گوجه کبابی و فلفل',
    price: 180000,
    image: '/images/products/koobideh-kebab.jpg',
    category: '2',
    restaurant: '5',
    rating: 4.9,
    isAvailable: true,
    variants: [
      { id: 'size-1', name: 'تک پرس', priceAdjustment: 0 },
      { id: 'size-2', name: 'دو پرس', priceAdjustment: 160000 }
    ],
    options: [
      { id: 'option-1', name: 'دوغ', price: 15000 },
      { id: 'option-2', name: 'زیتون', price: 10000 },
      { id: 'option-3', name: 'سیخ اضافه', price: 70000 }
    ]
  },
  {
    id: '3',
    name: 'سوشی میکس',
    description: 'ست میکس سوشی شامل 24 عدد از انواع سوشی با سس مخصوص',
    price: 320000,
    discountedPrice: 290000,
    image: '/images/products/sushi-mix.jpg',
    category: '5',
    restaurant: '3',
    rating: 4.7,
    isAvailable: true,
    variants: [
      { id: 'size-1', name: '12 تکه', priceAdjustment: -120000 },
      { id: 'size-2', name: '24 تکه', priceAdjustment: 0 },
      { id: 'size-3', name: '36 تکه', priceAdjustment: 150000 }
    ],
    options: [
      { id: 'option-1', name: 'سس واسابی اضافه', price: 15000 },
      { id: 'option-2', name: 'سس سویا اضافه', price: 10000 }
    ]
  },
  {
    id: '4',
    name: 'سالاد سزار با مرغ',
    description: 'سالاد تازه با کاهو، مرغ کبابی، نان تست، پنیر پارمزان و سس مخصوص سزار',
    price: 120000,
    image: '/images/products/caesar-salad.jpg',
    category: '4',
    restaurant: '4',
    rating: 4.6,
    isAvailable: true,
    variants: [
      { id: 'size-1', name: 'کوچک', priceAdjustment: -30000 },
      { id: 'size-2', name: 'معمولی', priceAdjustment: 0 },
      { id: 'size-3', name: 'بزرگ', priceAdjustment: 40000 }
    ],
    options: [
      { id: 'option-1', name: 'پنیر اضافه', price: 15000 },
      { id: 'option-2', name: 'مرغ اضافه', price: 30000 },
      { id: 'option-3', name: 'سس سزار اضافه', price: 10000 }
    ]
  },
  {
    id: '5',
    name: 'دیزی سنگی',
    description: 'دیزی سنتی با گوشت گوسفندی، نخود، لوبیا و سیب زمینی در ظرف سنگی با نان سنگک',
    price: 140000,
    image: '/images/products/dizi.jpg',
    category: '2',
    restaurant: '2',
    rating: 4.8,
    isAvailable: true,
    variants: [
      { id: 'size-1', name: 'تک نفره', priceAdjustment: 0 },
      { id: 'size-2', name: 'دو نفره', priceAdjustment: 130000 }
    ],
    options: [
      { id: 'option-1', name: 'ترشی', price: 15000 },
      { id: 'option-2', name: 'نوشابه', price: 12000 },
      { id: 'option-3', name: 'دوغ', price: 15000 }
    ]
  },
  {
    id: '6',
    name: 'همبرگر دوبل',
    description: 'همبرگر با دو لایه گوشت تازه، پنیر چدار، کاهو، گوجه و سس مخصوص',
    price: 160000,
    discountedPrice: 140000,
    image: '/images/products/double-burger.jpg',
    category: '1',
    restaurant: '6',
    rating: 4.5,
    isAvailable: true,
    variants: [
      { id: 'size-1', name: 'معمولی', priceAdjustment: 0 },
      { id: 'size-2', name: 'کومبو (با نوشابه و سیب زمینی)', priceAdjustment: 45000 }
    ],
    options: [
      { id: 'option-1', name: 'پنیر اضافه', price: 15000 },
      { id: 'option-2', name: 'ژامبون', price: 20000 },
      { id: 'option-3', name: 'قارچ و پنیر', price: 25000 }
    ]
  }
];

// داده‌های نمونه برای سفارش‌ها
const demoOrders: Order[] = [
  {
    id: "order123",
    restaurant: {
      id: "1",
      name: "پیتزا برتر",
      logo: "/images/logo/best-pizza.jpg"
    },
    items: [
      {
        id: "item1",
        name: "پیتزا پپرونی",
        quantity: 1,
        price: 150000,
        options: ["خمیر نازک", "پنیر اضافه"]
      },
      {
        id: "item2",
        name: "نوشابه کولا",
        quantity: 2,
        price: 25000,
        options: []
      }
    ],
    status: "delivered",
    orderDate: new Date("2023-12-25T18:30:00").toISOString(),
    deliveryTime: "30-45",
    deliveryAddress: "تهران، خیابان ولیعصر، پلاک 123",
    subtotal: 200000,
    deliveryFee: 25000,
    discount: 20000,
    total: 205000,
    paymentMethod: "آنلاین"
  },
  {
    id: "order456",
    restaurant: {
      id: "2",
      name: "برگر لذیذ",
      logo: "/images/logo/delicious-burger.jpg"
    },
    items: [
      {
        id: "item3",
        name: "همبرگر دوبل",
        quantity: 1,
        price: 180000,
        options: ["سس مخصوص", "پنیر اضافه"]
      },
      {
        id: "item4",
        name: "سیب زمینی سرخ کرده",
        quantity: 1,
        price: 35000,
        options: []
      }
    ],
    status: "preparing",
    orderDate: new Date("2023-12-27T12:45:00").toISOString(),
    deliveryTime: "25-40",
    deliveryAddress: "تهران، خیابان شریعتی، پلاک 456",
    subtotal: 215000,
    deliveryFee: 20000,
    discount: 0,
    total: 235000,
    paymentMethod: "پرداخت در محل"
  },
  {
    id: "ORDER-5967",
    restaurant: {
      id: "6",
      name: "برگرلند",
      logo: "/images/logo/burger-land.jpg"
    },
    items: [
      {
        id: "item5",
        name: "همبرگر دوبل",
        quantity: 2,
        price: 160000,
        options: ["پنیر اضافه", "سس مخصوص"]
      },
      {
        id: "item6",
        name: "سیب زمینی سرخ کرده بزرگ",
        quantity: 1,
        price: 45000,
        options: []
      }
    ],
    status: "confirmed",
    orderDate: new Date("2023-12-29T14:20:00").toISOString(),
    deliveryTime: "25-40",
    deliveryAddress: "تهران، خیابان انقلاب، پلاک 789",
    subtotal: 365000,
    deliveryFee: 18000,
    discount: 50000,
    total: 333000,
    paymentMethod: "آنلاین"
  }
];

/**
 * دریافت تمام رستوران‌ها
 */
export async function getAllRestaurants(): Promise<Restaurant[]> {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return restaurantsData;
}

/**
 * دریافت رستوران بر اساس شناسه یا اسلاگ
 */
export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const restaurant = restaurantsData.find(r => r.slug === slug || r.id === slug);
  return restaurant || null;
}

/**
 * دریافت رستوران بر اساس شناسه
 */
export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const restaurant = restaurantsData.find(r => r.id === id);
  return restaurant || null;
}

/**
 * دریافت همه دسته‌بندی‌ها
 */
export async function getAllCategories() {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return categoriesData;
}

/**
 * دریافت دسته‌بندی بر اساس شناسه
 */
export async function getCategoryById(id: string) {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const category = categoriesData.find(c => c.id === id || c.slug === id);
  return category || null;
}

/**
 * دریافت محصولات بر اساس دسته‌بندی
 */
export async function getProductsByCategory(categoryId: string) {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const category = await getCategoryById(categoryId);
  const products = productsData.filter(p => p.category === categoryId);
  
  return {
    categoryName: category?.name || "دسته‌بندی نامشخص",
    products
  };
}

/**
 * دریافت محصولات یک رستوران
 */
export async function getProductsByRestaurant(restaurantId: string) {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const restaurant = restaurantsData.find(r => r.id === restaurantId || r.slug === restaurantId);
  const products = productsData.filter(p => p.restaurant === restaurantId);
  
  return {
    restaurantName: restaurant?.name || "رستوران نامشخص",
    products
  };
}

/**
 * دریافت محصول با شناسه
 */
export async function getProductById(id: string): Promise<Product | null> {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const product = productsData.find(p => p.id === id);
  return product || null;
}

/**
 * دریافت سفارش بر اساس شناسه
 */
export async function getOrderById(id: string): Promise<Order> {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const order = demoOrders.find(order => order.id === id);
  
  if (!order) {
    throw new Error(`Order with ID ${id} not found`);
  }
  
  return order;
}

/**
 * دریافت لیست سفارش‌های کاربر
 */
export async function getUserOrders(): Promise<Order[]> {
  // شبیه‌سازی تأخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return demoOrders;
} 