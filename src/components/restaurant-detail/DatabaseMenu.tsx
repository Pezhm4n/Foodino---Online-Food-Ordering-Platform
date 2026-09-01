'use client';

import styled from 'styled-components';
import type { ProductMenuItem } from '@/application/ports/catalog-repository';
import { useCart } from '@/contexts/CartContext';
import { irrToToman } from '@/domain/money/money';
import { toast } from 'react-hot-toast';

const List = styled.ul`display: grid; gap: 1rem; padding: 0; list-style: none;`;
const Item = styled.li`
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 1rem; border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg}; background: white;
`;
const Button = styled.button`
  padding: 0.65rem 1rem; border: 0; border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary[500]}; color: white; cursor: pointer;
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
          <div>
            <strong>{product.name}</strong>
            <p>{product.description}</p>
            <span>{new Intl.NumberFormat('fa-IR').format(irrToToman(product.price))} تومان</span>
          </div>
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
