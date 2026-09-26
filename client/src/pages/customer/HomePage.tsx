import React, { useEffect, useState } from 'react';
import { HeroSection } from '../../components/home/HeroSection';
import { CategorySection } from '../../components/home/CategorySection';
import { TrendingSection } from '../../components/home/TrendingSection';
import { NewArrivalsSection } from '../../components/home/NewArrivalsSection';
import { CustomTattooCallout } from '../../components/home/CustomTattooCallout';
import { FeaturedCollection } from '../../components/home/FeaturedCollection';
import { WhyUsSection } from '../../components/home/WhyUsSection';
import { EditorialBanner } from '../../components/home/EditorialBanner';
import { ReviewsSection } from '../../components/home/ReviewsSection';
import { api } from '../../services/api';
import { Product, Category, Review, HomepageSection } from '../../types';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cmsSections, setCmsSections] = useState<Record<string, HomepageSection>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, revRes, cmsRes] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getReviews(),
          api.getHomepageSections()
        ]);

        if (prodRes.success) setProducts(prodRes.products);
        if (catRes.success) setCategories(catRes.categories);
        if (revRes.success) setReviews(revRes.reviews);
        if (cmsRes.success && cmsRes.sections) {
          const map: Record<string, HomepageSection> = {};
          cmsRes.sections.forEach((sec: HomepageSection) => {
            map[sec.key] = sec;
          });
          setCmsSections(map);
        }
      } catch (err) {
        console.error('[HomePage] Error loading storefront data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-[#050505]">
      {/* 1. Hero Section */}
      <HeroSection cmsData={cmsSections['hero']} />

      {/* 2. Shop By Category */}
      <CategorySection categories={categories} />

      {/* 3. Trending Now */}
      <TrendingSection products={products} />

      {/* 4. New Arrivals */}
      <NewArrivalsSection products={products} />

      {/* 5. Custom Tattoo Callout */}
      <CustomTattooCallout />

      {/* 6. Featured Editorial */}
      <FeaturedCollection cmsData={cmsSections['featured']} />

      {/* 7. Why TWILIGHT THINKS */}
      <WhyUsSection />

      {/* 8. Editorial Banner */}
      <EditorialBanner />

      {/* 9. Reviews Section */}
      <ReviewsSection reviews={reviews} />
    </div>
  );
};
