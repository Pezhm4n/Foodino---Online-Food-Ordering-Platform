 "use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { getOrderById } from "@/lib/api";
import { Order } from "@/types";
import Loading from "@/components/ui/Loading";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styled from 'styled-components';

const CenteredState = styled.div`
  display: flex; min-height: 50vh; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
`;
const MutedText = styled.p`margin-top: 1rem; color: ${({ theme }) => theme.colors.neutral[600]};`;
const HomeLink = styled(Link)`display: inline-block; margin-top: 1.5rem;`;
const Confirmation = styled.div`max-width: 42rem; margin: 0 auto; padding: 2rem 0;`;
const SuccessBox = styled.section`
  margin-bottom: 2rem; padding: 1.5rem; border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.success[50]}; text-align: center;
`;
const SuccessIcon = styled.svg`
  width: 4rem; height: 4rem; margin: 0 auto 1rem; color: ${({ theme }) => theme.colors.success[500]};
`;
const SuccessText = styled.p`margin-top: 0.5rem; color: ${({ theme }) => theme.colors.neutral[700]};`;
const OrderId = styled.p`margin-top: 0.5rem; font-weight: 500;`;
const SummaryCard = styled.section`
  overflow: hidden; border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;
const SummaryHeader = styled.header`
  padding: 1rem 1.5rem; border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  background: ${({ theme }) => theme.colors.neutral[50]};
`;
const SummaryTitle = styled.h3`margin: 0; font-weight: 500;`;
const SummaryContent = styled.div`padding: 1.5rem;`;
const ItemList = styled.div`display: grid; gap: 1rem;`;
const SummaryRow = styled.div<{ $discount?: boolean; $total?: boolean }>`
  display: flex; justify-content: space-between;
  margin-bottom: ${({ $total }) => $total ? 0 : '0.5rem'};
  color: ${({ $discount, theme }) => $discount ? theme.colors.success[600] : 'inherit'};
  font-weight: ${({ $total }) => $total ? 700 : 400};
  ${({ $total, theme }) => $total && `margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid ${theme.colors.neutral[200]};`}
`;
const ItemName = styled.p`margin: 0; font-weight: 500;`;
const ItemMeta = styled.p`margin: 0; color: ${({ theme }) => theme.colors.neutral[500]}; font-size: 0.875rem;`;
const Totals = styled.div`
  margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;
const Actions = styled.div`
  display: flex; flex-direction: column; justify-content: center; gap: 1rem; margin-top: 2rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) { flex-direction: row; }
`;

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError("Order ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        setError("Failed to load order details");
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container>
        <CenteredState>
          <SectionTitle title="سفارش یافت نشد" />
          <MutedText>{error || "جزئیات سفارش در دسترس نیست"}</MutedText>
          <HomeLink href="/"><Button>بازگشت به خانه</Button></HomeLink>
        </CenteredState>
      </Container>
    );
  }

  return (
    <Container>
      <Confirmation>
        <SuccessBox>
          <SuccessIcon
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </SuccessIcon>
          <SectionTitle title="سفارش با موفقیت ثبت شد" />
          <SuccessText>سفارش شما ثبت و برای پردازش ارسال شد.</SuccessText>
          <OrderId>شناسه سفارش: {order.id}</OrderId>
        </SuccessBox>

        <SummaryCard>
          <SummaryHeader><SummaryTitle>خلاصه سفارش</SummaryTitle></SummaryHeader>
          <SummaryContent>
            <ItemList>
              {order.items?.map((item, index) => (
                <SummaryRow key={index}>
                  <div>
                    <ItemName>{item.name}</ItemName>
                    <ItemMeta>تعداد: {item.quantity}</ItemMeta>
                  </div>
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                </SummaryRow>
              ))}
            </ItemList>
            
            <Totals>
              <SummaryRow>
                <p>جمع اقلام</p>
                <p>{formatCurrency(order.subtotal)}</p>
              </SummaryRow>
              <SummaryRow>
                <p>هزینه ارسال</p>
                <p>{formatCurrency(order.deliveryFee)}</p>
              </SummaryRow>
              {order.discount > 0 && (
                <SummaryRow $discount>
                  <p>تخفیف</p>
                  <p>-{formatCurrency(order.discount)}</p>
                </SummaryRow>
              )}
              <SummaryRow $total>
                <p>مبلغ نهایی</p>
                <p>{formatCurrency(order.total)}</p>
              </SummaryRow>
            </Totals>
          </SummaryContent>
        </SummaryCard>

        <Actions>
          <Link href="/order-tracking">
            <Button variant="outline">پیگیری سفارش</Button>
          </Link>
          <Link href="/">
            <Button>ادامه خرید</Button>
          </Link>
        </Actions>
      </Confirmation>
    </Container>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
