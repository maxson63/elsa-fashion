import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Upload, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ClearanceForm: React.FC = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    
    // Social Media
    instagram: '',
    tiktok: '',
    youtube: '',
    facebook: '',
    audienceSize: '',
    contentType: '',
    contentStyle: '',
    promotionStrategy: '',
    previousCollaborations: '',
    
    // Address Information
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    
    // Verification
    ssn: '',
    idDocument: null as File | null,
    idDocumentPath: '',
    
    // Additional
    note: ''
  });

  const { ambassador } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Automatically save ID card picture to system folder
      if (e.target.name === 'idDocument') {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('idDocument', file);
          uploadFormData.append('ambassadorId', ambassador?._id || 'temp_ambassador');
          
          const response = await fetch('/api/clearance-storage/upload-id-document', {
            method: 'POST',
            body: uploadFormData
          });
          
          if (response.ok) {
            const result = await response.json();
            setFormData({
              ...formData,
              [e.target.name]: file,
              idDocumentPath: result.filePath
            });
            toast.success('ID card saved successfully!');
          } else {
            toast.error('Failed to save ID card');
          }
        } catch (error) {
          console.error('Error saving ID card:', error);
          toast.error('Error saving ID card');
        }
      } else {
        setFormData({
          ...formData,
          [e.target.name]: file
        });
      }
    }
  };

  const handleProceedToSubmit = () => {
    // Validate required fields before proceeding
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phoneNumber', 'street', 'city', 'state', 'zip', 'country'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields before proceeding');
      return;
    }
    
    if (!formData.idDocument) {
      toast.error('Please upload your ID card before proceeding');
      return;
    }
    
    // Navigate to payment page with form data
    navigate('/ambassador/clearance-payment', { state: formData });
  };

  if (!ambassador) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">Please log in to complete your clearance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Clearance Form</h1>
          <p className="text-gray-600">Complete your ambassador clearance application</p>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Address Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Social Media Links</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://tiktok.com/@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://youtube.com/channel/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://facebook.com/username"
                />
              </div>
            </div>
          </div>

          {/* Audience & Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Content & Audience</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audience Size
                </label>
                <input
                  type="text"
                  name="audienceSize"
                  value={formData.audienceSize}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 10,000+ followers"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select content type</option>
                  <option value="fashion">Fashion</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="beauty">Beauty</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand Promotion & Collaborations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Brand Promotion & Collaborations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How do you intend to promote our brand outfits?
                </label>
                <textarea
                  name="promotionStrategy"
                  value={formData.promotionStrategy}
                  onChange={handleChange}
                  className="input-field"
                  rows={4}
                  placeholder="Describe your promotion strategy for our brand outfits (e.g., social media posts, fashion videos, styling tips, etc.)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Brand Collaborations?
                </label>
                <textarea
                  name="previousCollaborations"
                  value={formData.previousCollaborations}
                  onChange={handleChange}
                  className="input-field"
                  rows={4}
                  placeholder="List any previous brand collaborations you've worked with (e.g., fashion brands, beauty products, lifestyle brands, etc.)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Style
                </label>
                <select
                  name="contentStyle"
                  value={formData.contentStyle}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select content style</option>
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="high-fashion">High Fashion</option>
                  <option value="streetwear">Streetwear</option>
                  <option value="vintage">Vintage</option>
                  <option value="modern">Modern</option>
                  <option value="mixed">Mixed Style</option>
                </select>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Verification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SSN (for verification purposes only)
                </label>
                <input
                  type="text"
                  name="ssn"
                  value={formData.ssn}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="XXX-XX-XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Card Upload
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                  <input
                    type="file"
                    name="idDocument"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="id-upload"
                  />
                  <label
                    htmlFor="id-upload"
                    className="btn-secondary mt-4 cursor-pointer inline-block"
                  >
                    Choose File
                  </label>
                  {formData.idDocument && (
                    <p className="mt-2 text-sm text-green-600">
                      File selected: {formData.idDocument.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Additional Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Note
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="input-field"
                rows={3}
                placeholder="Any additional information you'd like to share"
              />
            </div>
          </div>

          {/* PROCEED TO SUBMIT Button */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center">
              <button
                type="button"
                onClick={handleProceedToSubmit}
                className="btn-primary bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                PROCEED TO SUBMIT
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Click to proceed to payment and submit your clearance application
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <Link
              to="/ambassador/dashboard"
              className="block mt-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowRight className="w-4 h-4 inline mr-1 rotate-180" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClearanceForm;
