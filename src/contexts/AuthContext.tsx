"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginFormData, RegisterFormData } from '@/types/models';

// تایپ کانتکست احراز هویت
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
}

// ایجاد کانتکست
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// کامپوننت ارائه‌دهنده کانتکست
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // بررسی وضعیت احراز هویت در زمان لود صفحه
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // این تابع در نسخه واقعی باید با API ارتباط برقرار کند
  const login = async (data: LoginFormData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      // در یک برنامه واقعی، اینجا با API ارتباط برقرار می‌شود
      // این کد فقط برای نمایش عملکرد است
      await new Promise(resolve => setTimeout(resolve, 1000)); // شبیه‌سازی تأخیر شبکه
      
      // بررسی ایمیل و رمز عبور (این فقط یک مثال است)
      if (data.email === 'test@example.com' && data.password === 'password') {
        const mockUser: User = {
          id: '1',
          firstName: 'کاربر',
          lastName: 'آزمایشی',
          email: data.email,
          phone: '09123456789',
          addresses: [],
        };
        
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', 'mock-jwt-token');
        setUser(mockUser);
        
        return { success: true };
      } else {
        return { success: false, message: 'ایمیل یا رمز عبور اشتباه است.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      // در یک برنامه واقعی، اینجا با API ارتباط برقرار می‌شود
      // این کد فقط برای نمایش عملکرد است
      await new Promise(resolve => setTimeout(resolve, 1000)); // شبیه‌سازی تأخیر شبکه
      
      // بررسی تکراری نبودن ایمیل (این فقط یک مثال است)
      if (data.email === 'test@example.com') {
        return { success: false, message: 'این ایمیل قبلاً استفاده شده است.' };
      }
      
      if (data.password !== data.confirmPassword) {
        return { success: false, message: 'تکرار رمز عبور مطابقت ندارد.' };
      }
      
      // ایجاد کاربر جدید
      const newUser: User = {
        id: new Date().getTime().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        addresses: [],
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', 'mock-jwt-token');
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // در یک برنامه واقعی، اینجا با API ارتباط برقرار می‌شود
      await new Promise(resolve => setTimeout(resolve, 1000)); // شبیه‌سازی تأخیر شبکه
      
      if (user) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// هوک برای استفاده از کانتکست
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 