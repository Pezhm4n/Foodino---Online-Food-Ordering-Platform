"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import type { RestaurantSummary } from "@/application/ports/catalog-repository";
import { irrToToman } from "@/domain/money/money";
import {
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CourierIcon,
} from "@/components/ui/FoodVisuals";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  direction: rtl;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoCard = styled.div`
  background: #ffffff;
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 1.5rem;
  box-shadow: 0 4px 14px -4px rgba(22, 18, 15, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    font-size: 1.08rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: ${({ theme }) => theme.colors.primary[500]};
    }
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  gap: 0.75rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .label {
    color: ${({ theme }) => theme.colors.neutral[600]};
    flex-shrink: 0;
  }

  .value {
    color: ${({ theme }) => theme.colors.neutral[900]};
    font-weight: 700;
    text-align: left;
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const HoursPill = styled.span`
  background: ${({ theme }) => theme.colors.neutral[50]};
  color: ${({ theme }) => theme.colors.neutral[700]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureBox = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.85rem;
  padding: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;

  .icon {
    color: ${({ theme }) => theme.colors.primary[600]};
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  .title {
    font-size: 0.85rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin-bottom: 0.15rem;
  }

  .desc {
    font-size: 0.76rem;
    color: ${({ theme }) => theme.colors.neutral[600]};
    line-height: 1.5;
  }
`;

export default function RestaurantInfoTab({
  restaurant,
}: Readonly<{ restaurant: RestaurantSummary }>) {
  const numberFormatter = new Intl.NumberFormat("fa-IR");
  const feeToman = irrToToman(restaurant.deliveryFee);
  const minOrderToman = irrToToman(restaurant.minimumOrder);

  return (
    <Container>
      <InfoCard>
        <h3>
          <ClockIcon size={19} />
          <span>زمان‌بندی و هزینهٔ سفارش</span>
        </h3>

        <Row>
          <span className="label">ساعت کاری:</span>
          <HoursPill>اعلام نشده</HoursPill>
        </Row>
        <Row>
          <span className="label">زمان تقریبی ارسال:</span>
          <span className="value">
            {numberFormatter.format(restaurant.deliveryMinutes.min)} تا{" "}
            {numberFormatter.format(restaurant.deliveryMinutes.max)} دقیقه
          </span>
        </Row>
        <Row>
          <span className="label">حداقل مبلغ سفارش:</span>
          <span className="value">
            {numberFormatter.format(minOrderToman)} تومان
          </span>
        </Row>
        <Row>
          <span className="label">هزینه ارسال پیک:</span>
          <span className="value">
            {feeToman === 0
              ? "رایگان"
              : `${numberFormatter.format(feeToman)} تومان`}
          </span>
        </Row>
      </InfoCard>

      <InfoCard>
        <h3>
          <MapPinIcon size={19} />
          <span>اطلاعات رستوران و ارسال</span>
        </h3>

        <Row>
          <span className="label">نشانی رستوران:</span>
          <span className="value">اعلام نشده</span>
        </Row>
        <Row>
          <span className="label">هزینهٔ نهایی:</span>
          <span className="value">در مرحلهٔ پرداخت</span>
        </Row>
        <Row>
          <span className="label">پیگیری سفارش:</span>
          <span className="value"><Link href="/order-tracking">پیگیری با کد سفارش</Link></span>
        </Row>

        <FeatureGrid>
          <FeatureBox>
            <span className="icon">
              <ShieldCheckIcon size={20} />
            </span>
            <div>
              <div className="title">جزئیات غذا در منو</div>
              <div className="desc">
                قیمت و توضیح هر غذا را در منوی رستوران ببینید.
              </div>
            </div>
          </FeatureBox>

          <FeatureBox>
            <span className="icon">
              <CourierIcon size={20} />
            </span>
            <div>
              <div className="title">پیگیری تا تحویل</div>
              <div className="desc">
                وضعیت آماده‌سازی و ارسال را بعد از ثبت سفارش ببینید.
              </div>
            </div>
          </FeatureBox>
        </FeatureGrid>
      </InfoCard>
    </Container>
  );
}
