import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, Gift, CheckCircle, ArrowRight, Instagram, Video, Facebook } from 'lucide-react';

const ElsaCollab: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-purple-600 text-white p-3 sm:p-4 rounded-full">
              <Users className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
            Elsa Collab
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Join our exclusive ambassador program and collaborate with Elsa Fashionis to promote premium fashion while earning rewards
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/ambassador/register"
              className="btn-primary bg-purple-600 hover:bg-purple-700 text-white inline-flex items-center justify-center py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base touch-target"
            >
              Become an Ambassador
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/ambassador/login"
              className="btn-secondary border-purple-600 text-purple-600 hover:bg-purple-50 inline-flex items-center justify-center py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base touch-target"
            >
              Ambassador Login
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ambassador Benefits</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">What you get as an Elsa Fashionis Ambassador</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-4 sm:p-6 rounded-lg bg-purple-50">
              <div className="bg-purple-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Free Outfits</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Select 3 premium outfits for free to create promotional content
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 rounded-lg bg-pink-50">
              <div className="bg-pink-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Earn Commission</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Earn competitive commissions on sales generated through your promotions
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 rounded-lg bg-purple-50">
              <div className="bg-purple-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Community</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Join a community of fashion creators and collaborate on exclusive campaigns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">Simple steps to become an ambassador</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="bg-purple-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-sm sm:text-lg">
                1
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Register</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Create your ambassador account with email and password
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-sm sm:text-lg">
                2
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Complete Clearance</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Fill out comprehensive clearance form and pay $2 fee
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-sm sm:text-lg">
                3
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Select Outfits</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Choose 3 free outfits for your promotional content
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-sm sm:text-lg">
                4
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Create Content</h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                Share promotional content and start earning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Support - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Multi-Platform Support</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">We support creators across all major social platforms</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center p-3 sm:p-4 lg:p-6 border border-gray-200 rounded-lg hover:border-purple-600 transition-colors">
              <Instagram className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-4 text-pink-600" />
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Instagram</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Posts, Reels, Stories</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-6 border border-gray-200 rounded-lg hover:border-purple-600 transition-colors">
              <Video className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-4 text-black" />
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">TikTok</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Short-form videos</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-6 border border-gray-200 rounded-lg hover:border-purple-600 transition-colors">
              <Facebook className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-4 text-blue-600" />
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Facebook</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Posts, Videos, Stories</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-6 border border-gray-200 rounded-lg hover:border-purple-600 transition-colors">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-4 text-red-600" />
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">YouTube</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Videos, Shorts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ambassador Requirements</h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">What we look for in our ambassadors</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Active Social Presence</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Minimum 1,000 followers on at least one platform
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Fashion Focus</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Content related to fashion, lifestyle, or beauty
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Engagement</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Active engagement with your audience
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Quality Content</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  High-quality photos and videos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 bg-purple-600 text-white">
        <div className="px-3 sm:px-4 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Ready to Join Our Fashion Community?
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 px-4">
            Start your journey as an Elsa Fashionis Ambassador today
          </p>
          <Link
            to="/ambassador/register"
            className="btn-primary bg-white text-purple-600 hover:bg-gray-100 inline-flex items-center justify-center py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base touch-target"
          >
            Apply Now
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ElsaCollab;
