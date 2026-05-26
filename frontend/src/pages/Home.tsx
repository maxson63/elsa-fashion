import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Package } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white hero-pro-max">
        <div className="px-3 sm:px-4 lg:px-8 py-16 sm:py-20 lg:py-24 status-bar-aware">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-pro-max">
              Elsa Fashionis
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-300 px-4 text-pro-max">
              Premium Fashion & Creator Collaboration Platform
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                to="/shop"
                className="btn-primary bg-white text-black hover:bg-gray-100 inline-flex items-center justify-center py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base touch-target btn-pro-max"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                to="/elsa-collab"
                className="btn-secondary border-white text-white hover:bg-white hover:text-black inline-flex items-center justify-center py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base touch-target btn-pro-max"
              >
                Become an Ambassador
                <Users className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-gray-50 spacing-pro-max">
        <div className="px-3 sm:px-4 lg:px-8 safe-area-pro-max">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-pro-max">
              Why Choose Elsa Fashionis?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4 text-pro-max">
              Experience fashion that combines style with community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center px-4 card-pro-max">
              <div className="bg-black text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Package className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-pro-max">Premium Quality</h3>
              <p className="text-sm sm:text-base text-gray-600 text-pro-max">
                Curated collection of 49+ premium outfits with exceptional quality and design
              </p>
            </div>
            
            <div className="text-center px-4 card-pro-max">
              <div className="bg-black text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-pro-max">Creator Collaboration</h3>
              <p className="text-sm sm:text-base text-gray-600 text-pro-max">
                Join our Elsa Collab program and partner with us to promote authentic fashion
              </p>
            </div>
            
            <div className="text-center px-4 card-pro-max">
              <div className="bg-black text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-pro-max">Exclusive Benefits</h3>
              <p className="text-sm sm:text-base text-gray-600 text-pro-max">
                Ambassadors get free outfits and exclusive collaboration opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 spacing-pro-max">
        <div className="px-3 sm:px-4 lg:px-8 safe-area-pro-max">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-pro-max">
              Explore Our Collections
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4 text-pro-max">
              Discover our handpicked selection of premium fashion pieces
            </p>
            
            {/* Quick Navigation Buttons - Mobile Optimized */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <Link
                to="/shop?category=formal"
                className="bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-purple-700 transition-colors touch-target"
              >
                Evening Wear
              </Link>
              <Link
                to="/shop?category=street"
                className="bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-900 transition-colors touch-target"
              >
                Street Style
              </Link>
              <Link
                to="/shop?category=luxury"
                className="bg-black text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-800 transition-colors touch-target"
              >
                Luxury Collection
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 grid-pro-max">
            <div className="card group cursor-pointer card-pro-max">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <img
                  src="https://celebmafia.com/wp-content/uploads/2024/02/elsa-hosk-outfit-02-07-2024-6.jpg"
                  alt="Elegant Evening Gown"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-pro-max">Elegant Evening Wear</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 text-pro-max">Sophisticated pieces for special occasions</p>
                <Link
                  to="/shop?category=formal"
                  className="text-black font-medium hover:underline inline-flex items-center text-sm sm:text-base touch-target text-pro-max"
                >
                  Explore Collection
                  <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
            
            <div className="card group cursor-pointer card-pro-max">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/e6/15/03/e615030429fdbaf6ae9ada1a162fa174.jpg"
                  alt="Urban Street Style"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-pro-max">Urban Street Style</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 text-pro-max">Trendy casual wear for everyday fashion</p>
                <Link
                  to="/shop?category=street"
                  className="text-black font-medium hover:underline inline-flex items-center text-sm sm:text-base touch-target text-pro-max"
                >
                  Explore Collection
                  <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
            
            <div className="card group cursor-pointer card-pro-max">
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <img
                  src="https://tse1.explicit.bing.net/th/id/OIP.X9u1R5udKcsMe8ozsjZ2qQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3"
                  alt="Luxury Essentials"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-pro-max">Luxury Essentials</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 text-pro-max">Premium pieces that define elegance</p>
                <Link
                  to="/shop?category=luxury"
                  className="text-black font-medium hover:underline inline-flex items-center text-sm sm:text-base touch-target text-pro-max"
                >
                  Explore Collection
                  <ArrowRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-black text-white home-indicator-aware">
        <div className="px-3 sm:px-4 lg:px-8 text-center safe-area-pro-max">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4 text-pro-max">
            Ready to Join Our Fashion Community?
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-300 px-4 text-pro-max">
            Whether you're shopping for premium fashion or looking to collaborate as a creator
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/shop"
              className="btn-primary bg-white text-black hover:bg-gray-100 py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base touch-target btn-pro-max"
            >
              Start Shopping
            </Link>
            <Link
              to="/elsa-collab"
              className="btn-secondary border-white text-white hover:bg-white hover:text-black py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base touch-target btn-pro-max"
            >
              Learn About Collabs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
