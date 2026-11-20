import FeaturedSection from "@/components/FeaturedSection";
import FeaturedSkeleton from "@/components/FeaturedSkeleton";
import HeroSection from "@/components/HeroSection";
import TrailersSection from "@/components/TrailersSection";
import { Suspense } from "react";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>
      <TrailersSection />
    </>
  );
};

export default HomePage;
