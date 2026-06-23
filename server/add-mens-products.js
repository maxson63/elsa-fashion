const https = require('https');

const mensProducts = [
  {
    name: "Sophisticated Men's Suit",
    description: "Premium tailored suit perfect for business meetings and formal events, featuring modern cut and premium fabric",
    price: 599.99,
    image: "https://tse4.mm.bing.net/th/id/OIP.COaykmyY-KlcF0xSEbj5BwHaNK?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "formal",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Charcoal"],
    featured: true,
    inStock: true
  },
  {
    name: "Casual Men's Street Wear",
    description: "Comfortable and stylish street wear ensemble perfect for everyday urban fashion and casual outings",
    price: 249.99,
    image: "https://tse4.mm.bing.net/th/id/OIP.mDHioaNOg7Xw9Zm9fgEAwQHaNJ?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "street",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Gray", "Navy"],
    featured: true,
    inStock: true
  },
  {
    name: "Elegant Men's Formal Attire",
    description: "Refined formal wear designed for special occasions, weddings, and black-tie events with impeccable tailoring",
    price: 449.99,
    image: "https://tse2.mm.bing.net/th/id/OIP.J7-ZZO0ZdyIlMglVtv2iuwHaNJ?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "formal",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"],
    featured: true,
    inStock: true
  },
  {
    name: "Modern Men's Business Casual",
    description: "Versatile business casual outfit that transitions seamlessly from office to evening engagements",
    price: 329.99,
    image: "https://tse2.mm.bing.net/th/id/OIP.DxHnxs2BXokd_eV15tDhcAHaJO?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Navy", "Gray"],
    featured: false,
    inStock: true
  },
  {
    name: "Luxury Men's Designer Jacket",
    description: "High-end designer jacket crafted from premium materials, perfect for making a fashion statement",
    price: 549.99,
    image: "https://tse1.mm.bing.net/th/id/OIP.0EzBjIReFXn7D3RnjNnn8gHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "luxury",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown", "Tan"],
    featured: true,
    inStock: true
  },
  {
    name: "Trendy Men's Urban Style",
    description: "Bold urban fashion piece that captures the latest street style trends with unique design elements",
    price: 289.99,
    image: "https://tse2.mm.bing.net/th/id/OIP.PPkmdYVgZ77GX9ClPzbYzgHaNK?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "street",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Red"],
    featured: false,
    inStock: true
  },
  {
    name: "Classic Men's Denim Ensemble",
    description: "Timeless denim outfit with modern styling, perfect for casual wear and weekend activities",
    price: 199.99,
    image: "https://tse1.explicit.bing.net/th/id/OIP.4jLlWst2DVfv4Iik1FoUegHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "casual",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Black", "Gray"],
    featured: false,
    inStock: true
  },
  {
    name: "Professional Men's Office Wear",
    description: "Sophisticated office attire designed for the modern professional, combining comfort with elegance",
    price: 379.99,
    image: "https://tse2.mm.bing.net/th/id/OIP.7b2S7_-hA5CcCuxwR5V4-wHaJQ?pid=ImgDet&w=474&h=592&rs=1&o=7&rm=3",
    category: "formal",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Charcoal", "Black"],
    featured: true,
    inStock: true
  },
  {
    name: "Creative Men's Fashion Piece",
    description: "Unique artistic design that stands out in any crowd, perfect for fashion-forward individuals",
    price: 329.99,
    image: "https://i.pinimg.com/736x/01/e5/d2/01e5d2c6e59feb46bf93f94be8f97b51.jpg",
    category: "creative",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi-color", "Black", "White"],
    featured: false,
    inStock: true
  },
  {
    name: "Premium Men's Outerwear",
    description: "High-quality outerwear piece that provides both style and functionality for cold weather",
    price: 459.99,
    image: "https://tse2.mm.bing.net/th/id/OIP.Qksntuztfik-g-Vuu-mQsgHaLH?w=640&h=960&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown", "Camel"],
    featured: true,
    inStock: true
  }
];

const postData = JSON.stringify(mensProducts);

const options = {
  hostname: 'elsa-fashion-backend.onrender.com',
  port: 443,
  path: '/api/products/bulk',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (res.statusCode === 201) {
        console.log('✅ Successfully added men\'s products to MongoDB!');
        console.log(response.message);
        console.log('\nAdded products:');
        response.products.forEach(product => {
          console.log(`- ${product.name} ($${product.price})`);
        });
      } else {
        console.error('❌ Error adding products:', response.message);
        if (response.error) console.error('Error details:', response.error);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Response data:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error calling API:', error.message);
});

req.write(postData);
req.end();
