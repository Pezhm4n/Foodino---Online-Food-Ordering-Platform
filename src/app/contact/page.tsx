"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const ContactPageContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1rem 4rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);

  @media (min-width: 768px) {
    padding: 2.5rem 1.5rem 5rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 1.5rem;
  text-align: right;

  @media (min-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 2rem;
  }
`;

const ContactInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ContactInfoCard = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 1.75rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  flex: 1;
  text-align: right;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoItem = styled.p`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.neutral[700]};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-start;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid ${props => props.theme.colors.neutral[200]};

  @media (min-width: 768px) {
    padding: 2.25rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 1.25rem;
  text-align: right;

  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: ${props => props.theme.colors.neutral[800]};
  text-align: right;
`;

const FormInput = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border: 1.5px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: white;
  color: ${props => props.theme.colors.neutral[900]};
  font-family: var(--font-vazirmatn);
  text-align: right;
  direction: rtl;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.15);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border: 1.5px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: white;
  color: ${props => props.theme.colors.neutral[900]};
  font-family: var(--font-vazirmatn);
  min-height: 120px;
  resize: vertical;
  text-align: right;
  direction: rtl;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.15);
  }

  @media (min-width: 768px) {
    min-height: 140px;
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  min-height: 46px;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  font-family: var(--font-vazirmatn);
  box-shadow: 0 4px 12px rgba(255, 90, 0, 0.25);
  transition: all 0.2s ease;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.neutral[300]};
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
`;

const MapCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin-top: 2rem;
`;

const MapHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const MapTitleGroup = styled.div`
  h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: ${props => props.theme.colors.neutral[900]};
    margin: 0 0 0.25rem;
  }

  p {
    font-size: 0.85rem;
    color: ${props => props.theme.colors.neutral[500]};
    margin: 0;
  }
`;

const NavigationButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
  }
`;

const NavigationButton = styled.a`
  flex: 1;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  background-color: ${props => props.theme.colors.neutral[100]};
  color: ${props => props.theme.colors.neutral[800]};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.theme.colors.neutral[200]};
    color: ${props => props.theme.colors.neutral[900]};
  }

  @media (min-width: 640px) {
    flex: initial;
  }
`;

const MapFrameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
  background: #f1f5f9;

  @media (min-width: 768px) {
    height: 380px;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('پیام شما با موفقیت دریافت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.', {
        duration: 4000,
        icon: '✉️',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 600);
  };
  
  return (
    <ContactPageContainer>
      <PageTitle>تماس با پشتیبانی فودینو</PageTitle>
      
      <ContactInfoSection>
        <ContactInfoCard>
          <CardTitle>
            <span>📍</span>
            <span>دفتر مرکزی</span>
          </CardTitle>
          <InfoItem>تهران، خیابان ولیعصر، نرسیده به میدان ونک، برج فناوری فودینو، طبقه پنجم</InfoItem>
        </ContactInfoCard>
        
        <ContactInfoCard>
          <CardTitle>
            <span>📞</span>
            <span>تلفن تماس</span>
          </CardTitle>
          <InfoItem>پشتیبانی ۲۴ ساعته: ۰۲۱-۸۸۸۸۱۱۱۱</InfoItem>
          <InfoItem>صدای مشتریان: ۰۲۱-۸۸۸۸۲۲۲۲</InfoItem>
        </ContactInfoCard>
        
        <ContactInfoCard>
          <CardTitle>
            <span>⏰</span>
            <span>ساعات پاسخگویی</span>
          </CardTitle>
          <InfoItem>پشتیبانی آنلاین: همه‌روزه، ۲۴ ساعته و بدون تعطیلی</InfoItem>
          <InfoItem>امور اداری: شنبه تا چهارشنبه ۹:۰۰ الی ۱۷:۰۰</InfoItem>
        </ContactInfoCard>
      </ContactInfoSection>
      
      <FormContainer>
        <FormTitle>ارسال پیام</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name">نام و نام خانوادگی</FormLabel>
            <FormInput
              id="name"
              name="name"
              placeholder="مثال: سارا محمدی"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="email">ایمیل</FormLabel>
            <FormInput
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="phone">شماره تماس (اختیاری)</FormLabel>
            <FormInput
              id="phone"
              name="phone"
              placeholder="09123456789"
              value={formData.phone}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="subject">موضوع</FormLabel>
            <FormInput
              id="subject"
              name="subject"
              placeholder="مثال: پیگیری سفارش / پیشنهاد رستوران جدید"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="message">پیام</FormLabel>
            <FormTextarea
              id="message"
              name="message"
              placeholder="لطفاً پیام یا نظر خود را اینجا بنویسید..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <div style={{ textAlign: 'left' }}>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
            </SubmitButton>
          </div>
        </form>
      </FormContainer>
      
      <MapCard>
        <MapHeader>
          <MapTitleGroup>
            <h3>موقعیت مکانی فودینو روی نقشه</h3>
            <p>تهران، خیابان ولیعصر، برج فناوری فودینو</p>
          </MapTitleGroup>
          <NavigationButtonGroup>
            <NavigationButton
              href="https://nshn.ir"
              target="_blank"
              rel="noopener noreferrer"
              title="مسیریابی در نشان"
            >
              🗺️ نشان
            </NavigationButton>
            <NavigationButton
              href="https://balad.ir"
              target="_blank"
              rel="noopener noreferrer"
              title="مسیریابی در بلد"
            >
              🚗 بلد
            </NavigationButton>
            <NavigationButton
              href="https://maps.google.com/?q=35.699397,51.067617"
              target="_blank"
              rel="noopener noreferrer"
              title="باز کردن در گوگل مپ"
            >
              🌐 Google Maps
            </NavigationButton>
          </NavigationButtonGroup>
        </MapHeader>
        <MapFrameContainer>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207371.97156121524!2d51.0676170642672!3d35.69939796943041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491ff3dcd9%3A0xf0b3697c567024bc!2sTehran%2C%20Tehran%20Province%2C%20Iran!5e0!3m2!1sen!2s!4v1647819744882!5m2!1sen!2s" 
            title="موقعیت مکانی فودینو"
            loading="lazy"
            allowFullScreen
          />
        </MapFrameContainer>
      </MapCard>
    </ContactPageContainer>
  );
};

export default ContactPage; 
