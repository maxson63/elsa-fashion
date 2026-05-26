import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle, LogOut, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeliveryStatus {
  orderId: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  trackingNumber: string;
  currentLocation: string;
  updates: Array<{
    timestamp: string;
    status: string;
    location: string;
    description: string;
  }>;
  orderDetails: {
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    orderDate: string;
  };
}

const DeliveryTracking: React.FC = () => {
  const [deliveryData, setDeliveryData] = useState<DeliveryStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const fetchDeliveryData = async () => {
    const userToken = localStorage.getItem('userToken');
    const userData = localStorage.getItem('user');
    
    if (!userToken || !userData) {
      toast.error('Please login to track your delivery');
      navigate('/user/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      const response = await fetch(`/api/users/${user.email}/deliveries`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch delivery data');
      }

      const data = await response.json();
      
      // Handle the response structure - backend returns deliveries array
      if (data.deliveries && data.deliveries.length > 0) {
        setDeliveryData(data.deliveries[0]); // Take the first delivery
      } else {
        setDeliveryData(null);
      }
    } catch (error: any) {
      console.error('Error fetching delivery data:', error);
      toast.error(error.message || 'Failed to load delivery information');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveryData();
    setRefreshing(false);
    toast.success('Delivery status updated');
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'out_for_delivery':
        return <MapPin className="w-5 h-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery information...</p>
        </div>
      </div>
    );
  }

  if (!deliveryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Delivery Information</h2>
          <p className="text-gray-600 mb-6">You don't have any active deliveries at the moment.</p>
          <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Delivery Tracking</h1>
              <p className="text-gray-600 mt-1">Track your package delivery status</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(deliveryData.status)}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{deliveryData.orderId}</h2>
                <p className="text-gray-600">Tracking Number: {deliveryData.trackingNumber}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deliveryData.status)}`}>
                {deliveryData.status ? deliveryData.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                Est. Delivery: {new Date(deliveryData.estimatedDelivery).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Progress</h3>
          <div className="space-y-4">
            {deliveryData.updates.map((update, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(update.status)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{update.status ? update.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}</p>
                      <p className="text-gray-600">{update.description}</p>
                      <p className="text-sm text-gray-500">{update.location}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(update.timestamp).toLocaleDateString()} {new Date(update.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
          <div className="space-y-4">
            <div className="border-t pt-4">
              <div className="space-y-2">
                {deliveryData.orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-gray-900">Total</p>
                  <p className="text-lg font-semibold text-gray-900">${deliveryData.orderDetails.total.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Order Date: {new Date(deliveryData.orderDetails.orderDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
