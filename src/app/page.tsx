import FeaturedSection from "@/components/FeaturedSection";
import HeroSection from "@/components/HeroSection";
import TrailersSection from "@/components/TrailersSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <div id="trailers">
        <TrailersSection />
      </div>
    </>
  );
};

export default HomePage;
