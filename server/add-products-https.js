const https = require('https');
const http = require('http');

const newProducts = [
  {
    name: "Sophisticated Cocktail Dress",
    description: "Elegant cocktail dress featuring a stunning silhouette perfect for evening events and special occasions",
    price: 349.99,
    image: "https://i.pinimg.com/736x/d2/8f/d4/d28fd455da16ff34650e398c22bf749e.jpg",
    category: "formal",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Red", "Navy"],
    featured: true,
    inStock: true
  },
  {
    name: "Chic Urban Ensemble",
    description: "Modern urban fashion piece that combines comfort with high-end style for the fashion-forward individual",
    price: 279.99,
    image: "https://tse3.mm.bing.net/th/id/OIP.nBsQXfEbJmpgOK_PU_oLGgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "street",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Beige"],
    featured: true,
    inStock: true
  },
  {
    name: "Elegant Summer Dress",
    description: "Light and breezy summer dress with intricate details, perfect for garden parties and daytime events",
    price: 229.99,
    image: "https://tse1.mm.bing.net/th/id/OIP.GQwKlEsHSRu1VkJTzAhu3gHaKX?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "casual",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Pastel Pink", "Light Blue"],
    featured: true,
    inStock: true
  },
  {
    name: "Professional Power Suit",
    description: "Tailored power suit that commands attention in the boardroom while maintaining feminine elegance",
    price: 599.99,
    image: "https://www.hawtcelebs.com/wp-content/uploads/2017/10/elsa-hosk-out-and-about-in-new-york-10-22-2017-3.jpg",
    category: "formal",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Navy", "Charcoal"],
    featured: true,
    inStock: true
  },
  {
    name: "Trendy Street Style Look",
    description: "Bold street fashion statement piece that captures the latest urban trends with unique design elements",
    price: 189.99,
    image: "https://tse1.explicit.bing.net/th/id/OIP.q1z_lR_Rm_RePT9NU3dkJwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "street",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Red"],
    featured: false,
    inStock: true
  },
  {
    name: "High Fashion Editorial Piece",
    description: "Runway-inspired fashion piece that brings high fashion to your everyday wardrobe with dramatic flair",
    price: 429.99,
    image: "https://fashionfav.com/wp-content/uploads/2022/10/Elsa-Hosk-by-Drew-Vickers-for-Helsa-Studio-2022-Ad-Campaign-5-800x1002.jpg",
    category: "luxury",
    sizes: ["S", "M", "L"],
    colors: ["Black", "White", "Gold"],
    featured: true,
    inStock: true
  },
  {
    name: "Sophisticated Evening Wear",
    description: "Glamorous evening attire that exudes luxury and sophistication for red carpet events",
    price: 549.99,
    image: "https://tse1.explicit.bing.net/th/id/OIP.B8zMGuBwxAbsxzWfDJ43kgHaJ4?w=1536&h=2048&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "formal",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Emerald", "Ruby"],
    featured: true,
    inStock: true
  },
  {
    name: "Modern Minimalist Dress",
    description: "Clean lines and minimalist design create a timeless piece that transitions seamlessly from day to night",
    price: 259.99,
    image: "https://tse1.mm.bing.net/th/id/OIP.Hp4HUWxY45bIuzf1Kjg9mAHaNK?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "casual",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    featured: false,
    inStock: true
  },
  {
    name: "Bold Statement Coat",
    description: "Eye-catching outerwear piece that makes a powerful fashion statement while keeping you warm",
    price: 389.99,
    image: "https://holrmagazine.com/wp-content/uploads/2022/11/221117_Elsa_Hosk_Blue_nonex001-scaled.jpg",
    category: "casual",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Camel"],
    featured: true,
    inStock: true
  },
  {
    name: "Elegant Formal Gown",
    description: "Breathtaking formal gown with exquisite detailing, perfect for galas, weddings, and black-tie events",
    price: 699.99,
    image: "https://tse2.mm.bing.net/th/id/OIP.1DlKghG7N4gsxi1Qk31TwgHaJQ?w=1080&h=1350&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "formal",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Red", "Navy", "Champagne"],
    featured: true,
    inStock: true
  }
];

const postData = JSON.stringify(newProducts);

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
        console.log('✅ Successfully added products to MongoDB!');
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
