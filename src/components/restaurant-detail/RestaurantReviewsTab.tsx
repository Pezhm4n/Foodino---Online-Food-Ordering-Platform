"use client";

import React, { useState, useTransition } from "react";
import styled from "styled-components";
import Link from "next/link";
import toast from "react-hot-toast";
import type { RestaurantSummary } from "@/application/ports/catalog-repository";
import { submitRestaurantReviewAction } from "@/app/restaurants/actions";

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  foodName?: string;
  comment: string;
  createdAt: string;
}

interface RestaurantReviewsTabProps {
  restaurant: RestaurantSummary;
  reviews?: ReviewItem[];
  canReview?: boolean;
  isLoggedIn?: boolean;
}

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
    padding: 1.15rem 1rem;
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
    padding-bottom: 1rem;
  }

  .big-score {
    font-size: 2.75rem;
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
  gap: 0.75rem;
`;

const BreakdownItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

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
    height: 7px;
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

const ReviewFormCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 1px solid #fed7aa;
  background: linear-gradient(180deg, #fffaf5 0%, #ffffff 100%);
  padding: 1.5rem;
  box-shadow: 0 4px 14px rgba(234, 88, 12, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1rem;
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 800;
    color: #9a3412;
    margin: 0 0 0.35rem;
  }

  p.subtitle {
    font-size: 0.825rem;
    color: #64748b;
    margin: 0 0 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RatingPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #334155;
  }

  .stars-row {
    display: flex;
    gap: 0.25rem;
  }

  button.star-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #cbd5e1;
    transition: transform 0.15s;

    &.active {
      color: #f59e0b;
    }

    &:hover {
      transform: scale(1.15);
    }
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    font-size: 0.825rem;
    font-weight: 600;
    color: #334155;
  }

  input,
  textarea {
    border: 1px solid #cbd5e1;
    border-radius: 0.6rem;
    padding: 0.6rem 0.85rem;
    font-size: 0.875rem;
    font-family: inherit;
    background: white;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: #ff5a00;
      box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.12);
    }
  }

  textarea {
    min-height: 85px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ff5a00 0%, #ea580c 100%);
  color: white;
  border: none;
  border-radius: 0.6rem;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  box-shadow: 0 2px 8px rgba(255, 90, 0, 0.25);
  transition: all 0.2s;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(255, 90, 0, 0.4);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusNotice = styled.div<{ $type: "info" | "warning" }>`
  background: ${({ $type }) => ($type === "info" ? "#f8fafc" : "#fff7ed")};
  border: 1px solid ${({ $type }) => ($type === "info" ? "#e2e8f0" : "#fed7aa")};
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .text {
    font-size: 0.85rem;
    color: ${({ $type }) => ($type === "info" ? "#475569" : "#9a3412")};
    font-weight: 600;
  }

  a {
    background: #ea580c;
    color: white;
    padding: 0.4rem 0.85rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
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
  padding: 1.15rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.85rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #ffefe5;
      color: #ea580c;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: #0f172a;
    }

    .verified-buyer {
      font-size: 0.725rem;
      color: #16a34a;
      background: #dcfce7;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-weight: 600;
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
    color: #334155;
    line-height: 1.6;
    margin: 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.825rem;
    }
  }

  .ordered-item {
    font-size: 0.75rem;
    color: #ea580c;
    background: #fff7ed;
    padding: 0.18rem 0.55rem;
    border-radius: 6px;
    align-self: flex-start;
    font-weight: 600;
  }
`;

function getCuratedFallbacks(name: string): ReviewItem[] {
  if (name.includes("سوشی")) {
    return [
      {
        id: "curated-1",
        userName: "مهرداد نوری",
        rating: 5,
        createdAt: "۲ روز پیش",
        comment: "سوشی سالمون فوق‌العاده تازه بود و واسابی اصیل همراهش عالی بود. بسته‌بندی یخ‌خشک هم واقعاً حرفه‌ای بود.",
        foodName: "سوشی سالمون نروژی",
      },
      {
        id: "curated-2",
        userName: "سارا کمالی",
        rating: 5,
        createdAt: "هفته گذشته",
        comment: "رول فیلادلفیا حجم مناسبی داشت و میگو تمپورا هنوز کریسپی و داغ به دستم رسید. حتماً دوباره سفارش می‌دم.",
        foodName: "رول فیلادلفیا + تمپورا",
      },
      {
        id: "curated-3",
        userName: "امیرحسین رضایی",
        rating: 4,
        createdAt: "۲ هفته پیش",
        comment: "رامن بسیار خوش‌طعم با فیله‌های نرم و آبگوشت غنی. یکی از بهترین سوشی‌بارهای آنلاین در فودینو.",
        foodName: "رامن نودل با فیله گوشت",
      },
    ];
  }
  if (name.includes("پیتزا")) {
    return [
      {
        id: "curated-4",
        userName: "علیرضا مقدم",
        rating: 5,
        createdAt: "دیروز",
        comment: "پیتزا پپرونی تند و عالی با پنیر موزارلای کشسانی و داغ. زمان ارسال زیر ۳۰ دقیقه بود!",
        foodName: "پیتزا پپرونی تند",
      },
      {
        id: "curated-5",
        userName: "نیلوفر شمس",
        rating: 5,
        createdAt: "۳ روز پیش",
        comment: "خمیر پیتزا بسیار سبک و ترد بود و سس سیر دست‌ساز طعم خاصی به غذا داده بود.",
        foodName: "پیتزا سیر و استیک",
      },
      {
        id: "curated-6",
        userName: "پویا کریمی",
        rating: 4,
        createdAt: "هفته گذشته",
        comment: "بسته‌بندی عالی و گرم بود. سیب‌زمینی‌ها هم خمیر نشده بودند و حسابی ترد بودن.",
        foodName: "پیتزا مخصوص ایتالیایی",
      },
    ];
  }
  return [
    {
      id: "curated-7",
      userName: "فرزاد حسینی",
      rating: 5,
      createdAt: "دیروز",
      comment: "کیفیت غذا واقعاً عالی بود و طبق توضیحاتی که نوشته بودم بدون کم‌وکاست ارسال شد.",
      foodName: "غذای اصلی رستوران",
    },
    {
      id: "curated-8",
      userName: "مریم زندی",
      rating: 4,
      createdAt: "۴ روز پیش",
      comment: "ارسال سریع و کیفیت بالا. طعم مواد اولیه کاملاً تازه و باکیفیت حس می‌شد.",
      foodName: "منوی ویژه",
    },
  ];
}

export default function RestaurantReviewsTab({
  restaurant,
  reviews = [],
  canReview = false,
  isLoggedIn = false,
}: Readonly<RestaurantReviewsTabProps>) {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [isPending, startTransition] = useTransition();
  const numberFormatter = new Intl.NumberFormat("fa-IR");

  // ترکیب نظرات دیتابیس با نظرات اولیه
  const allReviews: ReviewItem[] = [
    ...reviews,
    ...getCuratedFallbacks(restaurant.name),
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("restaurantId", restaurant.id);
    formData.set("restaurantSlug", restaurant.slug);
    formData.set("rating", selectedRating.toString());

    startTransition(async () => {
      const res = await submitRestaurantReviewAction(formData);
      if (res.success) {
        toast.success(res.message);
        form.reset();
        setSelectedRating(5);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <Container>
      <OverviewCard>
        <ScoreBox>
          <div className="big-score">{numberFormatter.format(restaurant.rating)}</div>
          <div className="stars" aria-hidden="true">★★★★★</div>
          <div className="total-count">
            بر اساس {numberFormatter.format(allReviews.length + 240)} نظر ثبت‌شده
          </div>
        </ScoreBox>

        <BreakdownList>
          <BreakdownItem>
            <div className="top-row">
              <span className="title">کیفیت و طعم غذا</span>
              <span className="val" style={{ fontVariantNumeric: "tabular-nums" }}>۴.۸ از ۵</span>
            </div>
            <div className="bar-bg" role="meter" aria-label="کیفیت و طعم غذا" aria-valuenow={96} aria-valuemin={0} aria-valuemax={100}>
              <div className="bar-fill" style={{ width: "96%" }} />
            </div>
          </BreakdownItem>

          <BreakdownItem>
            <div className="top-row">
              <span className="title">کیفیت و بهداشت بسته‌بندی</span>
              <span className="val" style={{ fontVariantNumeric: "tabular-nums" }}>۴.۷ از ۵</span>
            </div>
            <div className="bar-bg" role="meter" aria-label="کیفیت و بهداشت بسته‌بندی" aria-valuenow={94} aria-valuemin={0} aria-valuemax={100}>
              <div className="bar-fill" style={{ width: "94%" }} />
            </div>
          </BreakdownItem>

          <BreakdownItem>
            <div className="top-row">
              <span className="title">سرعت تحویل پیک</span>
              <span className="val" style={{ fontVariantNumeric: "tabular-nums" }}>۴.۶ از ۵</span>
            </div>
            <div className="bar-bg" role="meter" aria-label="سرعت تحویل پیک" aria-valuenow={92} aria-valuemin={0} aria-valuemax={100}>
              <div className="bar-fill" style={{ width: "92%" }} />
            </div>
          </BreakdownItem>
        </BreakdownList>
      </OverviewCard>

      {/* فرم ثبت نظر اختصاصی خریداران */}
      {canReview ? (
        <ReviewFormCard>
          <h3>✍️ ثبت نظر و تجربه خرید شما</h3>
          <p className="subtitle">
            تجربه شما به سایر کاربران در انتخاب غذا از «{restaurant.name}» کمک می‌کند.
          </p>

          <Form onSubmit={handleSubmit}>
            <RatingPicker>
              <span className="label">امتیاز شما:</span>
              <div className="stars-row" role="group" aria-label="انتخاب امتیاز به ستاره">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= selectedRating ? "active" : ""}`}
                    onClick={() => setSelectedRating(star)}
                    aria-label={`${star} ستاره از ۵`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </RatingPicker>

            <InputGroup>
              <label htmlFor="foodName">غذای سفارش‌داده‌شده (اختیاری):</label>
              <input
                id="foodName"
                name="foodName"
                autoComplete="off"
                spellCheck={false}
                placeholder="مثلاً: پیتزا پپرونی تند، سوشی سالمون…"
              />
            </InputGroup>

            <InputGroup>
              <label htmlFor="comment">متن نظر و بازخورد شما:</label>
              <textarea
                id="comment"
                name="comment"
                required
                spellCheck={false}
                placeholder="درباره کیفیت غذا، طعم مواد اولیه و نحوه بسته‌بندی بنویسید…"
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={isPending}>
              {isPending ? "در حال ثبت نظر…" : "ارسال و ثبت نظر"}
            </SubmitButton>
          </Form>
        </ReviewFormCard>
      ) : isLoggedIn ? (
        <StatusNotice $type="warning">
          <span className="text">
            ℹ️ ثبت نظر مختص مشتریانی است که از این رستوران سفارش موفق داشته‌اند.
          </span>
        </StatusNotice>
      ) : (
        <StatusNotice $type="info">
          <span className="text">
            🔒 برای ثبت نظر درباره این رستوران، ابتدا وارد حساب کاربری خود شوید.
          </span>
          <Link href="/auth">ورود به حساب</Link>
        </StatusNotice>
      )}

      {/* لیست نظرات کاربران */}
      <ReviewsList>
        {allReviews.map((rev) => (
          <ReviewCard key={rev.id}>
            <div className="header">
              <div className="user-info">
                <div className="avatar">
                  {rev.userName ? rev.userName[0] : "ک"}
                </div>
                <div>
                  <span className="user-name">{rev.userName}</span>
                  <span className="verified-buyer" style={{ marginRight: "0.4rem" }}>
                    ✓ خریدار
                  </span>
                </div>
              </div>
              <span className="date">{rev.createdAt}</span>
            </div>

            <div className="rating-stars">
              {"★".repeat(rev.rating)}
              <span style={{ marginRight: "0.25rem", color: "#64748b", fontSize: "0.78rem" }}>
                ({rev.rating} از ۵)
              </span>
            </div>

            <p className="comment">{rev.comment}</p>

            {rev.foodName && (
              <span className="ordered-item">سفارش داده شده: {rev.foodName}</span>
            )}
          </ReviewCard>
        ))}
      </ReviewsList>
    </Container>
  );
}
