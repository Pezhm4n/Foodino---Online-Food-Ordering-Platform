import { Category } from "@/types/models";

// داده‌های مشترک دسته‌بندی‌ها
export const categories: Category[] = [
  { 
    id: '1', 
    name: 'پیتزا', 
    icon: '🍕', 
    count: 48, 
    slug: 'pizza' 
  },
  { 
    id: '2', 
    name: 'برگر', 
    icon: '🍔', 
    count: 36, 
    slug: 'burger' 
  },
  { 
    id: '3', 
    name: 'ساندویچ', 
    icon: '🥪', 
    count: 27, 
    slug: 'sandwich' 
  },
  { 
    id: '4', 
    name: 'غذای ایرانی', 
    icon: '🍚', 
    count: 42, 
    slug: 'iranian' 
  },
  { 
    id: '5', 
    name: 'غذای دریایی', 
    icon: '🦞', 
    count: 18, 
    slug: 'seafood' 
  },
  { 
    id: '6', 
    name: 'سالاد', 
    icon: '🥗', 
    count: 24, 
    slug: 'salad' 
  },
  { 
    id: '7', 
    name: 'پاستا', 
    icon: '🍝', 
    count: 15, 
    slug: 'pasta' 
  },
  { 
    id: '8', 
    name: 'استیک', 
    icon: '🥩', 
    count: 12, 
    slug: 'steak' 
  },
  { 
    id: '9', 
    name: 'بستنی و دسر', 
    icon: '🍨', 
    count: 30, 
    slug: 'dessert' 
  },
  { 
    id: '10', 
    name: 'نوشیدنی', 
    icon: '🥤', 
    count: 21, 
    slug: 'drink' 
  },
  { 
    id: '11', 
    name: 'صبحانه', 
    icon: '🍳', 
    count: 16, 
    slug: 'breakfast' 
  },
  { 
    id: '12', 
    name: 'فست فود', 
    icon: '🌭', 
    count: 33, 
    slug: 'fastfood' 
  },
  { 
    id: '13', 
    name: 'کباب', 
    icon: '🍢', 
    count: 28, 
    slug: 'kebab' 
  },
  { 
    id: '14', 
    name: 'سوشی', 
    icon: '🍣', 
    count: 9, 
    slug: 'sushi' 
  },
  { 
    id: '15', 
    name: 'سوپ', 
    icon: '🍲', 
    count: 14, 
    slug: 'soup' 
  },
  { 
    id: '16', 
    name: 'آبمیوه و اسموتی', 
    icon: '🧃', 
    count: 22, 
    slug: 'juice' 
  },
];

// اطلاعات تکمیلی دسته‌بندی‌ها با توضیحات
export const categoryDetails: Record<string, { name: string; icon: string; description: string }> = {
  'pizza': {
    name: 'پیتزا',
    icon: '🍕',
    description: 'انواع پیتزا‌های خوشمزه و لذیذ با مواد اولیه تازه'
  },
  'burger': {
    name: 'برگر',
    icon: '🍔',
    description: 'برگرهای خوشمزه با گوشت تازه و سس‌های مخصوص'
  },
  'sandwich': {
    name: 'ساندویچ',
    icon: '🥪',
    description: 'انواع ساندویچ‌های متنوع و خوشمزه'
  },
  'iranian': {
    name: 'غذای ایرانی',
    icon: '🍲',
    description: 'غذاهای سنتی و اصیل ایرانی با طعم خانگی'
  },
  'seafood': {
    name: 'غذای دریایی',
    icon: '🦞',
    description: 'انواع غذاهای دریایی تازه و خوشمزه'
  },
  'salad': {
    name: 'سالاد',
    icon: '🥗',
    description: 'سالادهای تازه و مغذی با طعم‌های متنوع'
  },
  'pasta': {
    name: 'پاستا',
    icon: '🍝',
    description: 'انواع پاستاهای ایتالیایی با سس‌های مختلف'
  },
  'steak': {
    name: 'استیک',
    icon: '🥩',
    description: 'استیک‌های خوشمزه با گوشت مرغوب'
  },
  'dessert': {
    name: 'بستنی و دسر',
    icon: '🍨',
    description: 'انواع دسرها و بستنی‌های خوشمزه'
  },
  'drink': {
    name: 'نوشیدنی',
    icon: '🥤',
    description: 'انواع نوشیدنی‌های سرد و گرم'
  },
  'breakfast': {
    name: 'صبحانه',
    icon: '🍳',
    description: 'صبحانه‌های متنوع و کامل'
  },
  'fastfood': {
    name: 'فست فود',
    icon: '🌭',
    description: 'انواع فست فود‌های خوشمزه و پرطرفدار'
  },
  'kebab': {
    name: 'کباب',
    icon: '🍢',
    description: 'انواع کباب‌های خوشمزه و لذیذ'
  },
  'sushi': {
    name: 'سوشی',
    icon: '🍣',
    description: 'انواع سوشی‌های تازه و خوشمزه'
  },
  'soup': {
    name: 'سوپ',
    icon: '🍲',
    description: 'سوپ‌های گرم و خوشمزه'
  },
  'juice': {
    name: 'آبمیوه و اسموتی',
    icon: '🧃',
    description: 'انواع آبمیوه‌های تازه و اسموتی‌های خوشمزه'
  }
};

// تابع کمکی برای یافتن دسته‌بندی با استفاده از slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

// تابع کمکی برای یافتن دسته‌بندی با استفاده از id
export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
} 