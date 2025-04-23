import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    id,
    name,
    price,
    discountedPrice,
    image,
    rating,
    description
  } = product;

  const hasDiscount = discountedPrice !== undefined && discountedPrice < price;
  const discount = hasDiscount ? Math.round((1 - discountedPrice / price) * 100) : 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${id}`} className="block relative">
        <div className="relative h-48 w-full">
          <Image
            src={image || '/images/placeholder-food.jpg'} 
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
          />
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              {discount}٪ تخفیف
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-md text-sm flex items-center">
            <span className="text-yellow-500 ml-1">★</span>
            <span>{rating}</span>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-lg font-bold mb-1 line-clamp-1">{name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            {hasDiscount ? (
              <div className="flex items-center">
                <span className="text-gray-400 line-through text-sm ml-2">
                  {formatCurrency(price)}
                </span>
                <span className="font-bold text-primary-600">
                  {formatCurrency(discountedPrice)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-primary-600">
                {formatCurrency(price)}
              </span>
            )}
          </div>
          
          <button 
            className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-3 py-1 text-sm transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // اضافه کردن به سبد خرید
              console.log('Adding to cart:', product);
            }}
          >
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 