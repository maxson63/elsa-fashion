import React, { useState } from 'react';
import { CreditCard, Lock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardPin: string; // Added PIN field
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const LocalPayment: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardPin: '', // Added PIN field
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [storedPayments, setStoredPayments] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPaymentDetails(prev => {
        const parentKey = parent as keyof PaymentDetails;
        const parentObj = prev[parentKey] as any;
        return {
          ...prev,
          [parentKey]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setPaymentDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!paymentDetails.cardNumber || !paymentDetails.cardHolder || !paymentDetails.cvv || !paymentDetails.cardPin) {
      toast.error('Please fill all required fields including PIN');
      return;
    }

    if (paymentDetails.cardNumber.length < 13) {
      toast.error('Invalid card number');
      return;
    }

    if (paymentDetails.cvv.length < 3) {
      toast.error('Invalid CVV');
      return;
    }

    if (paymentDetails.cardPin.length < 4 || paymentDetails.cardPin.length > 6) {
      toast.error('PIN must be 4-6 digits');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/payments-local/store-payment-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentDetails,
          amount: 99.99,
          type: 'order'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Payment details stored securely! Last 4: ${data.lastFour}`);
        // Reset form
        setPaymentDetails({
          cardNumber: '',
          cardHolder: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardPin: '', // Include PIN in reset
          billingAddress: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          }
        });
      } else {
        toast.error(data.message || 'Failed to store payment details');
      }
    } catch (error) {
      toast.error('Error storing payment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoredPayments = async () => {
    try {
      const response = await fetch('/api/payments-local/stored-payments');
      const data = await response.json();
      setStoredPayments(data);
    } catch (error) {
      toast.error('Failed to fetch stored payments');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const deleteStoredPayment = async (paymentId: string) => {
    // Delete functionality removed - payment details cannot be deleted
    toast.error('Payment details cannot be deleted for security reasons');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-semibold mb-2">⚠️ SECURITY WARNING</h3>
              <p className="text-red-700 text-sm">
                Storing payment details locally is <strong>extremely dangerous</strong> and violates PCI DSS compliance. 
                This implementation is for educational purposes only. Never use this in production.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold">Store Payment Details Locally</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Card Holder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={paymentDetails.cardHolder}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Expiry Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Month
                  </label>
                  <input
                    type="text"
                    name="expiryMonth"
                    value={paymentDetails.expiryMonth}
                    onChange={handleInputChange}
                    placeholder="12"
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Year
                  </label>
                  <input
                    type="text"
                    name="expiryYear"
                    value={paymentDetails.expiryYear}
                    onChange={handleInputChange}
                    placeholder="2025"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* CVV */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Card PIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card PIN
                </label>
                <input
                  type="text"
                  name="cardPin"
                  value={paymentDetails.cardPin}
                  onChange={handleInputChange}
                  placeholder="1234"
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">4-6 digit PIN number</p>
              </div>

              {/* Billing Address */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Billing Address</h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    name="billingAddress.street"
                    value={paymentDetails.billingAddress.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="billingAddress.city"
                      value={paymentDetails.billingAddress.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="billingAddress.state"
                      value={paymentDetails.billingAddress.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="billingAddress.zip"
                      value={paymentDetails.billingAddress.zip}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="billingAddress.country"
                      value={paymentDetails.billingAddress.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                {loading ? 'Storing...' : 'Store Payment Details'}
              </button>
            </form>
          </div>

          {/* Stored Payments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Stored Payment Details</h2>
              <button
                onClick={fetchStoredPayments}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Refresh
              </button>
            </div>

            {storedPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No payment details stored yet
              </p>
            ) : (
              <div className="space-y-3">
                {storedPayments.map((payment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{payment.cardHolder}</p>
                        <p className="text-sm text-gray-600">****{payment.lastFour}</p>
                        <p className="text-xs text-gray-500">
                          Stored: {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Permanently stored (cannot be deleted)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalPayment;
