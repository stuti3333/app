import { Helmet } from 'react-helmet-async';
import HeroBanner from '../components/HeroBanner';
import CategoriesSection from '../components/CategoriesSection';
import TrendingProducts from '../components/TrendingProducts';
import DealsSection from '../components/DealsSection';
import TrustBadges from '../components/TrustBadges';
import ModernFooter from '../components/ModernFooter';
import './HomeScreen.css';

function HomeScreen() {
  return (
    <div className="home-screen">
      <Helmet>
        <title>Amazon Clone - Premium Shopping Experience</title>
      </Helmet>

      <HeroBanner />

      <CategoriesSection />

      <TrendingProducts />

      <DealsSection />

      <TrustBadges />

      <ModernFooter />
    </div>
  );
}

export default HomeScreen;
