const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Elegant Evening Gown",
    description: "Stunning floor-length gown perfect for formal events and special occasions",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97cc1b?w=400",
    category: "formal",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"],
    featured: true
  },
  {
    name: "Casual Street Wear Hoodie",
    description: "Comfortable and stylish hoodie perfect for everyday street fashion",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1556821840-fbf01c975c57?w=400",
    category: "street",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "White", "Navy"],
    featured: true
  },
  {
    name: "Luxury Silk Blazer",
    description: "Premium silk blazer that exudes sophistication and elegance",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    category: "luxury",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Charcoal"],
    featured: true
  },
  {
    name: "Creative Patterned Dress",
    description: "Unique artistic design that stands out in any crowd",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400",
    category: "creative",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Multi-color", "Blue", "Red"],
    featured: false
  },
  {
    name: "Casual Denim Jacket",
    description: "Classic denim jacket with modern styling",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1574265823198-475ebdfe0a3b?w=400",
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "White"],
    featured: false
  },
  {
    name: "Sophisticated Cocktail Dress",
    description: "Elegant cocktail dress featuring a stunning silhouette perfect for evening events and special occasions",
    price: 349.99,
    image: "https://i.pinimg.com/736x/d2/8f/d4/d28fd455da16ff34650e398c22bf749e.jpg",
    category: "formal",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Red", "Navy"],
    featured: true
  },
  {
    name: "Chic Urban Ensemble",
    description: "Modern urban fashion piece that combines comfort with high-end style for the fashion-forward individual",
    price: 279.99,
    image: "https://tse3.mm.bing.net/th/id/OIP.nBsQXfEbJmpgOK_PU_oLGgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "street",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Beige"],
    featured: true
  },
  {
    name: "Elegant Summer Dress",
    description: "Light and breezy summer dress with intricate details, perfect for garden parties and daytime events",
    price: 229.99,
    image: "https://tse1.mm.bing.net/th/id/OIP.GQwKlEsHSRu1VkJTzAhu3gHaKX?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "casual",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Pastel Pink", "Light Blue"],
    featured: true
  },
  {
    name: "Professional Power Suit",
    description: "Tailored power suit that commands attention in the boardroom while maintaining feminine elegance",
    price: 599.99,
    image: "https://www.hawtcelebs.com/wp-content/uploads/2017/10/elsa-hosk-out-and-about-in-new-york-10-22-2017-3.jpg",
    category: "formal",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Navy", "Charcoal"],
    featured: true
  },
  {
    name: "Trendy Street Style Look",
    description: "Bold street fashion statement piece that captures the latest urban trends with unique design elements",
    price: 189.99,
    image: "https://tse1.explicit.bing.net/th/id/OIP.q1z_lR_Rm_RePT9NU3dkJwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "street",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Red"],
    featured: false
  },
  {
    name: "High Fashion Editorial Piece",
    description: "Runway-inspired fashion piece that brings high fashion to your everyday wardrobe with dramatic flair",
    price: 429.99,
    image: "https://fashionfav.com/wp-content/uploads/2022/10/Elsa-Hosk-by-Drew-Vickers-for-Helsa-Studio-2022-Ad-Campaign-5-800x1002.jpg",
    category: "luxury",
    sizes: ["S", "M", "L"],
    colors: ["Black", "White", "Gold"],
    featured: true
  },
  {
    name: "Sophisticated Evening Wear",
    description: "Glamorous evening attire that exudes luxury and sophistication for red carpet events",
    price: 549.99,
    image: "https://tse1.explicit.bing.net/th/id/OIP.B8zMGuBwxAbsxzWfDJ43kgHaJ4?w=1536&h=2048&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "formal",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Emerald", "Ruby"],
    featured: true
  },
  {
    name: "Modern Minimalist Dress",
    description: "Clean lines and minimalist design create a timeless piece that transitions seamlessly from day to night",
    price: 259.99,
    image: "https://tse1.mm.bing.net/th/id/OIP.Hp4HUWxY45bIuzf1Kjg9mAHaNK?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "casual",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    featured: false
  },
  {
    name: "Bold Statement Coat",
    description: "Eye-catching outerwear piece that makes a powerful fashion statement while keeping you warm",
    price: 389.99,
    image: "https://holrmagazine.com/wp-content/uploads/2022/11/221117_Elsa_Hosk_Blue_nonex001-scaled.jpg",
    category: "outerwear",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Camel"],
    featured: true
  },
  {
    name: "Elegant Formal Gown",
    description: "Breathtaking formal gown with exquisite detailing, perfect for galas, weddings, and black-tie events",
    price: 699.99,
    image: "https://tse2.mm.bing.net/th/id/OIP.1DlKghG7N4gsxi1Qk31TwgHaJQ?w=1080&h=1350&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "formal",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Red", "Navy", "Champagne"],
    featured: true
  },
  {
    name: "Professional Business Suit",
    description: "Tailored suit perfect for business meetings and professional settings",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    category: "formal",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Charcoal", "Black"],
    featured: true
  },
  {
    name: "Street Fashion Cargo Pants",
    description: "Trendy cargo pants with multiple pockets and modern fit",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    category: "street",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Khaki", "Olive", "Navy"],
    featured: false
  },
  {
    name: "Luxury Cashmere Sweater",
    description: "Premium cashmere sweater for ultimate comfort and style",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
    category: "luxury",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Black", "Navy"],
    featured: true
  },
  {
    name: "Creative Artistic Top",
    description: "Unique design with artistic patterns and bold colors",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1515372039744-b8e02a5ae8b5?w=400",
    category: "creative",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Multi-color", "Purple", "Teal"],
    featured: false
  },
  {
    name: "Casual Cotton T-Shirt",
    description: "Comfortable everyday t-shirt with premium cotton",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6814f9a9df6f?w=400",
    category: "casual",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy", "Red"],
    featured: false
  }
];

// Add 20 more products to reach 30 total
const additionalProducts = [
  {
    name: "Evening Cocktail Dress",
    description: "Elegant cocktail dress for special occasions",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400",
    category: "formal",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red", "Black", "Navy"],
    featured: false
  },
  {
    name: "Street Style Bomber Jacket",
    description: "Modern bomber jacket with street fashion aesthetics",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1551698618-1d14e85baeb8?w=400",
    category: "street",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Green", "Orange", "Blue"],
    featured: false
  },
  {
    name: "Luxury Leather Handbag",
    description: "Premium leather handbag with elegant design",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "luxury",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    featured: true
  },
  {
    name: "Creative Bohemian Maxi Skirt",
    description: "Flowing bohemian skirt with artistic patterns",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1583496661160-fb5226d8a8d9?w=400",
    category: "creative",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Multi-color", "Earth Tones", "Blue"],
    featured: false
  },
  {
    name: "Casual Linen Shirt",
    description: "Breathable linen shirt perfect for warm weather",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1596755094512-f5e84b744f03?w=400",
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Beige", "Light Gray"],
    featured: false
  },
  {
    name: "Formal Tuxedo Set",
    description: "Complete tuxedo set for black tie events",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    category: "formal",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    featured: true
  },
  {
    name: "Street Fashion Sneakers",
    description: "Trendy sneakers with urban street style",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    category: "street",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Red", "Blue"],
    featured: false
  },
  {
    name: "Luxury Silk Scarf",
    description: "Elegant silk scarf with premium design",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1521287755597-e8c8b5c4d4e0?w=400",
    category: "luxury",
    sizes: ["One Size"],
    colors: ["Multi-color", "Solid Colors"],
    featured: false
  },
  {
    name: "Creative Patchwork Jeans",
    description: "Unique patchwork design jeans for artistic expression",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    category: "creative",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Multi-color"],
    featured: false
  },
  {
    name: "Casual Yoga Pants",
    description: "Comfortable yoga pants for active lifestyle",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    category: "casual",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy", "Purple"],
    featured: false
  },
  {
    name: "Formal Business Dress",
    description: "Professional dress suitable for office and meetings",
    price: 229.99,
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400",
    category: "formal",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "Burgundy"],
    featured: false
  },
  {
    name: "Street Style Baseball Cap",
    description: "Trendy cap with street fashion branding",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1574265823198-475ebdfe0a3b?w=400",
    category: "street",
    sizes: ["One Size"],
    colors: ["Black", "White", "Red", "Blue", "Green"],
    featured: false
  },
  {
    name: "Luxury Watch",
    description: "Elegant timepiece with premium materials",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category: "luxury",
    sizes: ["One Size"],
    colors: ["Gold", "Silver", "Rose Gold"],
    featured: true
  },
  {
    name: "Creative Tie-Dye Hoodie",
    description: "Artistic tie-dye pattern hoodie",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1556821840-fbf01c975c57?w=400",
    category: "creative",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi-color", "Pastel", "Neon"],
    featured: false
  },
  {
    name: "Casual Shorts Set",
    description: "Comfortable shorts set for casual wear",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Khaki", "Black", "Gray"],
    featured: false
  },
  {
    name: "Formal Evening Clutch",
    description: "Elegant clutch purse for formal events",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1584917865442-de9975a8cc10?w=400",
    category: "formal",
    sizes: ["One Size"],
    colors: ["Black", "Silver", "Gold", "Red"],
    featured: false
  },
  {
    name: "Street Fashion Backpack",
    description: "Urban backpack with street style design",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "street",
    sizes: ["One Size"],
    colors: ["Black", "Camo", "Navy", "Gray"],
    featured: false
  },
  {
    name: "Luxury Perfume Set",
    description: "Premium fragrance collection",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1528740560565-3f5e767bfa9b?w=400",
    category: "luxury",
    sizes: ["One Size"],
    colors: ["Various Scents"],
    featured: false
  },
  {
    name: "Creative Art Print T-Shirt",
    description: "T-shirt featuring unique artistic designs",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1521572163474-6814f9a9df6f?w=400",
    category: "creative",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Multi-color"],
    featured: false
  }
];

const allProducts = [...sampleProducts, ...additionalProducts];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elsa-fashionis');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    await Product.insertMany(allProducts);
    
    console.log('Database seeded successfully with 30 products!');
    console.log('Products by category:');
    
    const categories = ['casual', 'formal', 'street', 'luxury', 'creative'];
    for (const category of categories) {
      const count = await Product.countDocuments({ category });
      console.log(`${category}: ${count} products`);
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase();
