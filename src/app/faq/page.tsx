"use client";

import React, { useState } from 'react';
import styled from 'styled-components';

const FAQPageContainer = styled.div`
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

const PageDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[500]};
  max-width: 800px;
  margin: 0 auto;
`;

const CategoriesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: none;
  background-color: ${props => props.$active ? props.theme.colors.primary[500] : 'white'};
  color: ${props => props.$active ? 'white' : props.theme.colors.neutral[700]};
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.$active ? props.theme.typography.fontWeights.medium : props.theme.typography.fontWeights.normal};
  cursor: pointer;
  box-shadow: ${props => props.theme.boxShadow.sm};
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.boxShadow.md};
  }
`;

const FAQSectionsContainer = styled.div`
  margin-top: 3rem;
`;

const FAQSection = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[100]};
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const FAQQuestion = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${props => props.$isOpen ? '#fff7ed' : 'white'};
  border: none;
  border-bottom: ${props => props.$isOpen 
    ? `1px solid #fed7aa` 
    : 'none'};
  text-align: right;
  font-family: inherit;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$isOpen ? '#ffedd5' : props.theme.colors.neutral[50]};
  }
`;

const QuestionText = styled.h3<{ $isOpen: boolean }>`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.$isOpen 
    ? props.theme.typography.fontWeights.bold 
    : props.theme.typography.fontWeights.medium};
  color: ${props => props.$isOpen 
    ? props.theme.colors.primary[600] 
    : props.theme.colors.neutral[900]};
  margin: 0;
`;

const ToggleIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 1.1rem;
  transition: transform 0.3s;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  color: ${props => props.$isOpen ? props.theme.colors.primary[500] : props.theme.colors.neutral[400]};
`;

const FAQAnswer = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  overflow: hidden;
  padding: ${props => props.$isOpen ? '1.25rem 1.5rem' : '0 1.5rem'};
  transition: all 0.3s ease-in-out;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[700]};
  line-height: 1.7;
`;

const SearchContainer = styled.div`
  margin-bottom: 3rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: ${props => props.theme.typography.fontSizes.md};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: white;
  box-shadow: ${props => props.theme.boxShadow.sm};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[400] + '30'};
  }
`;

// تعریف انواع داده
interface FAQItemType {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// داده‌های نمونه
const faqData: FAQItemType[] = [
  {
    id: '1',
    question: 'چگونه سفارش غذا بدهم؟',
    answer: 'برای سفارش غذا، ابتدا وارد سایت یا اپلیکیشن فودینو شوید. رستوران مورد نظر خود را جستجو کنید یا از میان رستوران‌های پیشنهادی انتخاب کنید. منوی رستوران را مشاهده کرده و غذای مورد نظر خود را به سبد خرید اضافه کنید. سپس آدرس خود را وارد کرده و روش پرداخت را انتخاب کنید. با تأیید نهایی، سفارش شما ثبت خواهد شد.',
    category: 'سفارش'
  },
  {
    id: '2',
    question: 'چقدر طول می‌کشد تا سفارش من برسد؟',
    answer: 'زمان تحویل سفارش به عوامل مختلفی مانند فاصله شما از رستوران، ترافیک، شرایط آب و هوایی و حجم سفارشات رستوران بستگی دارد. معمولاً زمان تخمینی تحویل هنگام ثبت سفارش به شما نمایش داده می‌شود. میانگین زمان تحویل بین ۳۰ تا ۶۰ دقیقه است.',
    category: 'تحویل'
  },
  {
    id: '3',
    question: 'آیا می‌توانم سفارش خود را پیگیری کنم؟',
    answer: 'بله، پس از ثبت سفارش، می‌توانید از طریق بخش "پیگیری سفارش" در حساب کاربری خود، وضعیت فعلی سفارش را مشاهده کنید. همچنین پیامک‌هایی برای اطلاع‌رسانی از مراحل مختلف سفارش برای شما ارسال می‌شود.',
    category: 'سفارش'
  },
  {
    id: '4',
    question: 'چگونه می‌توانم سفارش خود را لغو کنم؟',
    answer: 'برای لغو سفارش، باید در اسرع وقت با پشتیبانی فودینو تماس بگیرید. توجه داشته باشید که امکان لغو سفارش فقط قبل از شروع آماده‌سازی غذا توسط رستوران وجود دارد. پس از شروع آماده‌سازی، امکان لغو سفارش وجود ندارد.',
    category: 'سفارش'
  },
  {
    id: '5',
    question: 'آیا امکان پرداخت نقدی وجود دارد؟',
    answer: 'بله، فودینو هر دو روش پرداخت آنلاین و پرداخت در محل (نقدی) را پشتیبانی می‌کند. هنگام ثبت سفارش می‌توانید روش پرداخت مورد نظر خود را انتخاب کنید.',
    category: 'پرداخت'
  },
  {
    id: '6',
    question: 'اگر با مشکلی در سفارش مواجه شدم، چه کنم؟',
    answer: 'در صورت بروز هرگونه مشکل در سفارش مانند تأخیر طولانی، اشتباه در سفارش یا کیفیت پایین غذا، می‌توانید با پشتیبانی فودینو از طریق شماره ۰۲۱-۱۲۳۴۵۶۷۸ تماس بگیرید یا از طریق بخش "تماس با ما" در اپلیکیشن، مشکل خود را گزارش دهید.',
    category: 'پشتیبانی'
  },
  {
    id: '7',
    question: 'فودینو در چه شهرهایی فعال است؟',
    answer: 'در حال حاضر، فودینو در شهرهای تهران، مشهد، اصفهان، شیراز، تبریز، کرج، اهواز، قم و کرمانشاه فعال است. ما به طور مداوم در حال گسترش خدمات خود به شهرهای بیشتری هستیم.',
    category: 'عمومی'
  },
  {
    id: '8',
    question: 'آیا سفارش گروهی امکان‌پذیر است؟',
    answer: 'بله، فودینو امکان ثبت سفارش گروهی را فراهم می‌کند. برای این کار، کافی است در هنگام ثبت سفارش، تمام غذاهای مورد نظر را به سبد خرید اضافه کنید. برای سفارش‌های گروهی بزرگ، توصیه می‌کنیم از قبل با رستوران هماهنگ کنید.',
    category: 'سفارش'
  },
  {
    id: '9',
    question: 'هزینه ارسال چگونه محاسبه می‌شود؟',
    answer: 'هزینه ارسال بر اساس فاصله شما از رستوران و همچنین سیاست‌های قیمت‌گذاری هر رستوران محاسبه می‌شود. این هزینه پیش از تأیید نهایی سفارش به شما نمایش داده می‌شود. برخی از رستوران‌ها برای سفارش‌های بالای مبلغ مشخص، ارسال رایگان ارائه می‌دهند.',
    category: 'پرداخت'
  },
  {
    id: '10',
    question: 'چگونه می‌توانم نظر خود را درباره یک رستوران ثبت کنم؟',
    answer: 'پس از دریافت و تحویل سفارش، می‌توانید از طریق ایمیل یا اعلان درون برنامه‌ای که برای شما ارسال می‌شود، نظر خود را ثبت کنید. همچنین می‌توانید به صفحه رستوران مراجعه کرده و در بخش نظرات، تجربه خود را به اشتراک بگذارید.',
    category: 'عمومی'
  }
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('همه');
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['همه', 'سفارش', 'تحویل', 'پرداخت', 'پشتیبانی', 'عمومی'];
  
  // فیلتر سوالات بر اساس دسته‌بندی و جستجو
  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'همه' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // گروه‌بندی سوالات بر اساس دسته‌بندی
  const groupedFAQs = filteredFAQs.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItemType[]>);
  
  const toggleItem = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };
  
  return (
    <FAQPageContainer>
      <PageHeader>
        <PageTitle>سوالات متداول</PageTitle>
        <PageDescription>
          پاسخ سوالات رایج درباره خدمات فودینو، نحوه سفارش، پرداخت و تحویل غذا
        </PageDescription>
      </PageHeader>
      
      <SearchContainer>
        <SearchInput 
          placeholder="جستجو در سوالات متداول..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      <CategoriesContainer>
        {categories.map(category => (
          <CategoryButton 
            key={category}
            $active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            data-active={activeCategory === category}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoriesContainer>
      
      <FAQSectionsContainer>
        {Object.entries(groupedFAQs).map(([category, items]) => (
          <FAQSection key={category}>
            <SectionTitle>{category}</SectionTitle>
            <FAQList>
              {items.map(item => (
                <FAQItem key={item.id}>
                  <FAQQuestion 
                    type="button"
                    $isOpen={openItemId === item.id}
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={openItemId === item.id}
                    data-open={openItemId === item.id}
                  >
                    <QuestionText $isOpen={openItemId === item.id}>{item.question}</QuestionText>
                    <ToggleIcon $isOpen={openItemId === item.id}>▼</ToggleIcon>
                  </FAQQuestion>
                  <FAQAnswer $isOpen={openItemId === item.id} data-open={openItemId === item.id}>
                    {item.answer}
                  </FAQAnswer>
                </FAQItem>
              ))}
            </FAQList>
          </FAQSection>
        ))}
        
        {Object.keys(groupedFAQs).length === 0 && (
          <div style={{ textAlign: 'center', margin: '4rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3>نتیجه‌ای یافت نشد</h3>
            <p>لطفاً با معیارهای دیگری جستجو کنید یا با پشتیبانی ما تماس بگیرید.</p>
          </div>
        )}
      </FAQSectionsContainer>
    </FAQPageContainer>
  );
};

export default FAQPage; 