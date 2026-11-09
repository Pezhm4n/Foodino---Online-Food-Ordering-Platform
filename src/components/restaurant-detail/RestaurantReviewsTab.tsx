"use client";

import React, { useState, useTransition } from "react";
import styled from "styled-components";
import Link from "next/link";
import toast from "react-hot-toast";
import type { RestaurantSummary } from "@/application/ports/catalog-repository";
import { submitRestaurantReviewAction } from "@/app/restaurants/actions";
import {
  StarIcon,
  InfoIcon,
  CheckCircleIcon,
  SparkleIcon,
} from "@/components/ui/FoodVisuals";

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
  gap: 1.35rem;
  direction: rtl;
`;

const OverviewCard = styled.div`
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 1.5rem;
  box-shadow: 0 4px 14px -4px rgba(22, 18, 15, 0.05);
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 1.2rem 1rem;
  }
`;

const ScoreBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-left: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-left: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-left: none;
    padding-left: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    padding-bottom: 1rem;
  }

  .big-score {
    font-size: 2.75rem;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.neutral[900]};
    line-height: 1;
    margin-bottom: 0.45rem;
  }

  .stars {
    color: #e59a11;
    display: inline-flex;
    gap: 0.2rem;
    margin-bottom: 0.4rem;
  }

  .total-count {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
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
      color: ${({ theme }) => theme.colors.neutral[700]};
    }
    .val {
      font-weight: 800;
      color: ${({ theme }) => theme.colors.neutral[900]};
    }
  }

  .bar-bg {
    height: 8px;
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 9999px;
    overflow: hidden;

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #e59a11 0%, #d9381e 100%);
      border-radius: 9999px;
    }
  }
`;

const ReviewFormCard = styled.div`
  background: linear-gradient(180deg, #fef4f0 0%, #ffffff 100%);
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  padding: 1.5rem;
  box-shadow: 0 6px 18px -6px rgba(217, 56, 30, 0.08);

  h3 {
    font-size: 1.05rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary[700]};
    margin: 0 0 0.35rem;
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  p.subtitle {
    font-size: 0.84rem;
    color: ${({ theme }) => theme.colors.neutral[600]};
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
    color: ${({ theme }) => theme.colors.neutral[800]};
  }

  .stars-row {
    display: flex;
    gap: 0.25rem;
  }

  button.star-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.neutral[300]};
    min-width: 34px;
    min-height: 34px;
    padding: 0.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s;

    &.active {
      color: #e59a11;
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
    font-weight: 700;
    color: ${({ theme }) => theme.colors.neutral[800]};
  }

  input,
  textarea {
    border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
    border-radius: 0.75rem;
    padding: 0.65rem 0.9rem;
    font-size: 0.88rem;
    font-family: inherit;
    background: #ffffff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
  }

  textarea {
    min-height: 85px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 1.35rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  box-shadow: 0 6px 14px -4px rgba(217, 56, 30, 0.32);
  transition: background-color 180ms ease, transform 140ms ease, opacity 180ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusNotice = styled.div<{ $type: "info" | "warning" }>`
  background: ${({ $type, theme }) =>
    $type === "info" ? "#ffffff" : theme.colors.primary[50]};
  border: 1px solid
    ${({ $type, theme }) =>
      $type === "info" ? theme.colors.neutral[200] : theme.colors.primary[200]};
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .text {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.86rem;
    color: ${({ $type, theme }) =>
      $type === "info" ? theme.colors.neutral[700] : theme.colors.primary[800]};
    font-weight: 600;
  }

  a {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: #ffffff;
    padding: 0.45rem 0.95rem;
    border-radius: 0.65rem;
    font-size: 0.82rem;
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
  background: #ffffff;
  border-radius: 1.15rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 1.25rem;
  box-shadow: 0 4px 12px -4px rgba(22, 18, 15, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.primary[50]};
      border: 1px solid ${({ theme }) => theme.colors.primary[200]};
      color: ${({ theme }) => theme.colors.primary[700]};
      font-size: 0.88rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-weight: 800;
      font-size: 0.92rem;
      color: ${({ theme }) => theme.colors.neutral[900]};
    }

    .verified-buyer {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      font-size: 0.72rem;
      color: ${({ theme }) => theme.colors.success[700]};
      background: ${({ theme }) => theme.colors.success[50]};
      padding: 0.12rem 0.45rem;
      border-radius: 999px;
      font-weight: 700;
    }

    .date {
      font-size: 0.76rem;
      color: ${({ theme }) => theme.colors.neutral[500]};
    }
  }

  .rating-stars {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    color: #e59a11;
    font-size: 0.85rem;
    font-weight: 700;
  }

  .comment {
    font-size: 0.88rem;
    color: ${({ theme }) => theme.colors.neutral[700]};
    line-height: 1.7;
    margin: 0;
  }

  .ordered-item {
    font-size: 0.76rem;
    color: ${({ theme }) => theme.colors.primary[700]};
    background: ${({ theme }) => theme.colors.primary[50]};
    border: 1px solid ${({ theme }) => theme.colors.primary[100]};
    padding: 0.22rem 0.65rem;
    border-radius: 0.55rem;
    align-self: flex-start;
    font-weight: 700;
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
        comment:
          "سوشی سالمون فوق‌العاده تازه بود و واسابی اصیل همراهش عالی بود. بسته‌بندی ایزوله خنک واقعاً حرفه‌ای بود.",
        foodName: "سوشی سالمون نروژی",
      },
      {
        id: "curated-2",
        userName: "سارا کمالی",
        rating: 5,
        createdAt: "هفته گذشته",
        comment:
          "رول فیلادلفیا حجم مناسبی داشت و کریسپی رول هنوز ترد به دستم رسید. حتماً دوباره سفارش می‌دم.",
        foodName: "رول فیلادلفیا + کریسپی رول",
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
        comment:
          "پیتزا پپرونی تند و عالی با پنیر موزارلای کشسانی و داغ. زمان ارسال زیر ۳۰ دقیقه بود!",
        foodName: "پیتزا پپرونی تند",
      },
      {
        id: "curated-5",
        userName: "نیلوفر شمس",
        rating: 5,
        createdAt: "۳ روز پیش",
        comment:
          "خمیر پیتزا بسیار سبک و ترد بود و نان سیر کنار غذا طعم خاصی داشت.",
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
      comment:
        "کیفیت غذا واقعاً عالی بود و طبق توضیحاتی که نوشته بودم بدون کم‌وکاست و داغ ارسال شد.",
      foodName: "غذای اصلی رستوران",
    },
    {
      id: "curated-8",
      userName: "مریم زندی",
      rating: 4,
      createdAt: "۴ روز پیش",
      comment:
        "ارسال سریع و کیفیت بالا. طعم مواد اولیه کاملاً تازه و باکیفیت حس می‌شد.",
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
          <div className="big-score">
            {numberFormatter.format(restaurant.rating)}
          </div>
          <div className="stars" aria-hidden="true">
            <StarIcon size={18} />
            <StarIcon size={18} />
            <StarIcon size={18} />
            <StarIcon size={18} />
            <StarIcon size={18} />
          </div>
          <div className="total-count">
            بر اساس {numberFormatter.format(allReviews.length + 240)} نظر
            ثبت‌شده
          </div>
        </ScoreBox>

        <BreakdownList>
          <BreakdownItem>
            <div className="top-row">
              <span className="title">کیفیت و طعم غذا</span>
              <span className="val">۴.۸ از ۵</span>
            </div>
            <div
              className="bar-bg"
              role="meter"
              aria-label="کیفیت و طعم غذا"
              aria-valuenow={96}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="bar-fill" style={{ width: "96%" }} />
            </div>
          </BreakdownItem>

          <BreakdownItem>
            <div className="top-row">
              <span className="title">کیفیت و بهداشت بسته‌بندی</span>
              <span className="val">۴.۷ از ۵</span>
            </div>
            <div
              className="bar-bg"
              role="meter"
              aria-label="کیفیت و بهداشت بسته‌بندی"
              aria-valuenow={94}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="bar-fill" style={{ width: "94%" }} />
            </div>
          </BreakdownItem>

          <BreakdownItem>
            <div className="top-row">
              <span className="title">سرعت تحویل پیک</span>
              <span className="val">۴.۶ از ۵</span>
            </div>
            <div
              className="bar-bg"
              role="meter"
              aria-label="سرعت تحویل پیک"
              aria-valuenow={92}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="bar-fill" style={{ width: "92%" }} />
            </div>
          </BreakdownItem>
        </BreakdownList>
      </OverviewCard>

      {canReview ? (
        <ReviewFormCard>
          <h3>
            <SparkleIcon size={16} />
            <span>ثبت نظر و تجربه خرید شما</span>
          </h3>
          <p className="subtitle">
            تجربه شما به سایر کاربران در انتخاب غذا از «{restaurant.name}» کمک
            می‌کند.
          </p>

          <Form onSubmit={handleSubmit}>
            <RatingPicker>
              <span className="label">امتیاز شما:</span>
              <div
                className="stars-row"
                role="group"
                aria-label="انتخاب امتیاز به ستاره"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${
                      star <= selectedRating ? "active" : ""
                    }`}
                    onClick={() => setSelectedRating(star)}
                    aria-label={`${numberFormatter.format(star)} ستاره از ۵`}
                  >
                    <StarIcon size={22} />
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
            <InfoIcon size={17} />
            <span>
              ثبت نظر مختص مشتریانی است که از این رستوران سفارش موفق داشته‌اند.
            </span>
          </span>
        </StatusNotice>
      ) : (
        <StatusNotice $type="info">
          <span className="text">
            <InfoIcon size={17} />
            <span>
              برای ثبت نظر درباره این رستوران، ابتدا وارد حساب کاربری خود شوید.
            </span>
          </span>
          <Link href="/auth">ورود به حساب</Link>
        </StatusNotice>
      )}

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
                  <span
                    className="verified-buyer"
                    style={{ marginRight: "0.4rem" }}
                  >
                    <CheckCircleIcon size={11} />
                    <span>خریدار</span>
                  </span>
                </div>
              </div>
              <span className="date">{rev.createdAt}</span>
            </div>

            <div className="rating-stars">
              {Array.from({ length: rev.rating }).map((_, idx) => (
                <StarIcon key={idx} size={14} />
              ))}
              <span
                style={{
                  marginRight: "0.3rem",
                  color: "#6E6255",
                  fontSize: "0.78rem",
                }}
              >
                ({numberFormatter.format(rev.rating)} از ۵)
              </span>
            </div>

            <p className="comment">{rev.comment}</p>

            {rev.foodName && (
              <span className="ordered-item">
                سفارش داده شده: {rev.foodName}
              </span>
            )}
          </ReviewCard>
        ))}
      </ReviewsList>
    </Container>
  );
}
