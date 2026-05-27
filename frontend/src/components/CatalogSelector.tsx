import React, { useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  rating: number;
}

const CatalogSelector: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // 30-piece catalog data with real fashion images
  const catalogItems: CatalogItem[] = [
    // Dresses (8 items)
    { id: '1', name: 'Floral Summer Dress', category: 'Dresses', price: 89.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', description: 'Light and breezy floral print dress', colors: ['Pink', 'Blue', 'White'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.5 },
    { id: '2', name: 'Elegant Evening Gown', category: 'Dresses', price: 189.99, image: 'https://celebmafia.com/wp-content/uploads/2024/02/elsa-hosk-outfit-02-07-2024-6.jpg', description: 'Sophisticated evening gown for special occasions', colors: ['Black', 'Red', 'Navy'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.8 },
    { id: '3', name: 'Casual Sundress', category: 'Dresses', price: 59.99, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', description: 'Comfortable sundress for everyday wear', colors: ['Yellow', 'Green', 'Orange'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.2 },
    { id: '4', name: 'Business Midi Dress', category: 'Dresses', price: 129.99, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop', description: 'Professional midi dress for work', colors: ['Gray', 'Black', 'Navy'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.6 },
    { id: '5', name: 'Boho Maxi Dress', category: 'Dresses', price: 79.99, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop', description: 'Bohemian style maxi dress', colors: ['Brown', 'Cream', 'Burgundy'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.4 },
    { id: '6', name: 'Cocktail Party Dress', category: 'Dresses', price: 149.99, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop', description: 'Stunning cocktail dress for parties', colors: ['Gold', 'Silver', 'Rose Gold'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.7 },
    { id: '7', name: 'Vintage Tea Dress', category: 'Dresses', price: 99.99, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop', description: 'Retro-inspired tea dress', colors: ['Lavender', 'Mint', 'Peach'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.3 },
    { id: '8', name: 'Beach Cover-up Dress', category: 'Dresses', price: 49.99, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', description: 'Light cover-up for beach days', colors: ['White', 'Blue', 'Turquoise'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.1 },

    // Tops (8 items)
    { id: '9', name: 'Silk Blouse', category: 'Tops', price: 79.99, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop', description: 'Elegant silk blouse', colors: ['White', 'Black', 'Ivory'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.6 },
    { id: '10', name: 'Casual T-Shirt', category: 'Tops', price: 29.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop', description: 'Comfortable everyday t-shirt', colors: ['Gray', 'Navy', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.0 },
    { id: '11', name: 'Crop Top', category: 'Tops', price: 39.99, image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=800&fit=crop', description: 'Trendy crop top', colors: ['Pink', 'Black', 'White'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.3 },
    { id: '12', name: 'Button-Up Shirt', category: 'Tops', price: 69.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop', description: 'Classic button-up shirt', colors: ['Blue', 'White', 'Striped'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.5 },
    { id: '13', name: 'Off-Shoulder Top', category: 'Tops', price: 49.99, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop', description: 'Stylish off-shoulder design', colors: ['Red', 'Black', 'White'], sizes: ['S', 'M', 'L', 'XL'], rating: 4.4 },
    { id: '14', name: 'Linen Tank Top', category: 'Tops', price: 34.99, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop', description: 'Breathable linen tank', colors: ['Natural', 'Olive', 'Beige'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.2 },
    { id: '15', name: 'Wrap Top', category: 'Tops', price: 59.99, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop', description: 'Flattering wrap-style top', colors: ['Floral', 'Solid', 'Striped'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.6 },
    { id: '16', name: 'Polo Shirt', category: 'Tops', price: 54.99, image: 'https://images.unsplash.com/photo-1625910513413-5fc4e5e39f0f?w=600&h=800&fit=crop', description: 'Classic polo shirt', colors: ['Navy', 'White', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.1 },

    // Bottoms (7 items)
    { id: '17', name: 'High-Waist Jeans', category: 'Bottoms', price: 89.99, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop', description: 'Classic high-waist jeans', colors: ['Blue', 'Black', 'Light Blue'], sizes: ['24', '26', '28', '30', '32'], rating: 4.5 },
    { id: '18', name: 'Pleated Skirt', category: 'Bottoms', price: 69.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj9b?w=600&h=800&fit=crop', description: 'Elegant pleated skirt', colors: ['Black', 'Gray', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.4 },
    { id: '19', name: 'Wide-Leg Pants', category: 'Bottoms', price: 79.99, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop', description: 'Comfortable wide-leg pants', colors: ['Black', 'Khaki', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.3 },
    { id: '20', name: 'Midi Skirt', category: 'Bottoms', price: 59.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj9b?w=600&h=800&fit=crop', description: 'Versatile midi skirt', colors: ['Floral', 'Solid', 'Polka Dot'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.6 },
    { id: '21', name: 'Cargo Pants', category: 'Bottoms', price: 74.99, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop', description: 'Utility cargo pants', colors: ['Olive', 'Black', 'Khaki'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.2 },
    { id: '22', name: 'Pencil Skirt', category: 'Bottoms', price: 64.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj9b?w=600&h=800&fit=crop', description: 'Professional pencil skirt', colors: ['Black', 'Gray', 'Navy'], sizes: ['XS', 'S', 'M', 'L'], rating: 4.5 },
    { id: '23', name: 'Shorts', category: 'Bottoms', price: 44.99, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop', description: 'Casual shorts', colors: ['Denim', 'Khaki', 'Black'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.0 },

    // Outerwear (4 items)
    { id: '24', name: 'Denim Jacket', category: 'Outerwear', price: 99.99, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=800&fit=crop', description: 'Classic denim jacket', colors: ['Blue', 'Black', 'Light Wash'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.6 },
    { id: '25', name: 'Leather Jacket', category: 'Outerwear', price: 199.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop', description: 'Edgy leather jacket', colors: ['Black', 'Brown', 'Burgundy'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.8 },
    { id: '26', name: 'Trench Coat', category: 'Outerwear', price: 149.99, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop', description: 'Timeless trench coat', colors: ['Beige', 'Black', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.7 },
    { id: '27', name: 'Bomber Jacket', category: 'Outerwear', price: 89.99, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop', description: 'Sporty bomber jacket', colors: ['Green', 'Black', 'Navy'], sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.4 },

    // Accessories (3 items)
    { id: '28', name: 'Designer Handbag', category: 'Accessories', price: 129.99, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop', description: 'Luxury designer handbag', colors: ['Black', 'Brown', 'Tan'], sizes: ['One Size'], rating: 4.8 },
    { id: '29', name: 'Silk Scarf', category: 'Accessories', price: 39.99, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop', description: 'Elegant silk scarf', colors: ['Multi', 'Solid', 'Printed'], sizes: ['One Size'], rating: 4.3 },
    { id: '30', name: 'Statement Belt', category: 'Accessories', price: 49.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop', description: 'Fashion statement belt', colors: ['Black', 'Brown', 'Gold'], sizes: ['S', 'M', 'L'], rating: 4.5 }
  ];

  const categories = ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = selectedCategory === 'All' 
    ? catalogItems 
    : catalogItems.filter(item => item.category === selectedCategory);

  const toggleSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else if (selectedItems.length < 3) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      toast.error('You can only select 3 items');
    }
  };

  const handleSubmit = () => {
    if (selectedItems.length !== 3) {
      toast.error('Please select exactly 3 items');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSelection = () => {
    const selectedCatalogItems = catalogItems.filter(item => selectedItems.includes(item.id));
    console.log('Selected items:', selectedCatalogItems);
    toast.success('Your 3 free outfits have been selected successfully!');
    setShowConfirmation(false);
    setSelectedItems([]);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Your 3 Free Outfits</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Choose exactly 3 items from our 30-piece catalog. These are yours to keep for promotional content!
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-purple-600">
              Selected: {selectedItems.length}/3
            </span>
            <button
              onClick={handleSubmit}
              disabled={selectedItems.length !== 3}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-8 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
              selectedItems.includes(item.id)
                ? 'border-purple-600 shadow-lg'
                : 'border-gray-200'
            }`}
            onClick={() => toggleSelection(item.id)}
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {selectedItems.includes(item.id) && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-xs font-medium text-gray-700">{item.category}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              
              <div className="flex items-center mb-2">
                {renderStars(item.rating)}
                <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-purple-600">${item.price}</span>
                <span className="text-xs text-gray-500 line-through">${(item.price * 1.5).toFixed(2)}</span>
              </div>
              
              <div className="text-xs text-gray-600">
                <div className="mb-1">Colors: {item.colors.join(', ')}</div>
                <div>Sizes: {item.sizes.join(', ')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedItems.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-purple-900 mb-2">Your Selection ({selectedItems.length}/3)</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {selectedItems.map(itemId => {
              const item = catalogItems.find(i => i.id === itemId);
              return item ? (
                <div key={item.id} className="flex items-center space-x-3 bg-white rounded-lg p-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(item.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Your Selection</h3>
            <p className="text-gray-600 mb-4">
              You've selected 3 items for your free outfit package. These will be shipped to you for promotional content creation.
            </p>
            <div className="space-y-2 mb-4">
              {selectedItems.map(itemId => {
                const item = catalogItems.find(i => i.id === itemId);
                return item ? (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-purple-600 font-bold">FREE</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmSelection}
                className="btn-primary flex-1"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogSelector;
