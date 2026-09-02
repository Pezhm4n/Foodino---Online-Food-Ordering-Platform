import { notFound, permanentRedirect } from 'next/navigation';
import { searchSchema } from '@/lib/validation/search';

export default async function LegacySearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const parsed = searchSchema.safeParse(await searchParams);
  if (!parsed.success) notFound();
  const output = new URLSearchParams();
  if (parsed.data.q) output.set('q', parsed.data.q);
  if (parsed.data.category) output.set('category', parsed.data.category);
  if (parsed.data.sort !== 'relevance') output.set('sort', parsed.data.sort);
  if (parsed.data.cursor) output.set('cursor', parsed.data.cursor);
  permanentRedirect(output.size ? `/restaurants?${output}` : '/restaurants');
}
