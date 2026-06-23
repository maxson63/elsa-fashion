const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    console.log('Fetching products with query:', req.query);
    const { category, featured } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }
    
    const products = await Product.find(query);
    console.log('Products found:', products.length);
    
    // If no products found, return mock products as fallback
    if (products.length === 0) {
      console.log('No products in database, returning mock products');
      return res.json(getMockProducts(category, featured));
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock products on error
    console.log('Returning mock products due to error');
    res.json(getMockProducts(req.query.category, req.query.featured));
  }
});

// Mock products fallback
function getMockProducts(category, featured) {
  const mockProducts = [
    {
      _id: '1',
      name: 'Sophisticated Cocktail Dress',
      description: 'Elegant cocktail dress featuring a stunning silhouette perfect for evening events and special occasions',
      price: 349.99,
      image: "https://i.pinimg.com/736x/d2/8f/d4/d28fd455da16ff34650e398c22bf749e.jpg",
      category: 'formal',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black', 'Red', 'Navy'],
      featured: true,
      inStock: true,
      createdAt: new Date()
    },
    {
      _id: '2',
      name: 'Chic Urban Ensemble',
      description: 'Modern urban fashion piece that combines comfort with high-end style for the fashion-forward individual',
      price: 279.99,
      image: "https://tse3.mm.bing.net/th/id/OIP.nBsQXfEbJmpgOK_PU_oLGgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
      category: 'street',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Gray', 'Beige'],
      featured: true,
      inStock: true,
      createdAt: new Date()
    },
    {
      _id: '3',
      name: 'Elegant Summer Dress',
      description: 'Light and breezy summer dress with intricate details, perfect for garden parties and daytime events',
      price: 229.99,
      image: "https://tse1.mm.bing.net/th/id/OIP.GQwKlEsHSRu1VkJTzAhu3gHaKX?rs=1&pid=ImgDetMain&o=7&rm=3",
      category: 'casual',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Pastel Pink', 'Light Blue'],
      featured: true,
      inStock: true,
      createdAt: new Date()
    },
    {
      _id: '4',
      name: 'Professional Power Suit',
      description: 'Tailored power suit that commands attention in the boardroom while maintaining feminine elegance',
      price: 599.99,
      image: "https://www.hawtcelebs.com/wp-content/uploads/2017/10/elsa-hosk-out-and-about-in-new-york-10-22-2017-3.jpg",
      category: 'formal',
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'Navy', 'Charcoal'],
      featured: true,
      inStock: true,
      createdAt: new Date()
    },
    {
      _id: '5',
      name: 'Trendy Street Style Look',
      description: 'Bold street fashion statement piece that captures the latest urban trends with unique design elements',
      price: 189.99,
      image: "https://tse1.explicit.bing.net/th/id/OIP.q1z_lR_Rm_RePT9NU3dkJwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
      category: 'street',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Red'],
      featured: false,
      inStock: true,
      createdAt: new Date()
    },
    {
      _id: '6',
      name: 'High Fashion Editorial Piece',
      description: 'Runway-inspired fashion piece that brings high fashion to your everyday wardrobe with dramatic flair',
      price: 429.99,
      image: "https://fashionfav.com/wp-content/uploads/2022/10/Elsa-Hosk-by-Drew-Vickers-for-Helsa-Studio-2022-Ad-Campaign-5-800x1002.jpg",
      category: 'luxury',
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'White', 'Gold'],
      featured: true,
      inStock: true,
      createdAt: new Date()
    }
  ];
  
  let filtered = mockProducts;
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  if (featured === 'true') {
    filtered = filtered.filter(p => p.featured === true);
  }
  
  return filtered;
}

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create product (admin only)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

// Bulk insert products (admin only)
router.post('/bulk', async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    res.status(201).json({ 
      message: `Successfully added ${products.length} products`,
      products 
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating products', error: error.message });
  }
});

// Update category for multiple products (admin only)
router.post('/update-category', async (req, res) => {
  try {
    const { productNames, newCategory } = req.body;
    
    const result = await Product.updateMany(
      { name: { $in: productNames } },
      { category: newCategory }
    );
    
    res.json({ 
      message: `Successfully updated ${result.modifiedCount} products to category: ${newCategory}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product categories', error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;
