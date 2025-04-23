"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getRestaurantById } from '@/lib/api';
import Loading from '@/components/ui/Loading';

export default function RestaurantIdRedirect() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const id = params.id as string;

  useEffect(() => {
    async function redirectToSlug() {
      try {
        const restaurant = await getRestaurantById(id);
        
        if (restaurant && restaurant.slug) {
          // هدایت به صفحه اسلاگ
          router.push(`/restaurants/${restaurant.slug}`);
        } else {
          // در صورت نیافتن رستوران، به لیست رستوران‌ها هدایت شود
          router.push('/restaurants');
        }
      } catch (error) {
        console.error('خطا در هدایت به صفحه رستوران:', error);
        router.push('/restaurants');
      } finally {
        setIsLoading(false);
      }
    }

    redirectToSlug();
  }, [id, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {isLoading ? (
        <Loading />
      ) : (
        <p>در حال هدایت به صفحه رستوران...</p>
      )}
    </div>
  );
} 