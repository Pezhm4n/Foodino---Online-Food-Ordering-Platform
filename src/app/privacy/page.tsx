"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[700]};
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.neutral[500]};
`;

const SectionContainer = styled.div`
  margin-bottom: 2.5rem;
  background-color: white;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.primary[500]};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const SectionContent = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.neutral[700]};
  line-height: 1.7;
`;

const Paragraph = styled.p`
  margin-bottom: 1rem;
`;

const ListTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: ${props => props.theme.colors.neutral[700]};
`;

const List = styled.ul`
  padding-right: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.75rem;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  margin-top: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary[400]};
  }
`;

const PrivacyPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>سیاست حریم خصوصی</PageTitle>
        <PageDescription>
          در این صفحه می‌توانید با سیاست‌های حریم خصوصی فودینو آشنا شوید
        </PageDescription>
      </PageHeader>
      
      <SectionContainer>
        <SectionTitle>مقدمه</SectionTitle>
        <SectionContent>
          <Paragraph>
            فودینو ("ما"، "ما" یا "ما") متعهد به حفظ حریم خصوصی شما هنگام استفاده از وب‌سایت و اپلیکیشن موبایل ما است. این سیاست حریم خصوصی توضیح می‌دهد که چگونه اطلاعات شخصی را جمع‌آوری، استفاده، ذخیره و در صورت لزوم به اشتراک می‌گذاریم.
          </Paragraph>
          <Paragraph>
            با استفاده از سرویس‌های فودینو، شما با شرایط این سیاست حریم خصوصی موافقت می‌کنید. در صورت عدم موافقت با این شرایط، لطفاً از سرویس‌های ما استفاده نکنید.
          </Paragraph>
        </SectionContent>
      </SectionContainer>
      
      <SectionContainer>
        <SectionTitle>اطلاعاتی که جمع‌آوری می‌کنیم</SectionTitle>
        <SectionContent>
          <Paragraph>
            ما انواع مختلفی از اطلاعات را جمع‌آوری می‌کنیم تا بتوانیم خدمات بهتری به شما ارائه دهیم:
          </Paragraph>
          
          <ListTitle>اطلاعات شخصی</ListTitle>
          <List>
            <ListItem>اطلاعات حساب کاربری: نام، آدرس ایمیل، شماره تلفن و رمز عبور شما</ListItem>
            <ListItem>اطلاعات پروفایل: آدرس‌ها، تصویر پروفایل و ترجیحات غذایی</ListItem>
            <ListItem>اطلاعات مالی: جزئیات کارت بانکی و سوابق تراکنش‌ها</ListItem>
          </List>
          
          <ListTitle>اطلاعات سفارش</ListTitle>
          <List>
            <ListItem>سوابق سفارش: غذاهایی که سفارش داده‌اید، رستوران‌هایی که از آنها خرید کرده‌اید و زمان سفارش‌های شما</ListItem>
            <ListItem>اطلاعات تحویل: آدرس تحویل و دستورالعمل‌های خاص برای تحویل</ListItem>
          </List>
          
          <ListTitle>اطلاعات فنی</ListTitle>
          <List>
            <ListItem>اطلاعات دستگاه: نوع دستگاه، سیستم عامل، مرورگر، آدرس IP و شناسه دستگاه</ListItem>
            <ListItem>داده‌های استفاده: نحوه استفاده شما از سرویس ما، صفحاتی که بازدید می‌کنید و زمان صرف شده</ListItem>
            <ListItem>داده‌های موقعیت مکانی: در صورت اجازه شما، موقعیت دقیق دستگاه شما برای ارائه خدمات مبتنی بر موقعیت مکانی</ListItem>
          </List>
        </SectionContent>
      </SectionContainer>
      
      <SectionContainer>
        <SectionTitle>نحوه استفاده از اطلاعات</SectionTitle>
        <SectionContent>
          <Paragraph>
            ما از اطلاعات جمع‌آوری شده برای موارد زیر استفاده می‌کنیم:
          </Paragraph>
          <List>
            <ListItem>ارائه، شخصی‌سازی و بهبود خدمات ما به شما</ListItem>
            <ListItem>پردازش و تحویل سفارش‌های شما</ListItem>
            <ListItem>ارتباط با شما در مورد سفارش‌ها، پیشنهادات و خدمات ما</ListItem>
            <ListItem>ارسال اطلاعیه‌های مهم در مورد تغییرات در خدمات یا شرایط ما</ListItem>
            <ListItem>تحلیل داده‌ها برای بهبود خدمات، محصولات و تجربه کاربری</ListItem>
            <ListItem>شناسایی و جلوگیری از تقلب و سایر فعالیت‌های غیرقانونی</ListItem>
            <ListItem>حفاظت از حقوق، اموال یا ایمنی ما، کاربران ما یا دیگران</ListItem>
          </List>
        </SectionContent>
      </SectionContainer>
      
      <SectionContainer>
        <SectionTitle>اشتراک‌گذاری اطلاعات</SectionTitle>
        <SectionContent>
          <Paragraph>
            ما ممکن است اطلاعات شما را با اشخاص ثالث در موارد زیر به اشتراک بگذاریم:
          </Paragraph>
          <List>
            <ListItem>رستوران‌ها و فروشندگان شریک: برای پردازش و تحویل سفارش‌های شما</ListItem>
            <ListItem>شرکت‌های تحویل: برای تحویل سفارش‌های شما به آدرس تعیین شده</ListItem>
            <ListItem>شرکای خدمات پرداخت: برای پردازش پرداخت‌های شما</ListItem>
            <ListItem>ارائه‌دهندگان خدمات: شرکت‌هایی که به ما کمک می‌کنند خدمات خود را ارائه دهیم (مانند میزبانی وب، تجزیه و تحلیل، خدمات مشتری)</ListItem>
            <ListItem>مراجع قانونی: در صورت نیاز توسط قانون یا در پاسخ به درخواست‌های قانونی</ListItem>
          </List>
          <Paragraph>
            ما اطلاعات شخصی شما را بدون اجازه شما به شرکت‌های دیگر برای اهداف بازاریابی نمی‌فروشیم یا اجاره نمی‌دهیم.
          </Paragraph>
        </SectionContent>
      </SectionContainer>
      
      <SectionContainer>
        <SectionTitle>امنیت داده‌ها</SectionTitle>
        <SectionContent>
          <Paragraph>
            ما اقدامات امنیتی مناسبی را برای محافظت از اطلاعات شخصی شما در برابر دسترسی، افشا، تغییر یا تخریب غیرمجاز انجام می‌دهیم. این اقدامات شامل رمزگذاری داده‌ها، دیوارهای آتش و سیستم‌های امنیتی فیزیکی است.
          </Paragraph>
          <Paragraph>
            با این حال، هیچ روش انتقال اینترنتی یا ذخیره‌سازی الکترونیکی 100٪ امن نیست. در حالی که ما تلاش می‌کنیم از روش‌های قابل قبول تجاری برای محافظت از اطلاعات شخصی شما استفاده کنیم، نمی‌توانیم امنیت مطلق آن را تضمین کنیم.
          </Paragraph>
        </SectionContent>
      </SectionContainer>
      
      <SectionContainer>
        <SectionTitle>حقوق حریم خصوصی شما</SectionTitle>
        <SectionContent>
          <Paragraph>
            بسته به قوانین حاکم بر حوزه قضایی شما، ممکن است حقوق خاصی در رابطه با اطلاعات شخصی خود داشته باشید، از جمله:
          </Paragraph>
          <List>
            <ListItem>دسترسی به اطلاعات شخصی که درباره شما داریم</ListItem>
            <ListItem>اصلاح یا به‌روزرسانی اطلاعات نادرست یا ناقص</ListItem>
            <ListItem>حذف داده‌های شخصی شما در شرایط خاص</ListItem>
            <ListItem>محدود کردن یا مخالفت با پردازش داده‌های شما</ListItem>
            <ListItem>دریافت داده‌های خود در قالب قابل استفاده و انتقال آنها به سرویس دیگر</ListItem>
            <ListItem>لغو رضایت قبلی خود در هر زمان</ListItem>
          </List>
          <Paragraph>
            برای اعمال هر یک از این حقوق، لطفاً از طریق اطلاعات تماس در انتهای این سیاست با ما تماس بگیرید.
          </Paragraph>
        </SectionContent>
      </SectionContainer>
      
      <SectionContainer>
        <SectionTitle>کوکی‌ها و فناوری‌های مشابه</SectionTitle>
        <SectionContent>
          <Paragraph>
            ما از کوکی‌ها و فناوری‌های مشابه برای جمع‌آوری و ذخیره اطلاعات هنگام استفاده از خدمات ما استفاده می‌کنیم. کوکی‌ها فایل‌های متنی کوچکی هستند که در دستگاه شما ذخیره می‌شوند و به ما امکان می‌دهند تا تجربه کاربری بهتری ارائه دهیم، ترجیحات شما را به یاد داشته باشیم و خدمات خود را بهبود بخشیم.
          </Paragraph>
          <Paragraph>
            شما می‌توانید مرورگر خود را طوری تنظیم کنید که همه کوکی‌ها را رد کند یا زمانی که یک کوکی ارسال می‌شود به شما اطلاع دهد. با این حال، اگر کوکی‌ها را قبول نکنید، ممکن است نتوانید از بعضی از خدمات ما استفاده کنید.
          </Paragraph>
        </SectionContent>
      </SectionContainer>
      
      <SectionContainer>
        <SectionTitle>تغییرات در سیاست حریم خصوصی</SectionTitle>
        <SectionContent>
          <Paragraph>
            ما ممکن است این سیاست حریم خصوصی را از زمان به زمان به‌روزرسانی کنیم. هرگونه تغییر با انتشار نسخه به‌روزرسانی شده در این صفحه اعمال خواهد شد. در صورت انجام تغییرات قابل توجه، اطلاعیه‌ای را در وب‌سایت یا از طریق ایمیل به شما ارسال خواهیم کرد.
          </Paragraph>
          <Paragraph>
            ما به شما توصیه می‌کنیم که این صفحه را مرتباً بررسی کنید تا از آخرین تغییرات مطلع شوید. استفاده مداوم شما از خدمات ما پس از انتشار هرگونه تغییر در این سیاست حریم خصوصی به معنای پذیرش تغییرات جدید است.
          </Paragraph>
        </SectionContent>
      </SectionContainer>
      
      <SectionContainer>
        <SectionTitle>تماس با ما</SectionTitle>
        <SectionContent>
          <Paragraph>
            اگر سوال یا نگرانی در مورد این سیاست حریم خصوصی یا شیوه‌های حریم خصوصی ما دارید، لطفاً با ما تماس بگیرید:
          </Paragraph>
          <Paragraph>
            آدرس ایمیل: privacy@foodino.com<br />
            شماره تلفن: 021-12345678<br />
            آدرس پستی: تهران، خیابان ولیعصر، پلاک 123
          </Paragraph>
          <BackButton href="/">بازگشت به صفحه اصلی</BackButton>
        </SectionContent>
      </SectionContainer>
    </PageContainer>
  );
};

export default PrivacyPage; 