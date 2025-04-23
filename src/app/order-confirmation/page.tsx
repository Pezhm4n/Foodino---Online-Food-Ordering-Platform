 "use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { getOrderById } from "@/lib/api";
import { Order } from "@/types";
import Loading from "@/components/ui/Loading";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OrderConfirmationPage() {
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <SectionTitle title="Order Not Found" />
          <p className="mt-4 text-gray-600">{error || "Unable to find your order details"}</p>
          <Link href="/" className="mt-6">
            <Button>Return Home</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-green-50 rounded-lg p-6 mb-8 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-green-500 mx-auto mb-4" 
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
          </svg>
          <SectionTitle title="Order Confirmed!" />
          <p className="text-gray-700 mt-2">Your order has been successfully placed.</p>
          <p className="font-medium mt-2">Order ID: {order.id}</p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h3 className="font-medium">Order Summary</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>{formatCurrency(order.subtotal)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Delivery Fee</p>
                <p>{formatCurrency(order.deliveryFee)}</p>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <p>Discount</p>
                  <p>-{formatCurrency(order.discount)}</p>
                </div>
              )}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <p>Total</p>
                <p>{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/order-tracking">
            <Button variant="outline">Track Order</Button>
          </Link>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}