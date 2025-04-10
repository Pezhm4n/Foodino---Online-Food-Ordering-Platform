"use client";

import React from 'react';
import styled from 'styled-components';

const TermsPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  direction: rtl;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1rem;
`;

const UpdatedDate = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.neutral[500]};
`;

const TermsContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.boxShadow.md};
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const SectionContent = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  line-height: 1.8;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
`;

const List = styled.ul`
  margin: 1rem 0;
  padding-right: 1.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`;

const TermsPage = () => {
  return (
    <TermsPageContainer>
      <PageHeader>
        <PageTitle>قوانین و مقررات</PageTitle>
        <UpdatedDate>آخرین به‌روزرسانی: ۱۵ فروردین ۱۴۰۲</UpdatedDate>
      </PageHeader>
      
      <TermsContent>
        <Section>
          <SectionTitle>مقدمه</SectionTitle>
          <SectionContent>
            <Paragraph>
              به فودینو خوش آمدید! لطفاً قبل از استفاده از سایت و اپلیکیشن فودینو، قوانین و مقررات زیر را به دقت مطالعه نمایید. استفاده از خدمات فودینو به معنای پذیرش این قوانین و مقررات است.
            </Paragraph>
            <Paragraph>
              این قوانین ممکن است از زمان به زمان تغییر کنند. مسئولیت بررسی دوره‌ای این صفحه برای آگاهی از تغییرات بر عهده کاربران است. استفاده مستمر از خدمات فودینو بعد از اعمال تغییرات، به معنای پذیرش قوانین جدید از سوی کاربر است.
            </Paragraph>
          </SectionContent>
        </Section>
        
        <Section>
          <SectionTitle>ثبت نام و حساب کاربری</SectionTitle>
          <SectionContent>
            <Paragraph>
              برای استفاده از خدمات فودینو، شما باید حساب کاربری ایجاد کنید و اطلاعات دقیق و کامل را ارائه دهید. شما مسئول حفظ امنیت حساب کاربری خود هستید و نباید اطلاعات ورود به حساب خود را در اختیار دیگران قرار دهید.
            </Paragraph>
            <Paragraph>
              فودینو حق دارد در صورت تشخیص هرگونه تخلف، حساب کاربری را به صورت موقت یا دائم مسدود کند. در صورت مشاهده هرگونه فعالیت غیرمجاز با حساب کاربری خود، باید بلافاصله فودینو را مطلع سازید.
            </Paragraph>
          </SectionContent>
        </Section>
        
        <Section>
          <SectionTitle>سفارش و پرداخت</SectionTitle>
          <SectionContent>
            <Paragraph>
              با ثبت سفارش در فودینو، شما قرارداد خرید محصول از رستوران منتخب را منعقد می‌کنید. فودینو صرفاً واسطه بین شما و رستوران است و مسئولیت کیفیت غذا بر عهده رستوران می‌باشد.
            </Paragraph>
            <List>
              <ListItem>قیمت محصولات شامل مالیات بر ارزش افزوده است، اما هزینه ارسال به صورت جداگانه محاسبه می‌شود.</ListItem>
              <ListItem>تمامی پرداخت‌ها از طریق درگاه‌های مجاز بانکی انجام می‌شود و فودینو هیچ‌گونه دسترسی به اطلاعات کارت بانکی کاربران ندارد.</ListItem>
              <ListItem>در صورت انصراف از سفارش، باید با پشتیبانی فودینو تماس بگیرید. بازگشت وجه طبق سیاست‌های هر رستوران و زمان اعلام انصراف متفاوت است.</ListItem>
            </List>
          </SectionContent>
        </Section>
        
        <Section>
          <SectionTitle>تحویل سفارش</SectionTitle>
          <SectionContent>
            <Paragraph>
              زمان تحویل سفارش تخمینی است و ممکن است تحت تأثیر عوامل مختلفی مانند ترافیک، شرایط آب و هوایی یا حجم سفارشات رستوران قرار گیرد. فودینو تلاش می‌کند تا سفارشات در سریع‌ترین زمان ممکن تحویل داده شوند.
            </Paragraph>
            <Paragraph>
              آدرس تحویل باید دقیق و کامل باشد. در صورت اشتباه در آدرس، فودینو مسئولیتی در قبال تأخیر یا عدم تحویل ندارد.
            </Paragraph>
          </SectionContent>
        </Section>
        
        <Section>
          <SectionTitle>محتوای کاربران</SectionTitle>
          <SectionContent>
            <Paragraph>
              کاربران می‌توانند نظرات و امتیازات خود را درباره رستوران‌ها و غذاها ثبت کنند. تمامی محتوای ارسالی باید با قوانین فودینو مطابقت داشته باشد. فودینو حق دارد هر محتوایی را که نامناسب تشخیص دهد، حذف کند.
            </Paragraph>
            <Paragraph>
              با ارسال محتوا در فودینو، شما به فودینو اجازه می‌دهید که از این محتوا در سایت، اپلیکیشن و مواد تبلیغاتی خود استفاده کند.
            </Paragraph>
          </SectionContent>
        </Section>
        
        <Section>
          <SectionTitle>محدودیت مسئولیت</SectionTitle>
          <SectionContent>
            <Paragraph>
              فودینو تلاش می‌کند خدماتی با کیفیت بالا ارائه دهد، اما تضمینی برای دسترسی همیشگی و بدون اختلال به سرویس نمی‌دهد. فودینو مسئولیتی در قبال خسارات مستقیم، غیرمستقیم، اتفاقی یا تبعی ناشی از استفاده یا عدم توانایی در استفاده از خدمات ندارد.
            </Paragraph>
          </SectionContent>
        </Section>
        
        <Section>
          <SectionTitle>قانون حاکم و مرجع حل اختلاف</SectionTitle>
          <SectionContent>
            <Paragraph>
              این قوانین تحت حاکمیت قوانین جمهوری اسلامی ایران تنظیم شده‌اند. هرگونه اختلاف ناشی از تفسیر یا اجرای این قوانین، ابتدا از طریق مذاکره دوستانه حل و فصل خواهد شد و در صورت عدم حصول نتیجه، مراجع قضایی ذی‌صلاح در ایران صلاحیت رسیدگی خواهند داشت.
            </Paragraph>
          </SectionContent>
        </Section>
        
        <Section>
          <SectionTitle>تماس با ما</SectionTitle>
          <SectionContent>
            <Paragraph>
              در صورت داشتن هرگونه سوال یا ابهام درباره قوانین و مقررات فودینو، می‌توانید از طریق ایمیل info@foodino.ir یا شماره تلفن ۰۲۱-۱۲۳۴۵۶۷۸ با ما تماس بگیرید.
            </Paragraph>
          </SectionContent>
        </Section>
      </TermsContent>
    </TermsPageContainer>
  );
};

export default TermsPage; 