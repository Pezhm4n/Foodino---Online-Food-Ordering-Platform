import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // استیت برای ذخیره مقدار
  // اگر مقدار از localStorage بازیابی شده باشد، آن را مورد استفاده قرار می‌دهیم، در غیر این صورت از مقدار اولیه استفاده می‌کنیم
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // بازیابی از localStorage
      const item = window.localStorage.getItem(key);
      // تبدیل به JSON اگر وجود داشته باشد، در غیر این صورت مقدار اولیه را برمی‌گرداند
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // در صورت بروز خطا، مقدار اولیه را برمی‌گرداند
      console.log(error);
      return initialValue;
    }
  });
  
  // تابع برای ذخیره مقدار در localStorage و به‌روزرسانی استیت
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // اگر مقدار یک تابع باشد، آن را با مقدار فعلی استیت فراخوانی می‌کنیم
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // به‌روزرسانی استیت
      setStoredValue(valueToStore);
      
      // ذخیره در localStorage فقط در سمت کلاینت
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // خطا را ثبت می‌کنیم
      console.log(error);
    }
  };
  
  // تابع برای حذف مقدار از localStorage
  const removeValue = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  // چک کردن تغییرات کلید در localStorage (برای حالتی که کلید در برگه دیگری تغییر کند)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.log(error);
        }
      }
    };
    
    // افزودن event listener فقط در سمت کلاینت
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      
      // پاکسازی event listener هنگام unmount
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key, initialValue]);
  
  return [storedValue, setValue, removeValue] as const;
} 