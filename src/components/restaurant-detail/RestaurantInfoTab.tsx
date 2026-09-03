"use client";

import React from "react";
import styled from "styled-components";
import type { RestaurantSummary } from "@/application/ports/catalog-repository";
import { irrToToman } from "@/domain/money/money";

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
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.15rem 1rem;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  gap: 0.75rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .label {
    color: #64748b;
    flex-shrink: 0;
  }

  .value {
    color: #1e293b;
    font-weight: 600;
    text-align: left;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.825rem;
    padding-bottom: 0.6rem;
    gap: 0.5rem;

    .label {
      font-size: 0.8rem;
    }
    .value {
      font-size: 0.825rem;
    }
  }
`;

const HoursPill = styled.span`
  background: #dcfce7;
  color: #15803d;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.8rem;
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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.85rem;
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;

  .icon {
    font-size: 1.35rem;
  }

  .title {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.15rem;
  }

  .desc {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.4;
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
          <span>⏱️</span>
          <span>ساعت کاری و زمان‌بندی سفارش</span>
        </h3>

        <Row>
          <span className="label">وضعیت سرویس‌دهی:</span>
          <HoursPill>هم‌اکنون فعال و باز است</HoursPill>
        </Row>
        <Row>
          <span className="label">ساعت کاری ناهار و شام:</span>
          <span className="value">همه‌روزه از ۱۱:۳۰ الی ۲۳:۴۵</span>
        </Row>
        <Row>
          <span className="label">میانگین زمان آماده‌سازی و ارسال:</span>
          <span className="value">
            {numberFormatter.format(restaurant.deliveryMinutes.min)} تا{" "}
            {numberFormatter.format(restaurant.deliveryMinutes.max)} دقیقه
          </span>
        </Row>
        <Row>
          <span className="label">حداقل مبلغ سفارش:</span>
          <span className="value">{numberFormatter.format(minOrderToman)} تومان</span>
        </Row>
        <Row>
          <span className="label">هزینه ارسال پیک:</span>
          <span className="value">
            {feeToman === 0 ? "رایگان" : `${numberFormatter.format(feeToman)} تومان`}
          </span>
        </Row>
      </InfoCard>

      <InfoCard>
        <h3>
          <span>📍</span>
          <span>موقعیت و محدوده سرویس‌دهی</span>
        </h3>

        <Row>
          <span className="label">آدرس شعبه مرکزی:</span>
          <span className="value">تهران، محدوده سرویس‌دهی اکسپرس فودینو</span>
        </Row>
        <Row>
          <span className="label">شیوه‌های پرداخت مورد پذیرش:</span>
          <span className="value">درگاه پرداخت شتاب، کارت بانکی، کیف‌پول</span>
        </Row>
        <Row>
          <span className="label">پشتیبانی سفارش:</span>
          <span className="value">پشتیبانی تلفنی و آنلاین ۲۴ ساعته</span>
        </Row>

        <FeatureGrid>
          <FeatureBox>
            <span className="icon">🛡️</span>
            <div>
              <div className="title">ضمانت سلامت غذا</div>
              <div className="desc">تضمین پخت بهداشتی با مواد اولیه تازه و درجه یک روز</div>
            </div>
          </FeatureBox>

          <FeatureBox>
            <span className="icon">🛵</span>
            <div>
              <div className="title">باکس گرم‌نگهدارنده</div>
              <div className="desc">تحویل غذا با دمای مطبوع و بسته‌بندی حرارتی ضدعفونی</div>
            </div>
          </FeatureBox>
        </FeatureGrid>
      </InfoCard>
    </Container>
  );
}
