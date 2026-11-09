"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import {
  FoodinoEmblem,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ShieldCheckIcon,
  ClockIcon,
  SparkleIcon,
  GithubIcon,
  LinkedinIcon,
} from "@/components/ui/FoodVisuals";

const FooterContainer = styled.footer`
  background: linear-gradient(180deg, #16120f 0%, #100d0a 100%);
  color: ${(props) => props.theme.colors.neutral[300]};
  padding: 4.5rem 1.75rem 2.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  direction: rtl;
  position: relative;
  overflow: hidden;

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    padding: 3rem 1.15rem 1.75rem;
  }
`;

const FooterInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
`;

const TopTrustStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding-bottom: 2.75rem;
  margin-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding-bottom: 2rem;
    margin-bottom: 2rem;
  }
`;

const TrustPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: 1rem 1.15rem;
`;

const TrustIconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(217, 56, 30, 0.16);
  color: #f49f83;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TrustText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  strong {
    color: #faf6f0;
    font-size: 0.92rem;
    font-weight: 700;
  }

  span {
    color: ${(props) => props.theme.colors.neutral[400]};
    font-size: 0.8rem;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.3fr;
  gap: 2.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandHeader = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  margin-bottom: 1rem;

  span.brand-name {
    font-size: 1.5rem;
    font-weight: 800;
    color: #faf6f0;
    letter-spacing: -0.02em;
  }
`;

const BrandDescription = styled.p`
  font-size: 0.92rem;
  line-height: 1.8;
  color: ${(props) => props.theme.colors.neutral[400]};
  margin: 0 0 1.35rem;
  max-width: 34ch;
`;

const FooterTitle = styled.h3`
  font-size: 1.02rem;
  font-weight: 700;
  color: #faf6f0;
  margin: 0 0 1.15rem;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: ${(props) => props.theme.colors.primary[500]};
    border-radius: 50%;
  }
`;

const FooterLink = styled(Link)`
  color: ${(props) => props.theme.colors.neutral[400]};
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 0.55rem;
  transition: color 160ms ease, transform 160ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 32px;
  width: fit-content;

  &:hover {
    color: #faf6f0;
    transform: translateX(-4px);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.neutral[300]};
  line-height: 1.65;

  span.icon {
    color: ${(props) => props.theme.colors.primary[400]};
    flex-shrink: 0;
    margin-top: 0.2rem;
    display: inline-flex;
  }
`;

const BottomBar = styled.div`
  margin-top: 3.25rem;
  padding-top: 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.25rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
    margin-top: 2.25rem;
  }
`;

const CopyrightText = styled.p`
  margin: 0;
  color: ${(props) => props.theme.colors.neutral[400]};
  font-size: 0.85rem;
`;

const AttributionCard = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.95rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: 0.82rem;
  color: ${(props) => props.theme.colors.neutral[300]};

  strong {
    color: #faf6f0;
    font-weight: 700;
  }
`;

const CreatorSocialLinks = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding-right: 0.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
`;

const CreatorLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #faf6f0;
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease, transform 120ms ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary[500]};
    color: #ffffff;
    transform: translateY(-1px);
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterInner>
        <TopTrustStrip>
          <TrustPill>
            <TrustIconBox>
              <ClockIcon size={20} />
            </TrustIconBox>
            <TrustText>
              <strong>ارسال گرم و زمان‌بندی‌شده</strong>
              <span>تحویل سریع با کیف‌های عایق حرارتی استاندارد</span>
            </TrustText>
          </TrustPill>

          <TrustPill>
            <TrustIconBox>
              <SparkleIcon size={20} />
            </TrustIconBox>
            <TrustText>
              <strong>آشپزخانه‌های منتخب شهر</strong>
              <span>مواد اولیه تازه روز و نظارت مستمر بر کیفیت پخت</span>
            </TrustText>
          </TrustPill>

          <TrustPill>
            <TrustIconBox>
              <ShieldCheckIcon size={20} />
            </TrustIconBox>
            <TrustText>
              <strong>تضمین رضایت و رهگیری زنده</strong>
              <span>محاسبه شفاف قیمت در سرور و پشتیبانی تمام‌وقت</span>
            </TrustText>
          </TrustPill>
        </TopTrustStrip>

        <FooterContent>
          <FooterSection>
            <BrandHeader href="/">
              <FoodinoEmblem size={38} />
              <span className="brand-name">فودینو</span>
            </BrandHeader>
            <BrandDescription>
              فودینو تجربه‌ای نو از سفارش آنلاین غذاست؛ جایی که اصالت طعم،
              آشپزخانه‌های منتخب شهر و ارسال دقیق در یک پلتفرم یکپارچه به هم
              می‌رسند.
            </BrandDescription>
          </FooterSection>

          <FooterSection>
            <FooterTitle>دسترسی سریع</FooterTitle>
            <FooterLink href="/">صفحه اصلی</FooterLink>
            <FooterLink href="/restaurants">فهرست رستوران‌ها</FooterLink>
            <FooterLink href="/categories">دسته‌بندی‌های غذایی</FooterLink>
            <FooterLink href="/order-tracking">پیگیری زنده سفارش</FooterLink>
            <FooterLink href="/cart">سبد خرید</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>راهنما و اطلاعات</FooterTitle>
            <FooterLink href="/about">درباره فودینو</FooterLink>
            <FooterLink href="/contact">ارتباط با پشتیبانی</FooterLink>
            <FooterLink href="/faq">پرسش‌های متداول</FooterLink>
            <FooterLink href="/terms">قوانین و شرایط استفاده</FooterLink>
            <FooterLink href="/privacy">حریم خصوصی کاربران</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>ارتباط مستقیم</FooterTitle>
            <ContactItem>
              <span className="icon">
                <MapPinIcon size={18} />
              </span>
              <span>تهران، خیابان ولیعصر، تقاطع خیابان بهشتی، پلاک ۴۵</span>
            </ContactItem>
            <ContactItem>
              <span className="icon">
                <PhoneIcon size={18} />
              </span>
              <span dir="ltr">۰۲۱ - ۸۸۴۵ ۹۲۰۰</span>
            </ContactItem>
            <ContactItem>
              <span className="icon">
                <MailIcon size={18} />
              </span>
              <span>support@foodino.ir</span>
            </ContactItem>
          </FooterSection>
        </FooterContent>

        <BottomBar>
          <CopyrightText>
            © {new Date().toLocaleDateString("fa-IR", { year: "numeric" })}{" "}
            فودینو — تمامی حقوق این پلتفرم محفوظ است.
          </CopyrightText>

          <AttributionCard>
            <span>
              طراحی و توسعه توسط <strong>پژمان سرمدی</strong> (Pezhman Sarmadi)
            </span>
            <CreatorSocialLinks>
              <CreatorLink
                href="https://github.com/Pezhm4n"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="گیت‌هاب پژمان سرمدی"
              >
                <GithubIcon size={14} />
                <span>GitHub</span>
              </CreatorLink>
              <CreatorLink
                href="https://linkedin.com/in/pezhman-sarmadi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="لینکدین پژمان سرمدی"
              >
                <LinkedinIcon size={14} />
                <span>LinkedIn</span>
              </CreatorLink>
              <CreatorLink
                href="mailto:pksarmadi@gmail.com"
                aria-label="ارسال ایمیل به پژمان سرمدی"
              >
                <MailIcon size={14} />
                <span>Email</span>
              </CreatorLink>
            </CreatorSocialLinks>
          </AttributionCard>
        </BottomBar>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;
