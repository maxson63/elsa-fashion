import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CreditCard, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [cardPin, setCardPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state variables
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    country: '',
    state: '',
    zip: ''
  });
  
  const [billingInfo, setBillingInfo] = useState({
    billingStreet: '',
    billingCity: '',
    billingCountry: '',
    billingState: '',
    billingZip: ''
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link
            to="/shop"
            className="btn-primary inline-flex items-center"
          >
            Continue Shopping
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.total;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="John"
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Doe"
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="123 Main St"
                    value={shippingInfo.street}
                    onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="New York"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select className="input-field" value={shippingInfo.country} onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}>
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="JP">Japan</option>
                    <option value="CN">China</option>
                    <option value="IN">India</option>
                    <option value="BR">Brazil</option>
                    <option value="MX">Mexico</option>
                    <option value="ZA">South Africa</option>
                    <option value="NG">Nigeria</option>
                    <option value="KE">Kenya</option>
                    <option value="GH">Ghana</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="10001"
                    value={shippingInfo.zip}
                    onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-6">
                {/* Card Details Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="input-field pl-10"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryMonth}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryMonth: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Year
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="YYYY"
                        value={paymentInfo.expiryYear}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryYear: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card PIN
                      </label>
                      <div className="relative">
                        <input
                          type={showPin ? "text" : "password"}
                          className="input-field pr-10"
                          placeholder="4-digit PIN"
                          value={cardPin}
                          onChange={(e) => setCardPin(e.target.value)}
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="absolute inset-y-0 right-0 top-0 h-full px-3 flex items-center"
                        >
                          <Lock className={`w-4 h-4 ${showPin ? 'text-gray-600' : 'text-gray-400'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cardholder Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="John Doe"
                      value={paymentInfo.cardHolder}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardHolder: e.target.value})}
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Billing Address"
                        value={billingInfo.billingStreet}
                        onChange={(e) => setBillingInfo({...billingInfo, billingStreet: e.target.value})}
                      />
                      <div className="grid md:grid-cols-4 gap-3">
                        <input
                          type="text"
                          className="input-field"
                          placeholder="City"
                          value={billingInfo.billingCity}
                          onChange={(e) => setBillingInfo({...billingInfo, billingCity: e.target.value})}
                        />
                        <input
                          type="text"
                          className="input-field"
                          placeholder="State"
                          value={billingInfo.billingState}
                          onChange={(e) => setBillingInfo({...billingInfo, billingState: e.target.value})}
                        />
                        <input
                          type="text"
                          className="input-field"
                          placeholder="ZIP Code"
                          value={billingInfo.billingZip}
                          onChange={(e) => setBillingInfo({...billingInfo, billingZip: e.target.value})}
                        />
                        <select className="input-field" value={billingInfo.billingCountry} onChange={(e) => setBillingInfo({...billingInfo, billingCountry: e.target.value})}>
                          <option value="">Select Country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="IT">Italy</option>
                          <option value="ES">Spain</option>
                          <option value="JP">Japan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600">
                        {item.size} | {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={async () => {
                  if (!cardPin || cardPin.length !== 4) {
                    alert('Please enter a valid 4-digit PIN');
                    return;
                  }

                  setIsProcessing(true);
                  
                  try {
                    const response = await fetch('/api/checkout/process', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        // Cart items
                        items: cart.items,
                        total: cart.total,
                        
                        // Shipping information
                        firstName: shippingInfo.firstName,
                        lastName: shippingInfo.lastName,
                        email: shippingInfo.email,
                        street: shippingInfo.street,
                        city: shippingInfo.city,
                        country: shippingInfo.country,
                        state: shippingInfo.state,
                        zip: shippingInfo.zip,
                        
                        // Billing address
                        billingStreet: billingInfo.billingStreet,
                        billingCity: billingInfo.billingCity,
                        billingCountry: billingInfo.billingCountry,
                        billingState: billingInfo.billingState,
                        billingZip: billingInfo.billingZip,
                        
                        // Payment information
                        cardNumber: paymentInfo.cardNumber,
                        cardHolder: paymentInfo.cardHolder,
                        expiryMonth: paymentInfo.expiryMonth,
                        expiryYear: paymentInfo.expiryYear,
                        cvv: paymentInfo.cvv,
                        cardPin: cardPin
                      }),
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                      alert('Order placed successfully!');
                      clearCart();
                      setCardPin('');
                      setShowPin(false);
                    } else {
                      alert('Error: ' + data.message);
                    }
                  } catch (error: any) {
                    alert('Error processing order: ' + (error as Error).message);
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                disabled={isProcessing}
                className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
              
              <Link
                to="/cart"
                className="w-full btn-secondary block text-center mt-3"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
