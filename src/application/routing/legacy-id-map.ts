import { uuidSchema } from '@/lib/validation/common';

const restaurantIds: Readonly<Record<string, string>> = {
  '1': '20000000-0000-4000-8000-000000000001', '2': '20000000-0000-4000-8000-000000000002',
  '3': '20000000-0000-4000-8000-000000000003', '4': '20000000-0000-4000-8000-000000000004',
  '5': '20000000-0000-4000-8000-000000000005',
};
const categoryIds: Readonly<Record<string, string>> = {
  '1': '10000000-0000-4000-8000-000000000001', '2': '10000000-0000-4000-8000-000000000002',
  '3': '10000000-0000-4000-8000-000000000003', '4': '10000000-0000-4000-8000-000000000004',
  '5': '10000000-0000-4000-8000-000000000005',
};
const productIds: Readonly<Record<string, string>> = {
  '1': '30000000-0000-4000-8000-000000000001', '2': '30000000-0000-4000-8000-000000000002',
  '3': '30000000-0000-4000-8000-000000000003', '4': '30000000-0000-4000-8000-000000000004',
  '5': '30000000-0000-4000-8000-000000000005',
};

function resolve(id: string, mapping: Readonly<Record<string, string>>): string | null {
  if (mapping[id]) return mapping[id];
  const parsed = uuidSchema.safeParse(id);
  return parsed.success ? parsed.data : null;
}

export const resolveLegacyRestaurantId = (id: string) => resolve(id, restaurantIds);
export const resolveLegacyCategoryId = (id: string) => resolve(id, categoryIds);
export const resolveLegacyProductId = (id: string) => resolve(id, productIds);
