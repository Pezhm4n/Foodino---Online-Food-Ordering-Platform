"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  MailIcon,
  ArrowLeftIcon,
} from '@/components/ui/FoodVisuals';

const ContactPageContainer = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4.5rem;
  direction: rtl;

  @media (min-width: 768px) {
    padding: 2.5rem 1.5rem 5rem;
  }
`;

const HeaderBlock = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: clamp(1.65rem, 3vw, 2.25rem);
    font-weight: 900;
    color: ${props => props.theme.colors.neutral[900]};
    margin: 0 0 0.4rem;
  }

  p {
    font-size: 0.95rem;
    color: ${props => props.theme.colors.neutral[500]};
    margin: 0;
  }
`;

const ContactInfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfoCard = styled.div`
  background-color: #ffffff;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.xs};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const CardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const IconBox = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[600]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const InfoItem = styled.p`
  font-size: 0.9rem;
  margin: 0 0 0.45rem;
  color: ${props => props.theme.colors.neutral[600]};
  line-height: 1.65;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  padding: 2rem;
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.neutral[200]};

  @media (max-width: 640px) {
    padding: 1.25rem 1rem;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.15rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.15rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.88rem;
  font-weight: 700;
  margin-bottom: 0.45rem;
  color: ${props => props.theme.colors.neutral[800]};
`;

const FormInput = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border: 1.5px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.neutral[50]};
  color: ${props => props.theme.colors.neutral[900]};
  outline: none;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    background-color: #ffffff;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  border: 1.5px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.neutral[50]};
  color: ${props => props.theme.colors.neutral[900]};
  min-height: 130px;
  resize: vertical;
  outline: none;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    background-color: #ffffff;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 800;
  font-size: 0.95rem;
  min-height: 48px;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.xl};
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.brand};
  transition: background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primary[600]};
      transform: translateY(-1px);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: ${props => props.theme.colors.neutral[300]};
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const MapCard = styled.div`
  background: #ffffff;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  box-shadow: ${props => props.theme.shadows.xs};
  overflow: hidden;
  margin-top: 2rem;
`;

const MapHeader = styled.div`
  padding: 1.35rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const MapTitleGroup = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 800;
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
`;

const NavigationButton = styled.a`
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  background-color: ${props => props.theme.colors.neutral[50]};
  color: ${props => props.theme.colors.neutral[800]};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary[400]};
    color: ${props => props.theme.colors.primary[600]};
  }
`;

const MapFrameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  background: ${props => props.theme.colors.neutral[100]};

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
      <HeaderBlock>
        <h1>تماس با پشتیبانی فودینو</h1>
        <p>تیم پشتیبانی سفارش‌ها و امور رستوران‌ها در تمام ساعات شبانه‌روز آماده پاسخگویی به شماست.</p>
      </HeaderBlock>

      <ContactInfoSection>
        <ContactInfoCard>
          <CardTitle>
            <IconBox>
              <MapPinIcon size={18} />
            </IconBox>
            <span>دفتر مرکزی</span>
          </CardTitle>
          <InfoItem>تهران، خیابان ولیعصر، تقاطع خیابان بهشتی، پلاک ۴۵</InfoItem>
        </ContactInfoCard>

        <ContactInfoCard>
          <CardTitle>
            <IconBox>
              <PhoneIcon size={18} />
            </IconBox>
            <span>تلفن تماس</span>
          </CardTitle>
          <InfoItem>پشتیبانی ۲۴ ساعته: ۰۲۱ - ۸۸۴۵ ۹۲۰۰</InfoItem>
          <InfoItem>صدای مشتریان: ۰۲۱ - ۸۸۴۵ ۹۲۰۱</InfoItem>
        </ContactInfoCard>

        <ContactInfoCard>
          <CardTitle>
            <IconBox>
              <ClockIcon size={18} />
            </IconBox>
            <span>ساعات پاسخگویی</span>
          </CardTitle>
          <InfoItem>پشتیبانی آنلاین: همه‌روزه، ۲۴ ساعته و بدون تعطیلی</InfoItem>
          <InfoItem>امور اداری: شنبه تا چهارشنبه ۹:۰۰ الی ۱۷:۰۰</InfoItem>
        </ContactInfoCard>
      </ContactInfoSection>

      <FormContainer>
        <FormTitle>
          <IconBox>
            <MailIcon size={18} />
          </IconBox>
          <span>ارسال پیام مستقیم</span>
        </FormTitle>
        <form onSubmit={handleSubmit}>
          <FormRow>
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
          </FormRow>

          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="phone">شماره تماس (اختیاری)</FormLabel>
              <FormInput
                id="phone"
                name="phone"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
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
          </FormRow>

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
              <span>{isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}</span>
              <ArrowLeftIcon size={16} />
            </SubmitButton>
          </div>
        </form>
      </FormContainer>

      <MapCard>
        <MapHeader>
          <MapTitleGroup>
            <h3>موقعیت مکانی فودینو روی نقشه</h3>
            <p>تهران، خیابان ولیعصر، تقاطع خیابان بهشتی، پلاک ۴۵</p>
          </MapTitleGroup>
          <NavigationButtonGroup>
            <NavigationButton
              href="https://nshn.ir"
              target="_blank"
              rel="noopener noreferrer"
              title="مسیریابی در نشان"
            >
              <MapPinIcon size={14} />
              <span>مسیریابی در نشان</span>
            </NavigationButton>
            <NavigationButton
              href="https://balad.ir"
              target="_blank"
              rel="noopener noreferrer"
              title="مسیریابی در بلد"
            >
              <MapPinIcon size={14} />
              <span>مسیریابی در بلد</span>
            </NavigationButton>
            <NavigationButton
              href="https://maps.google.com/?q=35.699397,51.067617"
              target="_blank"
              rel="noopener noreferrer"
              title="باز کردن در گوگل مپ"
            >
              <MapPinIcon size={14} />
              <span>Google Maps</span>
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
