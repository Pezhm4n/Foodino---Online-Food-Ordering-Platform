"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

const ContactPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary[500]};
  margin-bottom: 2rem;
  text-align: right;
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
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  flex: 1;
  text-align: right;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary[500]};
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
  justify-content: flex-end;
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary[500]};
  margin-bottom: 1.5rem;
  text-align: right;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.neutral[900]};
  text-align: right;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props => props.theme.colors.neutral[50]};
  color: ${props => props.theme.colors.neutral[900]};
  font-family: var(--font-vazirmatn);
  text-align: right;
  direction: rtl;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[400] + '40'};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props => props.theme.colors.neutral[50]};
  color: ${props => props.theme.colors.neutral[900]};
  font-family: var(--font-vazirmatn);
  min-height: 150px;
  resize: vertical;
  text-align: right;
  direction: rtl;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[400] + '40'};
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  cursor: pointer;
  font-family: var(--font-vazirmatn);
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.neutral[300]};
    cursor: not-allowed;
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
    
    // اینجا می‌توانید کد ارسال فرم به سرور را اضافه کنید
    
    setTimeout(() => {
      // شبیه‌سازی پاسخ سرور
      alert('پیام شما با موفقیت ارسال شد.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <ContactPageContainer>
      <PageTitle>تماس با ما</PageTitle>
      
      <ContactInfoSection>
        <ContactInfoCard>
          <CardTitle>
            <span>📍</span>
            <span>آدرس ما</span>
          </CardTitle>
          <InfoItem>تهران، خیابان ولیعصر، خیابان فرشته، پلاک ۱۲۳</InfoItem>
        </ContactInfoCard>
        
        <ContactInfoCard>
          <CardTitle>
            <span>📞</span>
            <span>تلفن تماس</span>
          </CardTitle>
          <InfoItem>۰۲۱-۱۲۳۴۵۶۷۸</InfoItem>
          <InfoItem>۰۹۱۲۳۴۵۶۷۸۹</InfoItem>
        </ContactInfoCard>
        
        <ContactInfoCard>
          <CardTitle>
            <span>📧</span>
            <span>ایمیل</span>
          </CardTitle>
          <InfoItem>info@foodino.ir</InfoItem>
          <InfoItem>support@foodino.ir</InfoItem>
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
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="phone">شماره تماس</FormLabel>
            <FormInput
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="subject">موضوع</FormLabel>
            <FormInput
              id="subject"
              name="subject"
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
      
      <div style={{ marginTop: '3rem' }}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207371.97156121524!2d51.0676170642672!3d35.69939796943041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491ff3dcd9%3A0xf0b3697c567024bc!2sTehran%2C%20Tehran%20Province%2C%20Iran!5e0!3m2!1sen!2s!4v1647819744882!5m2!1sen!2s" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          title="آدرس فودینو"
        />
      </div>
    </ContactPageContainer>
  );
};

export default ContactPage; 
