"use client";

import React, { useState } from "react";
import styled from "styled-components";
import type { RestaurantSummary, ProductMenuItem } from "@/application/ports/catalog-repository";
import RestaurantHero from "./RestaurantHero";
import RestaurantNavTabs, { type RestaurantTabType } from "./RestaurantNavTabs";
import RestaurantInfoTab from "./RestaurantInfoTab";
import RestaurantReviewsTab from "./RestaurantReviewsTab";
import DatabaseMenu from "./DatabaseMenu";
import FloatingCartPill from "./FloatingCartPill";

interface RestaurantViewProps {
  restaurant: RestaurantSummary;
  products: readonly ProductMenuItem[];
  isFavorite: boolean;
}

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 1.25rem) clamp(4rem, 6vw, 6rem);
  direction: rtl;
`;

const ContentArea = styled.main`
  min-height: 380px;
`;

export default function RestaurantView({
  restaurant,
  products,
  isFavorite,
}: RestaurantViewProps) {
  const [activeTab, setActiveTab] = useState<RestaurantTabType>("menu");

  return (
    <PageWrapper>
      <RestaurantHero restaurant={restaurant} isFavorite={isFavorite} />

      <RestaurantNavTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        menuItemCount={products.length}
      />

      <ContentArea>
        {activeTab === "menu" && (
          <DatabaseMenu
            restaurant={{ id: restaurant.id, name: restaurant.name }}
            products={products}
          />
        )}

        {activeTab === "info" && <RestaurantInfoTab restaurant={restaurant} />}

        {activeTab === "reviews" && <RestaurantReviewsTab restaurant={restaurant} />}
      </ContentArea>

      <FloatingCartPill />
    </PageWrapper>
  );
}
