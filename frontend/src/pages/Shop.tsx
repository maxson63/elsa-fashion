import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  rating?: number;
  inStock?: boolean;
}

const Shop: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<{[key: string]: string}>({});
  const [selectedColors, setSelectedColors] = useState<{[key: string]: string}>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        console.log('Products fetched from API:', data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Size options for products
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

  // Color options for products
  const colorOptions = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#00FF00' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Pink', value: '#FFC0CB' }
  ];

  const categories = ['All', 'Clothing', 'Accessories', 'Shoes', 'Bags'];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => {
        if (selectedCategory === 'Clothing') {
          return product.category.includes('Evening Wear') || product.category.includes('Fashion') || product.category.includes('Luxury');
        } else if (selectedCategory === 'Accessories') {
          return product.category.includes('Accessories');
        } else if (selectedCategory === 'Shoes') {
          return product.category.includes('Footwear') || product.category.includes('Shoes');
        } else if (selectedCategory === 'Bags') {
          return product.category.includes('Bags') || product.category.includes('Handbag');
        }
        return false;
      });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Fashion Shop</h1>
            <Link to="/cart" className="flex items-center bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Category Filter - Mobile Friendly */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full whitespace-nowrap transition-colors text-sm sm:text-base flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">Loading products...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">No products available in {selectedCategory}</div>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Product Image - Mobile Optimized */}
                <div className="relative aspect-square sm:aspect-[4/3]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.rating && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>
                
                {/* Product Info - Mobile Optimized */}
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4">${product.price.toFixed(2)}</div>
                  
                  {/* Size Selection - Mobile Friendly */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size:</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {sizeOptions.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSizes({...selectedSizes, [product._id]: size})}
                          className={`px-2 py-1 sm:px-3 sm:py-1 border rounded-md text-xs sm:text-sm transition-colors ${
                            selectedSizes[product._id] === size
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection - Mobile Friendly */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColors({...selectedColors, [product._id]: color.name})}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all ${
                            selectedColors[product._id] === color.name
                              ? 'border-purple-600 scale-110 shadow-md'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart Button - Mobile Optimized */}
                  <button
                    onClick={() => {
                      if (!selectedSizes[product._id]) {
                        toast.error('Please select a size');
                        return;
                      }
                      if (!selectedColors[product._id]) {
                        toast.error('Please select a color');
                        return;
                      }
                      addItem({
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        size: selectedSizes[product._id],
                        color: selectedColors[product._id]
                      });
                      toast.success('Added to cart!');
                    }}
                    className="w-full bg-purple-600 text-white py-3 px-4 sm:py-3 sm:px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm sm:text-base flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
