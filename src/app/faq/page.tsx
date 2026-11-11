"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDownIcon, SearchIcon } from '@/components/ui/FoodVisuals';

const FAQPageContainer = styled.div`
  max-width: 980px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4.5rem;
  direction: rtl;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2.25rem;
`;

const PageTitle = styled.h1`
  font-size: clamp(1.65rem, 3vw, 2.25rem);
  font-weight: 900;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.5rem;
`;

const PageDescription = styled.p`
  font-size: 0.98rem;
  color: ${props => props.theme.colors.neutral[500]};
  max-width: 680px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.9rem 1.15rem 0.9rem 2.85rem;
  font-size: 0.95rem;
  border: 1.5px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  background-color: #ffffff;
  color: ${props => props.theme.colors.neutral[900]};
  box-shadow: ${props => props.theme.shadows.xs};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const SearchIconWrap = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.neutral[400]};
  display: inline-flex;
  pointer-events: none;
`;

const CategoriesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 2.25rem;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button<{ $active: boolean }>`
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  border: 1px solid ${props => (props.$active ? props.theme.colors.primary[500] : props.theme.colors.neutral[200])};
  background-color: ${props => (props.$active ? props.theme.colors.primary[500] : '#ffffff')};
  color: ${props => (props.$active ? '#ffffff' : props.theme.colors.neutral[700])};
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const FAQSection = styled.div`
  margin-bottom: 2.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FAQItem = styled.div`
  background-color: #ffffff;
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.xs};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
`;

const FAQQuestion = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 1.15rem 1.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  background-color: ${props => (props.$isOpen ? props.theme.colors.primary[50] : '#ffffff')};
  border: none;
  border-bottom: ${props => (props.$isOpen ? `1px solid ${props.theme.colors.primary[100]}` : 'none')};
  text-align: right;
  font-family: inherit;
  transition: all 0.2s;
`;

const QuestionText = styled.h3<{ $isOpen: boolean }>`
  font-size: 0.98rem;
  font-weight: 800;
  color: ${props => (props.$isOpen ? props.theme.colors.primary[600] : props.theme.colors.neutral[900])};
  margin: 0;
`;

const ToggleIcon = styled.span<{ $isOpen: boolean }>`
  display: inline-flex;
  transition: transform 0.25s ease;
  transform: ${props => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  color: ${props => (props.$isOpen ? props.theme.colors.primary[500] : props.theme.colors.neutral[400])};
`;

const FAQAnswer = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => (props.$isOpen ? '500px' : '0')};
  overflow: hidden;
  padding: ${props => (props.$isOpen ? '1.15rem 1.35rem' : '0 1.35rem')};
  transition: all 0.25s ease-in-out;
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  font-size: 0.92rem;
  color: ${props => props.theme.colors.neutral[600]};
  line-height: 1.8;
`;

interface FAQItemType {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItemType[] = [
  {
    id: '1',
    question: 'چگونه سفارش غذا بدهم؟',
    answer: 'برای سفارش غذا، ابتدا وارد سایت فودینو شوید. رستوران مورد نظر خود را جستجو یا از میان دسته‌بندی‌ها انتخاب کنید. منوی رستوران را مشاهده کرده و غذای مورد نظر را به سبد خرید اضافه کنید. سپس آدرس خود را انتخاب کرده و سفارش را نهایی نمایید.',
    category: 'سفارش'
  },
  {
    id: '2',
    question: 'چقدر طول می‌کشد تا سفارش من برسد؟',
    answer: 'زمان تقریبی ارسال را روی کارت رستوران ببینید.',
    category: 'تحویل'
  },
  {
    id: '3',
    question: 'از کجا وضعیت سفارشم را ببینم؟',
    answer: 'از حساب کاربری سفارش را باز کنید یا در صفحهٔ «پیگیری سفارش» کد رهگیری را وارد کنید.',
    category: 'سفارش'
  },
  {
    id: '4',
    question: 'چگونه می‌توانم از کد تخفیف استفاده کنم؟',
    answer: 'در سبد خرید، کد تخفیف را وارد کنید و «اعمال» را بزنید.',
    category: 'پرداخت'
  },
  {
    id: '5',
    question: 'از کجا جزئیات سفارشم را ببینم؟',
    answer: 'در حساب کاربری، سفارش را باز کنید تا غذاها، نشانی، مبلغ و وضعیت آن را ببینید.',
    category: 'سفارش'
  },
  {
    id: '6',
    question: 'هزینه ارسال چگونه محاسبه می‌شود؟',
    answer: 'هزینه ارسال بر اساس تعرفه هر رستوران محاسبه و به صورت شفاف پیش از پرداخت نمایش داده می‌شود.',
    category: 'پرداخت'
  },
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('همه');
  const [openItemId, setOpenItemId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['همه', 'سفارش', 'تحویل', 'پرداخت'];

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'همه' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedFAQs = filteredFAQs.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
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
          پاسخ سوالات رایج درباره نحوه سفارش، کدهای تخفیف، پرداخت امن و رهگیری لحظه‌ای فودینو
        </PageDescription>
      </PageHeader>

      <SearchContainer>
        <SearchInput
          placeholder="جستجو در سوالات متداول..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIconWrap>
          <SearchIcon size={18} />
        </SearchIconWrap>
      </SearchContainer>

      <CategoriesContainer>
        {categories.map(category => (
          <CategoryButton
            key={category}
            type="button"
            $active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            data-active={activeCategory === category}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoriesContainer>

      <div>
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
                    <ToggleIcon $isOpen={openItemId === item.id}>
                      <ChevronDownIcon size={18} />
                    </ToggleIcon>
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
          <div style={{ textAlign: 'center', margin: '3rem 0', color: '#6E6055' }}>
            <SearchIcon size={36} />
            <h3 style={{ color: '#16120F', marginTop: '0.75rem' }}>نتیجه‌ای یافت نشد</h3>
            <p>عبارت دیگری را جست‌وجو کنید یا دستهٔ دیگری را انتخاب کنید.</p>
          </div>
        )}
      </div>
    </FAQPageContainer>
  );
};

export default FAQPage;
