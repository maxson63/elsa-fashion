const https = require('https');

const bagsProducts = [
  {
    name: "Elegant Women's Designer Handbag",
    description: "Luxurious designer handbag crafted from premium leather, perfect for evening events and special occasions",
    price: 449.99,
    image: "https://tse2.mm.bing.net/th/id/OIP.kbP9JbAvspjVSDpawcyN3QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "luxury",
    sizes: ["M"],
    colors: ["Black", "Brown", "Tan"],
    featured: true,
    inStock: true
  },
  {
    name: "Chic Women's Tote Bag",
    description: "Stylish tote bag with ample storage space, perfect for work and everyday use",
    price: 189.99,
    image: "https://tse1.mm.bing.net/th/id/OIP.XkQvZNtBbVC_nUyy_oZIYAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "casual",
    sizes: ["M"],
    colors: ["Black", "Navy", "Gray"],
    featured: true,
    inStock: true
  },
  {
    name: "Classic Women's Leather Satchel",
    description: "Timeless leather satchel that combines elegance with functionality for the modern woman",
    price: 279.99,
    image: "https://m.media-amazon.com/images/I/71T8EVp49iL._AC_SL1500_.jpg",
    category: "formal",
    sizes: ["M"],
    colors: ["Brown", "Black", "Cognac"],
    featured: true,
    inStock: true
  },
  {
    name: "Trendy Women's Crossbody Bag",
    description: "Fashionable crossbody bag perfect for casual outings and weekend activities",
    price: 159.99,
    image: "https://tse3.mm.bing.net/th/id/OIP.BbRrEnkQLd-xePhnTir5RQHaHa?w=500&h=500&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "street",
    sizes: ["M"],
    colors: ["Black", "Red", "White"],
    featured: false,
    inStock: true
  },
  {
    name: "Luxury Women's Clutch Bag",
    description: "Elegant clutch bag perfect for evening events and formal occasions",
    price: 229.99,
    image: "https://tse1.explicit.bing.net/th/id/OIP.W2p27hCCkJQKTnv1QeUAkwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "luxury",
    sizes: ["M"],
    colors: ["Black", "Gold", "Silver"],
    featured: true,
    inStock: true
  },
  {
    name: "Casual Women's Shoulder Bag",
    description: "Comfortable shoulder bag with modern design, perfect for everyday use",
    price: 129.99,
    image: "https://th.bing.com/th/id/R.05c9bef624c37f35017e2637df49296b?rik=kKMLV7APcBIRhA&pid=ImgRaw&r=0",
    category: "casual",
    sizes: ["M"],
    colors: ["Beige", "Black", "Navy"],
    featured: false,
    inStock: true
  },
  {
    name: "Professional Men's Briefcase",
    description: "Classic briefcase designed for the modern professional, combining style with functionality",
    price: 349.99,
    image: "https://down-ph.img.susercontent.com/file/0aa5c735554d58934c4e989d7be6aacf",
    category: "formal",
    sizes: ["M"],
    colors: ["Black", "Brown", "Tan"],
    featured: true,
    inStock: true
  },
  {
    name: "Casual Men's Messenger Bag",
    description: "Versatile messenger bag perfect for work, travel, and everyday use",
    price: 199.99,
    image: "https://down-ph.img.susercontent.com/file/2a247b8c0e80ed5e1712fe068199bc3e",
    category: "casual",
    sizes: ["M"],
    colors: ["Black", "Gray", "Navy"],
    featured: true,
    inStock: true
  },
  {
    name: "Stylish Men's Backpack",
    description: "Modern backpack with premium materials, perfect for work and travel",
    price: 249.99,
    image: "https://i.pinimg.com/736x/57/13/52/5713522d4878ae78ebd3564138b3b23d.jpg",
    category: "street",
    sizes: ["M"],
    colors: ["Black", "Brown", "Olive"],
    featured: false,
    inStock: true
  },
  {
    name: "Luxury Men's Leather Duffle Bag",
    description: "Premium leather duffle bag perfect for weekend getaways and business travel",
    price: 499.99,
    image: "https://i.etsystatic.com/19372839/r/il/a86a59/2094553280/il_fullxfull.2094553280_79tg.jpg",
    category: "luxury",
    sizes: ["M"],
    colors: ["Brown", "Black", "Tan"],
    featured: true,
    inStock: true
  }
];

const postData = JSON.stringify(bagsProducts);

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
        console.log('✅ Successfully added bags to MongoDB!');
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
