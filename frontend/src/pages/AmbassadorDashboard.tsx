import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Gift, DollarSign, FileText, LogOut, Settings, ShoppingBag, Camera, Upload, RefreshCw, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { getApiUrl } from '../config/api';

const AmbassadorDashboard: React.FC = () => {
  const { ambassador, logout } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [clearanceSubmissions, setClearanceSubmissions] = useState<any[]>([]);
  const [showOutfitSelection, setShowOutfitSelection] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedOutfits, setSelectedOutfits] = useState<any[]>([]);
  const [showProfileManagement, setShowProfileManagement] = useState(false);
  const isInitialized = useRef(false);

  // Load profile picture on component mount
  useEffect(() => {
    if (ambassador?._id && !isInitialized.current) {
      loadProfilePicture();
      loadClearanceSubmissions();
      loadAllProducts();
      // Initialize selected outfits from ambassador data only once
      setSelectedOutfits(Array.isArray(ambassador?.selectedOutfits) ? ambassador.selectedOutfits : []);
      isInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambassador?._id]);

  const loadAllProducts = async () => {
    try {
      const apiUrl = getApiUrl('/api/products');
      console.log('Loading products from:', apiUrl);
      const response = await fetch(apiUrl);
      console.log('Products response status:', response.status);
      console.log('Products response ok:', response.ok);
      
      if (response.ok) {
        const products = await response.json();
        console.log('Products loaded:', products.length);
        setAllProducts(products);
      } else {
        const errorText = await response.text();
        console.error('Failed to load products:', response.status, errorText);
        toast.error('Failed to load products. Please try again.');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Network error loading products');
    }
  };

  const handleOutfitSelection = (product: any) => {
    // Check if outfit is already selected (use _id for MongoDB or id as fallback)
    const productId = product._id || product.id;
    const isSelected = selectedOutfits.some((outfit: any) => (outfit._id || outfit.id) === productId);
    
    if (isSelected) {
      // Remove from selection with feedback
      setSelectedOutfits(selectedOutfits.filter((outfit: any) => (outfit._id || outfit.id) !== productId));
      toast.success(`${product.name} removed from selection`, {
        icon: '🗑️'
      });
    } else {
      // Add to selection (limit to 3 outfits)
      if (selectedOutfits.length < 3) {
        setSelectedOutfits([...selectedOutfits, product]);
        const remaining = 3 - (selectedOutfits.length + 1);
        toast.success(`${product.name} added! ${remaining} more to go.`, {
          icon: '👗',
          duration: 3000
        });
        
        // Celebration effect when 3 outfits are selected
        if (selectedOutfits.length === 2) {
          setTimeout(() => {
            toast.success('🎉 Perfect! You have selected all 3 outfits!', {
              duration: 4000,
              icon: '🎊'
            });
          }, 500);
        }
      } else {
        toast.error('⚠️ You can only select exactly 3 outfits. Remove one to select this.', {
          icon: '🚫',
          duration: 4000
        });
      }
    }
  };

  const saveOutfitSelection = async () => {
    if (!ambassador?.email) {
      toast.error('Ambassador email not found');
      return;
    }
    
    if (selectedOutfits.length === 0) {
      toast.error('Please select at least 1 outfit before saving');
      return;
    }
    
    if (selectedOutfits.length < 3) {
      toast.error(`Please select exactly 3 outfits. You have selected ${selectedOutfits.length} outfit${selectedOutfits.length === 1 ? '' : 's'}.`, {
        icon: '👗',
        duration: 4000
      });
      return;
    }
    
    if (selectedOutfits.length > 3) {
      toast.error('You can only select up to 3 outfits. Please remove some outfits first.', {
        icon: '🚫',
        duration: 4000
      });
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading('Saving your 3 selected outfits...');
    
    // Ensure selectedOutfits is always an array of proper outfit objects
    const outfitsToSend = Array.isArray(selectedOutfits) ? selectedOutfits.map(outfit => ({
      id: outfit._id || outfit.id,
      name: outfit.name,
      price: outfit.price,
      image: outfit.image,
      category: outfit.category,
      selectedAt: new Date().toISOString()
    })) : [];
    
    console.log('Saving outfit selection:', {
      email: ambassador.email,
      selectedOutfits: outfitsToSend,
      selectedOutfitsCount: outfitsToSend.length,
      selectedOutfitsStructure: outfitsToSend.map(o => ({ id: o.id, name: o.name }))
    });
    
    try {
      const response = await fetch(getApiUrl('/api/ambassadors/update-outfits'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: ambassador.email,
          selectedOutfits: outfitsToSend
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      const responseData = await response.text();
      console.log('Response data:', responseData);

      if (response.ok) {
        toast.success('🎉 Perfect! Your 3 outfits have been saved successfully!', {
          duration: 4000,
          icon: '✅'
        });
        setShowOutfitSelection(false);
        
        // Update ambassador data in context
        setTimeout(() => {
          window.location.reload(); // Simple refresh to update the display
        }, 1000);
      } else {
        const errorText = responseData;
        console.error('Server responded with error:', errorText);
        toast.error(`Failed to save outfits: ${errorText}`, {
          icon: '❌'
        });
      }
    } catch (error: any) {
      console.error('Network error updating outfits:', error);
      toast.error('Network error: Failed to update outfits', {
        icon: '🔌'
      });
    } finally {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
    }
  };

  const loadClearanceSubmissions = async () => {
    if (!ambassador?._id) {
      console.log('Ambassador ID not available, skipping clearance submissions load');
      setClearanceSubmissions([]);
      return;
    }
    
    try {
      console.log('Loading clearance submissions for ambassador:', ambassador._id);
      const response = await fetch(getApiUrl(`/api/clearance-storage/submissions/${ambassador._id}`));
      const data = await response.json();
      
      console.log('Clearance submissions response:', data);
      
      if (data.success && data.submissions) {
        setClearanceSubmissions(data.submissions);
        console.log('Set clearance submissions:', data.submissions.length);
      } else {
        setClearanceSubmissions([]);
        console.log('No submissions found');
      }
    } catch (error) {
      console.error('Error loading clearance submissions:', error);
      setClearanceSubmissions([]);
    }
  };

  const loadProfilePicture = async () => {
    if (!ambassador?._id) {
      console.log('Ambassador ID not available, skipping profile picture load');
      return;
    }
    
    try {
      const response = await fetch(getApiUrl(`/api/profile/${ambassador._id}`));
      const data = await response.json();
      
      if (data.profilePicture) {
        setProfilePicture(data.profilePicture);
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
    }
  };

  const saveProfilePicture = async (pictureData: string) => {
    try {
      const response = await fetch(getApiUrl('/api/profile/upload'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ambassadorId: ambassador?._id,
          profilePicture: pictureData
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Profile picture saved:', data.message);
      } else {
        throw new Error(data.message || 'Failed to save profile picture');
      }
    } catch (error) {
      console.error('Error saving profile picture:', error);
      toast.error('Failed to save profile picture');
    }
  };

  const deleteProfilePicture = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/profile/${ambassador?._id}`), {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Profile picture deleted:', data.message);
        setProfilePicture(null);
        toast.success('Profile picture removed successfully');
      } else {
        throw new Error(data.message || 'Failed to remove profile picture');
      }
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      toast.error('Failed to remove profile picture');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile picture must be less than 5MB');
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const pictureData = event.target?.result as string;
        setProfilePicture(pictureData);
        
        // Save to backend
        await saveProfilePicture(pictureData);
        
        setIsUploading(false);
        toast.success('Profile picture updated successfully!');
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error('Failed to upload profile picture');
      };
      reader.readAsDataURL(file);
    }
  };

  if (!ambassador) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your dashboard.</p>
          <Link
            to="/ambassador/login"
            className="btn-primary mt-4 inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 px-2 py-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section - Mobile Optimized */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white mb-6">
          <div className="flex items-center">
            {/* Enhanced Profile Picture Section */}
            <div className="relative mr-3 sm:mr-6">
              <div className="relative group">
                {/* Profile Picture Container */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-3 border-white/30 shadow-lg transition-all duration-300 group-hover:scale-105">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-white/80 transition-all duration-300 group-hover:scale-110" />
                  )}
                </div>
                
                {/* Upload Button Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-1" />
                    <span className="text-xs sm:text-sm text-white font-medium">Change</span>
                  </div>
                </div>
                
                {/* Upload Trigger */}
                <label className="absolute bottom-1 right-1 bg-white text-purple-600 rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 touch-target">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                
                {/* Loading Indicator */}
                {isUploading && (
                  <div className="absolute inset-0 rounded-full bg-white/80 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 animate-spin" />
                  </div>
                )}
                
                {/* Profile Picture Status Indicator */}
                {profilePicture && !isUploading && (
                  <div className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                )}
              </div>
            </div>
            
            {/* Enhanced Welcome Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
                  Welcome, {ambassador.email}!
                </h2>
                {profilePicture && (
                  <div className="ml-2 px-2 py-1 bg-green-500/20 text-green-100 text-xs sm:text-sm rounded-full font-medium">
                    ✓ Verified
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                <span className="font-medium">Ambassador ID:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{ambassador?._id}</span>
              </div>
              <p className="text-sm sm:text-base opacity-90 line-clamp-2 mb-2">
                Manage your ambassador account and track your performance
              </p>
              
              {/* Profile Stats */}
              <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm opacity-80">
                <div className="flex items-center">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>Ambassador</span>
                </div>
                {selectedOutfits.length > 0 && (
                  <div className="flex items-center">
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>{selectedOutfits.length} Outfits</span>
                  </div>
                )}
                {clearanceSubmissions.length > 0 && (
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>Clearance Complete</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-2 sm:p-3 mr-2 sm:mr-4">
                <Gift className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Free Outfits</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {ambassador.selectedOutfits?.length || 0}/3
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-2 sm:p-3 mr-2 sm:mr-4">
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Commission</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">$0.00</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2 sm:p-3 mr-2 sm:mr-4">
                <User className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Status</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                  {ambassador.clearanceStatus || 'Pending'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="bg-orange-100 rounded-full p-2 sm:p-3 mr-2 sm:mr-4">
                  <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Clearance</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                    {clearanceSubmissions.length > 0 ? 'Submitted' : 'Not Submitted'}
                  </p>
                </div>
              </div>
              <button
                onClick={loadClearanceSubmissions}
                className="p-1 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full touch-target"
                title="Refresh clearance submissions"
              >
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Profile Management Section - Mobile Optimized */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Profile Management Header */}
          <button
            onClick={() => setShowProfileManagement(!showProfileManagement)}
            className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors touch-target"
          >
            <h3 className="text-base sm:text-lg font-semibold flex items-center">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
              Profile Management
            </h3>
            <div className="flex items-center space-x-2">
              {profilePicture && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
              {showProfileManagement ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-transform duration-200" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-transform duration-200" />
              )}
            </div>
          </button>
          
          {/* Collapsible Content */}
          <div className={`transition-all duration-300 ease-in-out ${
            showProfileManagement ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="p-4 sm:p-6 pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Enhanced Large Profile Picture */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105">
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="text-center">
                        <User className="w-14 h-14 sm:w-18 sm:h-18 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">No Photo</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile Picture Actions */}
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="flex justify-center space-x-2">
                        <label className="bg-white text-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-50 transition-colors shadow-lg touch-target">
                          <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                        {profilePicture && (
                          <button
                            onClick={deleteProfilePicture}
                            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg touch-target"
                            title="Remove profile picture"
                          >
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                      <p className="text-white text-xs sm:text-sm font-medium">
                        {profilePicture ? 'Change Photo' : 'Add Photo'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  {profilePicture && (
                    <div className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">✓</span>
                    </div>
                  )}
                  
                  {/* Loading Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 rounded-full bg-white/90 flex items-center justify-center">
                      <div className="text-center">
                        <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 animate-spin mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-purple-600 font-medium">Uploading...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile Information */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="mb-4">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                      {ambassador.email}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      Ambassador Account
                    </p>
                  </div>
                  
                  {/* Profile Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs sm:text-sm text-purple-600 font-medium">Status</p>
                      <p className="text-sm sm:text-base font-bold text-purple-900">
                        {ambassador.clearanceStatus || 'Pending'}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs sm:text-sm text-green-600 font-medium">Outfits</p>
                      <p className="text-sm sm:text-base font-bold text-green-900">
                        {selectedOutfits.length}/3
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">Clearance</p>
                      <p className="text-sm sm:text-base font-bold text-blue-900">
                        {clearanceSubmissions.length > 0 ? 'Done' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Profile Actions */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <label className="btn-secondary border-purple-600 text-purple-600 hover:bg-purple-50 inline-flex items-center justify-center py-2 px-4 text-sm sm:text-base touch-target cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    {profilePicture && (
                      <button
                        onClick={deleteProfilePicture}
                        className="btn-secondary border-red-600 text-red-600 hover:bg-red-50 inline-flex items-center justify-center py-2 px-4 text-sm sm:text-base touch-target"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Select Free Outfits */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-3 sm:mb-4">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mr-2 sm:mr-3" />
              <h3 className="text-base sm:text-lg font-semibold">Free Outfits</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Choose 3 free outfits for your promotional content
            </p>
            <button
              onClick={() => setShowOutfitSelection(true)}
              className="btn-primary w-full text-center text-sm sm:text-base py-2 sm:py-3 touch-target"
            >
              Select Outfits
            </button>
          </div>

          {/* Complete Clearance */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-3 sm:mb-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mr-2 sm:mr-3" />
              <h3 className="text-base sm:text-lg font-semibold">Clearance</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Submit clearance form and pay $2 fee
            </p>
            <Link
              to="/ambassador/clearance"
              className="btn-secondary w-full text-center text-sm sm:text-base py-2 sm:py-3 touch-target"
            >
              Complete Clearance
            </Link>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-3 sm:mb-4">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 mr-2 sm:mr-3" />
              <h3 className="text-base sm:text-lg font-semibold">Settings</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Update your profile and preferences
            </p>
            <button className="btn-secondary w-full text-sm sm:text-base py-2 sm:py-3 touch-target">
              Manage Account
            </button>
          </div>
        </div>

        {/* Recent Activity - Mobile Optimized */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <p className="text-sm sm:text-base">No recent activity</p>
              <p className="text-xs sm:text-sm mt-2">Your activity will appear here once you start using the platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Outfit Selection Modal - Mobile Optimized */}
      {showOutfitSelection && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 safe-area-top safe-area-bottom">
          <div className="bg-white rounded-xl max-w-7xl w-full max-h-[98vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header - Mobile Optimized */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate pr-4">Select Your Outfits</h2>
                  <div className="flex items-center mt-2 space-x-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        selectedOutfits.length === 0 ? 'bg-gray-300' : 
                        selectedOutfits.length === 1 ? 'bg-red-500' :
                        selectedOutfits.length === 2 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-sm sm:text-base font-medium text-gray-700">
                        {selectedOutfits.length} of 3 selected
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowOutfitSelection(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors touch-target"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content - Mobile Optimized */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {allProducts.map((product: any) => {
                  const productId = product._id || product.id;
                  const isSelected = selectedOutfits.some((outfit: any) => (outfit._id || outfit.id) === productId);
                  return (
                    <div key={productId} className={`bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
                      isSelected ? 'border-purple-600 shadow-lg ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'
                    }`}>
                      {/* Product Image - Mobile Optimized */}
                      <div className="relative aspect-square bg-gray-50 rounded-t-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                        />
                        
                        {/* Selection Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1.5 sm:p-2 shadow-lg animate-bounce">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                              <span className="text-xs sm:text-sm font-bold">✓</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-purple-600/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-center text-purple-600">
                            <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm font-semibold">
                              {isSelected ? 'Click to Remove' : 'Click to Select'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Info - Mobile Optimized */}
                      <div className="p-3 sm:p-4">
                        <div className="text-center">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-1">{product.category}</p>
                          <div className="text-base sm:text-lg font-bold text-purple-600 mb-3 sm:mb-4">${product.price.toFixed(2)}</div>
                          
                          {/* Selection Button - Mobile Optimized */}
                          <button
                            onClick={() => handleOutfitSelection(product)}
                            className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base touch-target transform hover:scale-105 ${
                              isSelected
                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                            }`}
                          >
                            {isSelected ? (
                              <span className="flex items-center justify-center">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Remove
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Select
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Empty State */}
              {allProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-base sm:text-lg">No outfits available</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Mobile Optimized */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 z-10">
              <div className="flex flex-col space-y-3">
                {/* Progress Indicator */}
                <div className="bg-gray-100 rounded-full p-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Selection Progress</span>
                    <span className="text-xs sm:text-sm font-bold text-purple-600">{selectedOutfits.length}/3</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((num) => (
                      <div
                        key={num}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          num <= selectedOutfits.length
                            ? 'bg-purple-600'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Selection Summary */}
                <div className={`rounded-lg p-3 text-center transition-all duration-300 ${
                  selectedOutfits.length === 3 
                    ? 'bg-green-50 border border-green-200' 
                    : selectedOutfits.length > 0 
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {selectedOutfits.length === 0 && (
                      <>
                        <ShoppingBag className="w-4 h-4 text-gray-500" />
                        <p className="text-sm sm:text-base text-gray-700 font-medium">Select exactly 3 outfits for your promotional content</p>
                      </>
                    )}
                    {selectedOutfits.length === 1 && (
                      <>
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-sm sm:text-base text-blue-700 font-medium">1 outfit selected • 2 more to go</p>
                      </>
                    )}
                    {selectedOutfits.length === 2 && (
                      <>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                        <p className="text-sm sm:text-base text-blue-700 font-medium">2 outfits selected • 1 more to go</p>
                      </>
                    )}
                    {selectedOutfits.length === 3 && (
                      <>
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce"></div>
                        <p className="text-sm sm:text-base text-green-700 font-bold">🎉 Perfect! All 3 outfits selected • Ready to save!</p>
                      </>
                    )}
                  </div>
                  
                  {/* Prominent Save Button when 3 outfits selected */}
                  {selectedOutfits.length === 3 && (
                    <div className="mt-4">
                      <button
                        onClick={saveOutfitSelection}
                        className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 animate-pulse border-2 border-green-400"
                      >
                        <span className="flex items-center justify-center">
                          <Gift className="w-6 h-6 mr-3" />
                          Save 3 Selected Outfits ✓
                        </span>
                      </button>
                      <p className="text-xs text-green-600 mt-2 font-medium">Click to save your 3 selected outfits to your ambassador profile</p>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowOutfitSelection(false)}
                    className="btn-secondary w-full sm:w-auto text-sm sm:text-base py-3 sm:py-3 px-6 touch-target"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveOutfitSelection}
                    disabled={selectedOutfits.length !== 3}
                    className={`w-full sm:w-auto py-3 sm:py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base touch-target transform hover:scale-105 ${
                      selectedOutfits.length !== 3
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-lg animate-pulse border-2 border-green-400'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      {selectedOutfits.length === 3 ? (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          Save 3 Outfits ✓
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          Select 3 Outfits ({selectedOutfits.length}/3)
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbassadorDashboard;
