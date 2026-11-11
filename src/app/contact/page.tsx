"use client";

import { useSyncExternalStore, type FormEvent } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import SectionReveal from '@/components/home/LandingReveal';
import { actionFeedback, actionFeedbackAttrs, cardIconFeedback, fieldFeedback, motionTokens } from '@/styles/motion';
import {
  TrackRadarIcon,
  BagIcon,
  MailIcon,
  MapPinIcon,
  ArrowLeftIcon,
} from '@/components/ui/FoodVisuals';

const ContactPageContainer = styled(SectionReveal)`
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
  transition: border-color ${motionTokens.duration.fast};

  &:focus-within { border-color: ${({ theme }) => theme.colors.primary[400]}; }
  @media (hover: hover) and (pointer: fine) {
    &:hover { border-color: ${({ theme }) => theme.colors.primary[400]}; }
  }
  @media (prefers-reduced-motion: reduce) { transition: none; }
  ${cardIconFeedback}
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

  &:focus-within label { color: ${({ theme }) => theme.colors.primary[700]}; }
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
  ${fieldFeedback}
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
  ${fieldFeedback}
`;

const SubmitButton = styled.button.attrs<typeof actionFeedbackAttrs>(actionFeedbackAttrs)`
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
  --action-hover-bg: ${({ theme }) => theme.colors.primary[600]};
  --action-hover-ink: #ffffff;
  --action-press-bg: ${({ theme }) => theme.colors.primary[700]};
  --action-hover-shadow: ${({ theme }) => theme.shadows.brand};
  ${actionFeedback}

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
  h2 {
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

const NavigationButton = styled(Link).attrs<typeof actionFeedbackAttrs>(actionFeedbackAttrs)`
  min-height: 44px;
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
  &[data-map-link] { --action-icon-shift: 0 -3px; }
  ${actionFeedback}
`;

const MapFrame = styled.iframe`
  display: block;
  width: 100%;
  height: clamp(16rem, 42vw, 23rem);
  border: 0;
  background: ${props => props.theme.colors.neutral[100]};
`;

const sampleLocation = { latitude: 35.699397, longitude: 51.067617 };
const coordinates = sampleLocation.latitude + ',' + sampleLocation.longitude;
const mapLinks = [
  { label: 'نمایش در نشان', href: 'https://neshan.org/maps/share/' + coordinates },
  {
    label: 'نمایش در بلد',
    href: 'https://balad.ir/location?latitude=' + sampleLocation.latitude + '&longitude=' + sampleLocation.longitude + '&zoom=15',
  },
  { label: 'نمایش در گوگل‌مپ', href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(coordinates) },
];
const email = 'pksarmadi@gmail.com';
const subscribe = () => () => undefined;

export default function ContactPage() {
  const canCompose = useSyncExternalStore(subscribe, () => true, () => false);

  function openEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get('subject') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const name = String(data.get('name') ?? '').trim();
    const reply = String(data.get('email') ?? '').trim();
    const body = [message, name && 'نام ' + name, reply && 'ایمیل پاسخ ' + reply].filter(Boolean).join('\r\n\r\n');
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  return (
    <ContactPageContainer>
      <HeaderBlock data-landing-reveal>
        <h1>تماس با فودینو</h1>
        <p>برای پیشنهاد یا گزارش مشکل سایت، به توسعه‌دهنده ایمیل بزنید. وضعیت و جزئیات خرید را هم می‌توانید از مسیرهای زیر ببینید.</p>
      </HeaderBlock>

      <ContactInfoSection>
        <ContactInfoCard data-landing-card>
          <CardTitle as="h2"><IconBox data-feedback-icon><MailIcon size={18} /></IconBox>تماس با توسعه‌دهنده</CardTitle>
          <InfoItem>برای پیشنهاد یا گزارش مشکلی در سایت.</InfoItem>
          <NavigationButton href={'mailto:' + email}>نوشتن ایمیل <ArrowLeftIcon size={14} /></NavigationButton>
        </ContactInfoCard>
        <ContactInfoCard data-landing-card>
          <CardTitle as="h2"><IconBox data-feedback-icon><BagIcon size={18} /></IconBox>جزئیات خرید</CardTitle>
          <InfoItem>غذاها، نشانی و مبلغ سفارش را در حساب خود ببینید.</InfoItem>
          <NavigationButton href="/profile">دیدن سفارش‌ها <ArrowLeftIcon size={14} /></NavigationButton>
        </ContactInfoCard>
        <ContactInfoCard data-landing-card>
          <CardTitle as="h2"><IconBox data-feedback-icon><TrackRadarIcon size={18} /></IconBox>پیگیری سفارش</CardTitle>
          <InfoItem>اگر کد رهگیری دارید، وضعیت سفارش را ببینید.</InfoItem>
          <NavigationButton href="/order-tracking">پیگیری سفارش <ArrowLeftIcon size={14} /></NavigationButton>
        </ContactInfoCard>
      </ContactInfoSection>

      <FormContainer data-landing-reveal>
        <FormTitle><IconBox><MailIcon size={18} /></IconBox>نوشتن پیام</FormTitle>
        <InfoItem id="email-instructions">این فرم متن را در برنامهٔ ایمیل باز می‌کند. برای فرستادن پیام، در همان برنامه دکمهٔ ارسال را بزنید.</InfoItem>
        <form method="post" onSubmit={openEmail} aria-describedby="email-instructions">
          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="name">نام (اختیاری)</FormLabel>
              <FormInput id="name" name="name" autoComplete="name" maxLength={80} />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="email">ایمیل برای پاسخ (اختیاری)</FormLabel>
              <FormInput id="email" name="email" type="email" autoComplete="email" maxLength={254} />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <FormLabel htmlFor="subject">موضوع</FormLabel>
            <FormInput id="subject" name="subject" required maxLength={120} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="message">پیام</FormLabel>
            <FormTextarea id="message" name="message" required maxLength={1500} />
          </FormGroup>
          <div style={{ textAlign: 'left' }}>
            <SubmitButton type="submit" disabled={!canCompose}>باز کردن برنامهٔ ایمیل <ArrowLeftIcon size={16} /></SubmitButton>
          </div>
        </form>
      </FormContainer>

      <MapCard data-landing-reveal>
        <MapHeader>
          <MapTitleGroup><h2>راهنمای سفارش</h2><p>روش ثبت سفارش، استفاده از کد تخفیف و پیگیری را ببینید.</p></MapTitleGroup>
          <NavigationButtonGroup>
            <NavigationButton href="/faq">پرسش‌های متداول <ArrowLeftIcon size={14} /></NavigationButton>
          </NavigationButtonGroup>
        </MapHeader>
      </MapCard>

      <MapCard as="section" aria-labelledby="contact-map-title" data-landing-reveal>
        <MapHeader>
          <MapTitleGroup>
            <h2 id="contact-map-title">موقعیت نمونه روی نقشه</h2>
            <p>این پین برای نمایش نمونه در تهران است.</p>
          </MapTitleGroup>
          <NavigationButtonGroup>
            {mapLinks.map(({ label, href }) => (
              <NavigationButton key={href} href={href} target="_blank" rel="noopener noreferrer" data-map-link>
                <MapPinIcon size={15} /> {label}
              </NavigationButton>
            ))}
          </NavigationButtonGroup>
        </MapHeader>
        <MapFrame
          src={'https://maps.google.com/maps?q=' + encodeURIComponent(coordinates) + '&z=15&output=embed'}
          title="نقشهٔ موقعیت نمونه در تهران"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </MapCard>
    </ContactPageContainer>
  );
}
