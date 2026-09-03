"use client";

import React from "react";
import styled from "styled-components";
import type { RestaurantSummary } from "@/application/ports/catalog-repository";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  direction: rtl;
`;

const OverviewCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const ScoreBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-left: 1px solid #f1f5f9;
  padding-left: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-left: none;
    padding-left: 0;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 1.25rem;
  }

  .big-score {
    font-size: 3rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1;
    margin-bottom: 0.35rem;
  }

  .stars {
    color: #f59e0b;
    font-size: 1.25rem;
    margin-bottom: 0.35rem;
  }

  .total-count {
    font-size: 0.8rem;
    color: #64748b;
  }
`;

const BreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const BreakdownItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  .top-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;

    .title {
      font-weight: 600;
      color: #334155;
    }
    .val {
      font-weight: 700;
      color: #0f172a;
    }
  }

  .bar-bg {
    height: 8px;
    background: #f1f5f9;
    border-radius: 9999px;
    overflow: hidden;

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b 0%, #ea580c 100%);
      border-radius: 9999px;
    }
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #0f172a;
    }

    .date {
      font-size: 0.75rem;
      color: #94a3b8;
    }
  }

  .rating-stars {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #f59e0b;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .comment {
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.6;
    margin: 0;
  }

  .ordered-item {
    font-size: 0.775rem;
    color: #ea580c;
    background: #fff7ed;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    align-self: flex-start;
    font-weight: 600;
  }
`;

function getSampleReviews(name: string) {
  if (name.includes("سوشی")) {
    return [
      {
        name: "مهرداد نوری",
        rating: "۵.۰",
        date: "۲ روز پیش",
        comment: "سوشی سالمون فوق‌العاده تازه بود و واسابی اصیل همراهش عالی بود. بسته‌بندی یخ‌خشک هم واقعاً حرفه‌ای بود.",
        food: "سوشی سالمون نروژی",
      },
      {
        name: "سارا کمالی",
        rating: "۴.۵",
        date: "هفته گذشته",
        comment: "رول فیلادلفیا حجم مناسبی داشت و میگو تمپورا هنوز کریسپی و داغ به دستم رسید. حتماً دوباره سفارش می‌دم.",
        food: "رول فیلادلفیا + تمپورا",
      },
      {
        name: "امیرحسین رضایی",
        rating: "۵.۰",
        date: "۲ هفته پیش",
        comment: "رامن بسیار خوش‌طعم با فیله‌های نرم و آبگوشت غنی. یکی از بهترین سوشی‌بارهای آنلاین در فودینو.",
        food: "رامن نودل با فیله گوشت",
      },
    ];
  }
  if (name.includes("پیتزا")) {
    return [
      {
        name: "علیرضا مقدم",
        rating: "۵.۰",
        date: "دیروز",
        comment: "پیتزا پپرونی تند و عالی با پنیر موزارلای کشسانی و داغ. زمان ارسال زیر ۳۰ دقیقه بود!",
        food: "پیتزا پپرونی تند + نان سیر",
      },
      {
        name: "نیلوفر شمس",
        rating: "۴.۸",
        date: "۳ روز پیش",
        comment: "خمیر پیتزا بسیار سبک و ترد بود و سس سیر دست‌ساز طعم خاصی به غذا داده بود.",
        food: "پیتزا سیر و استیک",
      },
      {
        name: "پویا کریمی",
        rating: "۵.۰",
        date: "هفته گذشته",
        comment: "بسته‌بندی عالی و گرم بود. سیب‌زمینی‌ها هم خمیر نشده بودند و حسابی ترد بودن.",
        food: "پیتزا مخصوص اسپشیال",
      },
    ];
  }
  return [
    {
      name: "فرزاد حسینی",
      rating: "۵.۰",
      date: "دیروز",
      comment: "کیفیت غذا واقعاً عالی بود و طبق توضیحاتی که نوشته بودم بدون کم‌وکاست ارسال شد.",
      food: "سفارش ثبت‌شده ویژه",
    },
    {
      name: "مریم زندی",
      rating: "۴.۶",
      date: "۴ روز پیش",
      comment: "ارسال سریع و کیفیت بالا. طعم مواد اولیه کاملاً تازه و باکیفیت حس می‌شد.",
      food: "منوی اصلی رستوران",
    },
  ];
}

export default function RestaurantReviewsTab({
  restaurant,
}: Readonly<{ restaurant: RestaurantSummary }>) {
  const reviews = getSampleReviews(restaurant.name);
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  return (
    <Container>
      <OverviewCard>
        <ScoreBox>
          <div className="big-score">{numberFormatter.format(restaurant.rating)}</div>
          <div className="stars">★★★★★</div>
          <div className="total-count">بر اساس ۲۴۵ نظر ثبت‌شده مشتریان</div>
        </ScoreBox>

        <BreakdownList>
          <BreakdownItem>
            <div className="top-row">
              <span className="title">کیفیت و طعم غذا</span>
              <span className="val">۴.۸ از ۵</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: "96%" }} />
            </div>
          </BreakdownItem>

          <BreakdownItem>
            <div className="top-row">
              <span className="title">کیفیت و بهداشت بسته‌بندی</span>
              <span className="val">۴.۷ از ۵</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: "94%" }} />
            </div>
          </BreakdownItem>

          <BreakdownItem>
            <div className="top-row">
              <span className="title">سرعت تحویل پیک</span>
              <span className="val">۴.۶ از ۵</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: "92%" }} />
            </div>
          </BreakdownItem>
        </BreakdownList>
      </OverviewCard>

      <ReviewsList>
        {reviews.map((rev, index) => (
          <ReviewCard key={index}>
            <div className="header">
              <span className="user-name">{rev.name}</span>
              <span className="date">{rev.date}</span>
            </div>
            <div className="rating-stars">
              <span>★</span>
              <span>{rev.rating}</span>
            </div>
            <p className="comment">{rev.comment}</p>
            <span className="ordered-item">سفارش داده شده: {rev.food}</span>
          </ReviewCard>
        ))}
      </ReviewsList>
    </Container>
  );
}
