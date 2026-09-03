"use server";

import { revalidatePath } from "next/cache";
import { assertSameOrigin } from "@/infrastructure/http/same-origin";
import { createSupabaseServerClient, requireClaims } from "@/infrastructure/supabase/server";
import { z } from "zod";
import { uuidSchema } from "@/lib/validation/common";

const reviewInputSchema = z.object({
  restaurantId: uuidSchema,
  restaurantSlug: z.string().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5),
  foodName: z.string().trim().max(100).default(""),
  comment: z.string().trim().min(3).max(1000),
});

export async function submitRestaurantReviewAction(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  await assertSameOrigin();
  const claims = await requireClaims();
  if (!claims?.sub) {
    return { success: false, message: "برای ثبت نظر ابتدا وارد حساب کاربری شوید." };
  }

  const parsed = reviewInputSchema.safeParse({
    restaurantId: formData.get("restaurantId"),
    restaurantSlug: formData.get("restaurantSlug"),
    rating: formData.get("rating"),
    foodName: formData.get("foodName"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { success: false, message: "لطفاً تمامی فیلدها را با مقادیر معتبر تکمیل کنید." };
  }

  const client = await createSupabaseServerClient();

  // بررسی اینکه آیا کاربر قبلاً از این رستوران خرید کرده است
  const { data: eligibleOrders } = await client
    .from("orders")
    .select("id")
    .eq("user_id", claims.sub)
    .eq("restaurant_id", parsed.data.restaurantId)
    .in("status", ["confirmed", "preparing", "ready", "delivering", "delivered"])
    .limit(1);

  if (!eligibleOrders || eligibleOrders.length === 0) {
    return {
      success: false,
      message: "تنها کاربرانی که از این رستوران سفارش ثبت کرده‌اند مجاز به ثبت نظر هستند.",
    };
  }

  // خواندن نام کاربر
  const { data: profile } = await client
    .from("profiles")
    .select("first_name,last_name")
    .eq("id", claims.sub)
    .maybeSingle();

  const userName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    "مشتری فودینو";

  const { error } = await client.from("reviews").insert({
    restaurant_id: parsed.data.restaurantId,
    user_id: claims.sub,
    user_name: userName,
    rating: parsed.data.rating,
    food_name: parsed.data.foodName,
    comment: parsed.data.comment,
  });

  if (error) {
    console.error("Failed to insert review:", error);
    return { success: false, message: "خطا در ثبت نظر. لطفاً مجدداً تلاش فرمایید." };
  }

  revalidatePath(`/restaurants/${parsed.data.restaurantSlug}`);
  return { success: true, message: "نظر شما با موفقیت ثبت شد و به نمایش درآمد." };
}
