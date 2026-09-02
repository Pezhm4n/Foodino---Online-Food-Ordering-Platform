'use client';

import styled from 'styled-components';
import type { ProductMenuItem } from '@/application/ports/catalog-repository';
import { useCart } from '@/contexts/CartContext';
import { irrToToman } from '@/domain/money/money';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const List = styled.ul`
  display: grid;
  gap: 0.85rem;
  padding: 0;
  list-style: none;
  margin: 0;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.85rem;
    gap: 0.75rem;
    border-radius: 0.75rem;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.925rem;
      margin-bottom: 0.2rem;
    }

    a {
      text-decoration: none;
      color: ${({ theme }) => theme.colors.neutral[900]};
      &:hover {
        color: ${({ theme }) => theme.colors.primary[500]};
      }
    }
  }

  p {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.neutral[600]};
    margin: 0 0 0.4rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.78rem;
      margin-bottom: 0.35rem;
    }
  }

  span {
    display: inline-block;
    font-size: 0.9rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary[600]};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 0.825rem;
    }
  }
`;

const Button = styled.button`
  padding: 0.55rem 1rem;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  min-height: 40px;
  min-width: 72px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.45rem 0.85rem;
    font-size: 0.825rem;
    min-height: 36px;
    min-width: 64px;
  }
`;

export default function DatabaseMenu({
  restaurant,
  products,
}: Readonly<{
  restaurant: { id: string; name: string };
  products: readonly ProductMenuItem[];
}>) {
  const { addItem } = useCart();
  return (
    <List>
      {products.map((product) => (
        <Item key={product.id}>
          <ItemDetails>
            <strong><Link href={`/products/${product.slug}`}>{product.name}</Link></strong>
            <p>{product.description}</p>
            <span>{new Intl.NumberFormat('fa-IR').format(irrToToman(product.price))} تومان</span>
          </ItemDetails>
          <Button type="button" onClick={() => {
            try {
              addItem({
                id: product.id,
                productId: product.id,
                restaurantId: restaurant.id,
                addonIds: [],
                name: product.name,
                price: product.price.amountIrr,
                quantity: 1,
                restaurantName: restaurant.name,
              });
              toast.success('به سبد خرید افزوده شد.');
            } catch {
              toast.error('سبد خرید فقط می‌تواند شامل محصولات یک رستوران باشد.');
            }
          }}>افزودن</Button>
        </Item>
      ))}
    </List>
  );
}
