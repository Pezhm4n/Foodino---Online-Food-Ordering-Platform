"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {
  FormInput,
  Button
} from '@/components/common/StyledComponents';
import ChangePasswordModal, { PasswordChangeData } from '@/components/profile/ChangePasswordModal';
import ConfirmDeleteModal from '@/components/profile/ConfirmDeleteModal';
import { useToast } from '@/components/common/Toast';

// استایل‌های صفحه پروفایل
const ProfilePageContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem 1rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

// استایل‌های سایدبار
const Sidebar = styled.div`
  width: 100%;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 2rem;
  box-shadow: ${props => props.theme.boxShadow.sm};
  
  @media (min-width: 768px) {
    width: 300px;
    position: sticky;
    top: 2rem;
  }
`;

const UserInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary[400]};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 1rem;
`;

const UserName = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

const SidebarMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled.div<{ $active?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.$active ? props.theme.typography.fontWeights.medium : props.theme.typography.fontWeights.normal};
  color: ${props => props.$active ? props.theme.colors.primary[500] : props.theme.colors.neutral[700]};
  background-color: ${props => props.$active ? props.theme.colors.primary[400] + '10' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$active ? props.theme.colors.primary[400] + '20' : props.theme.colors.neutral[100]};
  }
`;

const MenuIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
`;

// استایل‌های محتوای اصلی
const MainContent = styled.div`
  width: 100%;
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 2rem;
  box-shadow: ${props => props.theme.boxShadow.sm};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const ProfileForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[700]};
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[400] + '20'};
  }
`;

const FormSubmitSection = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  font-size: ${props => props.theme.typography.fontSizes.md};
  padding: 0.75rem 2rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-family: var(--font-vazirmatn);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const AddressesSection = styled.div`
  margin-top: 3rem;
`;

const AddressCard = styled.div`
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
`;

const AddressHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const AddressTitle = styled.h4`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.neutral[900]};
`;

const AddressActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const AddressAction = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.neutral[500]};
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }
`;

const AddressDetails = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  line-height: 1.6;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 2px dashed ${props => props.theme.colors.neutral[300]};
  color: ${props => props.theme.colors.neutral[700]};
  padding: 1rem;
  width: 100%;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-family: var(--font-vazirmatn);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary[400]};
    color: ${props => props.theme.colors.primary[500]};
  }
`;

// افزودن کامپوننت مودال برای تأیید تغییرات
const ConfirmModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  direction: rtl;
`;

const ModalTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.secondary[500]};
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
`;

const ModalButton = styled(Button)<{ $variant?: 'primary' | 'secondary' }>``;

// انواع داده
interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  currentPassword: string;
}

interface Address {
  id: string;
  title: string;
  details: string;
  isDefault: boolean;
}

// تعریف انواع داده برای رستوران‌های مورد علاقه
interface Restaurant {
  id: string;
  name: string;
  icon: string;
  description: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
}

// داده‌های نمونه رستوران‌های مورد علاقه
const sampleFavorites: Restaurant[] = [
  {
    id: '1',
    name: 'پیتزا ایتالیایی',
    icon: '🍕',
    description: 'بهترین پیتزا ایتالیایی با خمیر تازه و مواد درجه یک',
    rating: 4.8,
    deliveryTime: '30-45 دقیقه',
    deliveryFee: '15,000 تومان',
    categories: ['پیتزا', 'فست فود', 'ایتالیایی']
  },
  {
    id: '2',
    name: 'کباب سرای سنتی',
    icon: '🍢',
    description: 'انواع کباب‌های سنتی ایرانی با گوشت تازه و نان داغ',
    rating: 4.6,
    deliveryTime: '40-55 دقیقه',
    deliveryFee: '20,000 تومان',
    categories: ['کباب', 'ایرانی', 'سنتی']
  },
  {
    id: '3',
    name: 'سوشی تاکه',
    icon: '🍣',
    description: 'سوشی‌های ژاپنی اصیل با مواد تازه و سس‌های مخصوص',
    rating: 4.7,
    deliveryTime: '35-50 دقیقه',
    deliveryFee: '25,000 تومان',
    categories: ['سوشی', 'ژاپنی', 'دریایی']
  }
];

// کامپوننت اصلی
const ProfilePage = () => {
  // استیت‌ها
  const [activeTab, setActiveTab] = useState('profile');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: 'علی',
    lastName: 'محمدی',
    email: 'ali.mohammadi@example.com',
    phone: '09123456789',
    password: '',
    currentPassword: ''
  });
  
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      title: 'خانه',
      details: 'تهران، خیابان ولیعصر، کوچه مهرداد، پلاک 24، واحد 5',
      isDefault: true
    },
    {
      id: '2',
      title: 'محل کار',
      details: 'تهران، میدان ونک، خیابان ملاصدرا، پلاک 120، طبقه 3',
      isDefault: false
    }
  ]);
  
  // استیت رستوران‌های مورد علاقه
  const [favorites, setFavorites] = useState<Restaurant[]>(sampleFavorites);
  
  // هندلرها
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // اگر رمز عبور تغییر کرده باشد، باید مودال تغییر رمز نمایش داده شود
    if (formData.password) {
      setIsPasswordModalOpen(true);
    } else {
      // ذخیره تغییرات بدون نیاز به تأیید رمز عبور
      saveProfile();
    }
  };
  
  const saveProfile = () => {
    // اینجا می‌توانید API call برای ذخیره اطلاعات را اضافه کنید
    console.log('Profile updated:', formData);
    showToast('success', 'اطلاعات پروفایل با موفقیت به‌روزرسانی شد');
  };
  
  const confirmProfileChanges = () => {
    if (!formData.currentPassword) {
      alert('لطفاً رمز عبور فعلی خود را وارد کنید');
      return;
    }
    
    // اینجا باید اعتبارسنجی رمز عبور فعلی انجام شود (معمولاً از طریق API)
    console.log('Profile changes confirmed and saved', formData);
    setIsConfirmModalOpen(false);
    setFormData(prev => ({ ...prev, password: '', currentPassword: '' }));
    showToast('success', 'اطلاعات پروفایل با موفقیت به‌روزرسانی شد');
  };
  
  const handlePasswordChange = (data: PasswordChangeData) => {
    // اینجا باید API call برای تغییر رمز عبور را اضافه کنید
    console.log('Password changed:', data);
    setIsPasswordModalOpen(false);
    showToast('success', 'رمز عبور با موفقیت تغییر یافت');
  };
  
  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
    showToast('success', 'آدرس با موفقیت حذف شد');
  };
  
  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map(address => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
    showToast('success', 'آدرس پیش‌فرض با موفقیت تغییر یافت');
  };
  
  // حذف رستوران از لیست مورد علاقه‌ها
  const handleRemoveFavorite = (id: string) => {
    const restaurant = favorites.find(r => r.id === id);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setIsDeleteModalOpen(true);
    }
  };
  
  const confirmDeleteFavorite = () => {
    if (selectedRestaurant) {
      setFavorites(prev => prev.filter(restaurant => restaurant.id !== selectedRestaurant.id));
      showToast('success', `${selectedRestaurant.name} از لیست علاقه‌مندی‌ها حذف شد`);
      setIsDeleteModalOpen(false);
      setSelectedRestaurant(null);
    }
  };
  
  return (
    <ProfilePageContainer>
      {/* سایدبار */}
      <Sidebar>
        <UserInfoSection>
          <UserAvatar>علم</UserAvatar>
          <UserName>علی محمدی</UserName>
          <UserEmail>ali.mohammadi@example.com</UserEmail>
        </UserInfoSection>
        
        <SidebarMenu>
          <MenuItem $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
            <MenuIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </MenuIcon>
            اطلاعات شخصی
          </MenuItem>
          
          <MenuItem $active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
            <MenuIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </MenuIcon>
            سفارش‌های من
          </MenuItem>
          
          <MenuItem $active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')}>
            <MenuIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </MenuIcon>
            رستوران‌های مورد علاقه
          </MenuItem>
          
          <MenuItem $active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')}>
            <MenuIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3.62 8.49C5.59 -0.170 18.42 -0.160 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 9.41 22.48 7.39 20.54C4.63 17.88 1.47 13.57 3.62 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </MenuIcon>
            آدرس‌های من
          </MenuItem>
        </SidebarMenu>
      </Sidebar>
      
      {/* محتوای اصلی */}
      <MainContent>
        {activeTab === 'profile' && (
          <>
            <SectionTitle>اطلاعات شخصی</SectionTitle>
            
            <ProfileForm onSubmit={handleProfileSubmit}>
              <FormGroup>
                <FormLabel>نام</FormLabel>
                <FormInput 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>نام خانوادگی</FormLabel>
                <FormInput 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>ایمیل</FormLabel>
                <FormInput 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>شماره تماس</FormLabel>
                <FormInput 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </FormGroup>
              
              <FormActionsContainer>
                <FormSubmitSection>
                  <SubmitButton type="submit">ذخیره تغییرات</SubmitButton>
                </FormSubmitSection>
                
                <PasswordChangeSection>
                  <PasswordChangeButton type="button" onClick={() => setIsPasswordModalOpen(true)}>
                    تغییر رمز عبور
                  </PasswordChangeButton>
                </PasswordChangeSection>
              </FormActionsContainer>
            </ProfileForm>
            
            <AddressesSection>
              <SectionTitle>آدرس‌های من</SectionTitle>
              
              {addresses.map((address) => (
                <AddressCard key={address.id}>
                  <AddressHeader>
                    <AddressTitle>
                      {address.title}
                      {address.isDefault && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: 'white', 
                          backgroundColor: '#4CAF50', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '1rem', 
                          marginRight: '0.5rem' 
                        }}>
                          پیش‌فرض
                        </span>
                      )}
                    </AddressTitle>
                    <AddressActions>
                      {!address.isDefault && (
                        <AddressAction onClick={() => handleSetDefaultAddress(address.id)}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </AddressAction>
                      )}
                      <AddressAction onClick={() => handleDeleteAddress(address.id)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.33 16.5H13.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.5 12.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </AddressAction>
                    </AddressActions>
                  </AddressHeader>
                  <AddressDetails>{address.details}</AddressDetails>
                </AddressCard>
              ))}
              
              <AddButton>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                افزودن آدرس جدید
              </AddButton>
            </AddressesSection>
          </>
        )}
        
        {activeTab === 'orders' && (
          <div>
            <SectionTitle>سفارش‌های من</SectionTitle>
            <p>در حال حاضر سفارشی ثبت نشده است.</p>
          </div>
        {activeTab === 'favorites' && (
          <>
            <SectionTitle>رستوران‌های مورد علاقه</SectionTitle>
            {favorites.length > 0 ? (
              <FavoritesGrid>
                {favorites.map(restaurant => (
                  <RestaurantCard key={restaurant.id}>
                    <RemoveButton onClick={() => handleRemoveFavorite(restaurant.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.17 14.83L14.83 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.83 14.83L9.17 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </RemoveButton>
                    <RestaurantImageContainer>
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.15 18.6429C14.29 18.6429 12 16.2857 12 13.5429C12 10.7143 14.29 8.35718 17.15 8.35718C20.01 8.35718 22.29 10.7143 22.29 13.5429C22.3 16.2857 20.01 18.6429 17.15 18.6429Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.149 18.6429H5.359C4.499 18.6429 3.619 18.2857 2.999 17.6429C2.359 17.0000 2 16.1429 2 15.2857L2.01 5.35718C2.01 3.61432 3.499 2.14289 5.26 2.14289H13.649C14.499 2.14289 15.359 2.50003 15.999 3.14289C16.359 3.51432 16.629 3.96432 16.779 4.46432" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16.25 21.4429L14.25 19.4429L16.25 17.4429" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.25 17.4429L20.25 19.4429L18.25 21.4429" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.01 8.85718H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.01 12.8572H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </RestaurantImageContainer>
                    <RestaurantContent>
                      <RestaurantHeader>
                        <RestaurantName href={`/restaurant/${restaurant.id}`}>
                          {restaurant.name}
                        </RestaurantName>
                        <RestaurantRating>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.73 3.51L15.49 7.03C15.73 7.52 16.37 7.99 16.91 8.08L20.1 8.61C22.14 8.95 22.62 10.43 21.15 11.89L18.67 14.37C18.25 14.79 18.02 15.6 18.15 16.18L18.86 19.25C19.42 21.68 18.13 22.62 15.98 21.35L12.99 19.58C12.45 19.26 11.56 19.26 11.01 19.58L8.02 21.35C5.88 22.62 4.58 21.67 5.14 19.25L5.85 16.18C5.98 15.6 5.75 14.79 5.33 14.37L2.85 11.89C1.39 10.43 1.86 8.95 3.9 8.61L7.09 8.08C7.62 7.99 8.26 7.52 8.5 7.03L10.26 3.51C11.22 1.6 12.78 1.6 13.73 3.51Z" fill="#FFB800" stroke="#FFB800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {restaurant.rating}
                        </RestaurantRating>
                      </RestaurantHeader>
                      <RestaurantDescription>
                        {restaurant.description}
                      </RestaurantDescription>
                      <RestaurantMeta>
                        <MetaItem>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {restaurant.deliveryTime}
                        </MetaItem>
                        <MetaItem>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 14H13C14.1 14 15 13.1 15 12V2H6C4.5 2 3.19001 2.82999 2.51001 4.04999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17C2 18.66 3.34 20 5 20H6C6 18.9 6.9 18 8 18C9.1 18 10 18.9 10 20H14C14 18.9 14.9 18 16 18C17.1 18 18 18.9 18 20H19C20.66 20 22 18.66 22 17V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L18.58 6.01001C18.22 5.39001 17.56 5 16.84 5H15V12C15 13.1 14.1 14 13 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 12V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 8H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 11H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 14H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {restaurant.deliveryFee}
                        </MetaItem>
                      </RestaurantMeta>
                      <CategoryTags>
                        {restaurant.categories.map((category, index) => (
                          <CategoryTag key={index}>{category}</CategoryTag>
                        ))}
                      </CategoryTags>
                      <ViewButton href={`/restaurant/${restaurant.id}`}>
                        مشاهده منو
                      </ViewButton>
                    </RestaurantContent>
                  </RestaurantCard>
                ))}
              </FavoritesGrid>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
                  هنوز رستوران مورد علاقه‌ای ندارید!
                </h3>
                <p style={{ fontSize: '1rem', marginBottom: '1.5rem', color: '#666', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                  برای افزودن رستوران به لیست علاقه‌مندی‌ها، در صفحه رستوران روی دکمه قلب کلیک کنید.
                </p>
                <Link 
                  href="/restaurants" 
                  style={{ 
                    display: 'inline-block', 
                    padding: '0.75rem 2rem', 
                    backgroundColor: '#F43F5E', 
                    color: 'white', 
                    borderRadius: '0.5rem', 
                    textDecoration: 'none', 
                    fontWeight: 500 
                  }}
                >
                  مشاهده رستوران‌ها
                </Link>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'addresses' && (
          <AddressesSection>
            <SectionTitle>آدرس‌های من</SectionTitle>
            
            {addresses.map(address => (
              <AddressCard key={address.id}>
                <AddressHeader>
                  <AddressTitle>{address.title} {address.isDefault && ' (پیش‌فرض)'}</AddressTitle>
                  <AddressActions>
                    <AddressAction onClick={() => handleSetDefaultAddress(address.id)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </AddressAction>
                    <AddressAction onClick={() => handleDeleteAddress(address.id)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.33 16.5H13.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.5 12.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </AddressAction>
                  </AddressActions>
                </AddressHeader>
                <AddressDetails>{address.details}</AddressDetails>
              </AddressCard>
            ))}
            
            <AddButton>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              افزودن آدرس جدید
            </AddButton>
          </AddressesSection>
        )}
      </MainContent>
      
      {/* مودال تأیید تغییرات حساب کاربری */}
      <ConfirmModal $isOpen={isConfirmModalOpen}>
        <ModalContent>
          <ModalTitle>تأیید تغییرات حساب کاربری</ModalTitle>
          <ModalBody>
            <p>برای اعمال تغییرات در اطلاعات حساب کاربری، لطفاً رمز عبور فعلی خود را وارد کنید:</p>
            <FormInput 
              type="password" 
              name="currentPassword" 
              value={formData.currentPassword} 
              onChange={handleInputChange} 
              placeholder="رمز عبور فعلی" 
              style={{ marginTop: '1rem' }}
            />
          </ModalBody>
          <ModalActions>
            <ModalButton $variant="primary" onClick={confirmProfileChanges}>تأیید</ModalButton>
            <ModalButton onClick={() => setIsConfirmModalOpen(false)}>انصراف</ModalButton>
          </ModalActions>
        </ModalContent>
      </ConfirmModal>
      
      {/* مودال تغییر رمز عبور */}
      <ChangePasswordModal 
        $isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
      
      {/* مودال تأیید حذف از علاقه‌مندی‌ها */}
      <ConfirmDeleteModal 
        $isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteFavorite}
        itemName={selectedRestaurant?.name || 'این رستوران'}
      />
    </ProfilePageContainer>
  );
};

// استایل‌های رستوران‌های مورد علاقه
const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const RestaurantCard = styled.div`
  background-color: white;
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.boxShadow.md};
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.error[500]};
  cursor: pointer;
  z-index: 10;
  font-size: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.error[500]};
    color: white;
  }
`;

const RestaurantImageContainer = styled.div`
  height: 140px;
  background-color: ${props => props.theme.colors.primary[50]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 60px;
    height: 60px;
    color: ${props => props.theme.colors.primary[500]};
  }
`;

const RestaurantContent = styled.div`
  padding: 1rem;
`;

const RestaurantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const RestaurantName = styled.a`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
  }
`;

const RestaurantRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[800]};
`;

const RestaurantDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 0.75rem;
  line-height: 1.5;
`;

const RestaurantMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: ${props => props.theme.typography.fontSizes.sm};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.colors.neutral[700]};
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const CategoryTag = styled.span`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  background-color: ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.neutral[700]};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
`;

const ViewButton = styled.a`
  display: block;
  width: 100%;
  padding: 0.75rem 0;
  text-align: center;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSizes.md};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
`;

const FormActionsContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PasswordChangeSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PasswordChangeButton = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[700]};
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-vazirmatn);
  
  &:hover {
    background-color: ${props => props.theme.colors.neutral[100]};
    color: ${props => props.theme.colors.primary[500]};
    border-color: ${props => props.theme.colors.primary[300]};
  }
`;

export default ProfilePage; 