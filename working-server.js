const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://ingrid-unbriefed-mundanely.ngrok-free.dev'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock products data - all outfits deleted
const mockProducts = [
  {
    id: 1,
    name: "Elegant Woman's Suit",
    price: 700,
    description: "Sophisticated woman's suit featuring impeccable tailoring and premium fabric construction. This professional ensemble showcases contemporary elegance with classic design elements, perfect for making a powerful impression in business and formal settings. The luxurious materials drape beautifully, creating a confident silhouette that commands respect with refined sophistication. Ideal for corporate meetings, professional events, and formal occasions where elegance and authority are essential. This suit embodies the perfect balance between professional polish and modern fashion sensibility, ensuring you radiate confidence and success throughout your day. The versatile design transitions seamlessly from office hours to evening engagements, making it an indispensable addition to any woman's professional wardrobe.",
    image: "https://tse1.mm.bing.net/th/id/OIP.pMl9VILFptjMmTzbVjRk5wHaKX?pid=ImgDet&w=474&h=663&rs=1&o=7&rm=3",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy"],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: 2,
    name: "Luxury Fashion Ensemble",
    price: 680,
    description: "Exquisite fashion ensemble showcasing contemporary design with premium materials. This stunning piece features meticulous craftsmanship and attention to detail, perfect for fashion-forward individuals who appreciate sophisticated style. The versatile design transitions seamlessly from day to evening wear, making it a must-have addition to your luxury wardrobe.",
    image: "https://i.dailymail.co.uk/1s/2022/11/19/15/64711341-11445991-Supermodel_and_super_marketer_Hosk_donned_a_second_Helsa_outfit_-a-27_1668872051192.jpg",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Cream", "Rose Gold"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: 3,
    name: "Sophisticated Designer Dress",
    price: 780,
    description: "Elevate your wardrobe with this breathtaking designer dress that embodies modern elegance and refined sophistication. Featuring a flawless silhouette with premium fabric construction, this piece showcases exceptional tailoring and attention to every detail. Perfect for high-profile events, exclusive gatherings, and moments when you want to make an unforgettable impression. The design harmoniously blends contemporary fashion trends with timeless grace.",
    image: "https://tse3.mm.bing.net/th/id/OIP.YzFeEQQ9Lf2l_kArDar3YQHaIs?pid=ImgDet&w=474&h=556&rs=1&o=7&rm=3",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Navy", "Burgundy", "Emerald", "Classic Black"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 156
  },
  {
    id: 4,
    name: "Trendy Slouchy Cargo Pants",
    price: 880,
    description: "Make a bold fashion statement with these ultra-stylish slouchy cargo pants that perfectly blend contemporary street style with luxury fashion. Featuring an innovative design with premium fabric construction, these pants offer both exceptional comfort and high-fashion appeal. The relaxed silhouette creates an effortlessly chic look while the detailed cargo pockets add functional sophistication. Perfect for fashion influencers, trendsetters, and those who dare to stand out from the crowd with confidence and style.",
    image: "https://images.hellomagazine.com/horizon/original_aspect_ratio/1d5c9f49ce2d-elsa-hosk-slouchy-cargo-pants-z.jpg",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Olive Green", "Khaki", "Black", "Navy", "Stone"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: 5,
    name: "Chic Fashion Forward Outfit",
    price: 500,
    description: "Discover the perfect fusion of contemporary style and everyday elegance with this fashion-forward ensemble. Designed for the modern individual who values both comfort and sophistication, this piece features innovative tailoring and premium materials that create a stunning silhouette. The versatile design makes it ideal for various occasions, from casual outings to semi-formal events. Experience the confidence that comes with wearing a thoughtfully crafted outfit that speaks to your unique sense of style and fashion sensibility.",
    image: "https://i.pinimg.com/736x/c9/ed/aa/c9edaa4b31005303ebd933f5b00fc83a.jpg",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige", "Black", "Navy", "Gray", "White"],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 178
  },
  {
    id: 6,
    name: "Elegant Designer Outfit",
    price: 600,
    description: "Sophisticated designer outfit that embodies contemporary elegance with timeless appeal, perfect for the fashion-conscious individual who values both style and versatility. This stunning ensemble features premium construction with meticulous attention to detail, showcasing exceptional craftsmanship and design excellence. The silhouette creates a flattering, refined profile while the luxurious materials ensure both comfort and durability. Perfect for business meetings, social gatherings, or special occasions where making an elegant impression is essential. This versatile outfit transitions seamlessly from professional settings to evening engagements, complementing both formal and casual occasions with its sophisticated design and understated luxury.",
    image: "https://i.pinimg.com/736x/17/19/fb/1719fb618b162a3fb7979563a204d6b0.jpg",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Classic Black", "Navy Blue", "Charcoal Gray", "Burgundy", "Cream"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 195
  },
  {
    id: 7,
    name: "Exclusive High Fashion Ensemble",
    price: 1100,
    description: "Indulge in the epitome of luxury fashion with this exclusive high-fashion ensemble that represents the pinnacle of sophisticated design and impeccable craftsmanship. This masterpiece showcases avant-garde styling combined with timeless elegance, featuring premium materials sourced from the finest suppliers worldwide. The intricate design elements and meticulous attention to detail create a truly breathtaking silhouette that commands attention and admiration. Perfect for red carpet events, exclusive galas, and moments when only the most extraordinary fashion statement will suffice. This investment piece transcends seasonal trends, offering enduring style and unparalleled quality that defines true luxury.",
    image: "https://i.pinimg.com/originals/51/ec/eb/51eceb8d2f04e68ce2cb0b696466fae6.jpg",
    category: "Haute Couture",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum White", "Royal Blue", "Ruby Red"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 312
  },
  {
    id: 8,
    name: "Supreme Luxury Fashion Masterpiece",
    price: 1300,
    description: "Experience the absolute zenith of fashion excellence with this supreme luxury masterpiece that defines the pinnacle of haute couture artistry. This extraordinary creation represents the culmination of decades of fashion innovation, featuring revolutionary design elements that challenge conventional boundaries while celebrating the essence of sophisticated elegance. Crafted with materials of unparalleled rarity and quality, each element has been meticulously perfected by master artisans who dedicate countless hours to achieving flawless execution. The silhouette transcends mere clothing to become wearable art, commanding attention with its bold yet refined presence. This investment piece is destined for fashion connoisseurs who understand that true luxury lies not just in price, but in the transformative power of exceptional design that elevates the wearer to iconic status. Perfect for the most exclusive international events, where only the extraordinary will suffice.",
    image: "https://i.pinimg.com/originals/fe/6e/ac/fe6eace10165089dee6b928de169ca48.jpg",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Obsidian Black", "Ivory White", "Sapphire Blue", "Emerald Green", "Ruby Red"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 428
  },
  {
    id: 9,
    name: "Elegant Sophisticated Fashion Piece",
    price: 800,
    description: "Discover the perfect harmony of elegance and contemporary design with this sophisticated fashion piece that embodies refined luxury and modern sophistication. Featuring an exquisite silhouette with meticulous attention to detail, this creation showcases premium fabric construction and innovative tailoring techniques. The design elements seamlessly blend classic elegance with modern fashion sensibilities, creating a versatile piece that transitions effortlessly from day to evening wear. Perfect for fashion enthusiasts who appreciate understated luxury and timeless style, this piece offers exceptional comfort while maintaining a polished, refined appearance. Ideal for business meetings, social events, and special occasions where sophisticated elegance is essential.",
    image: "https://tse2.mm.bing.net/th/id/OIP.JQsqGfTswoBPVTEm35BGZwHaMv?w=736&h=1266&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Elegant Fashion",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Classic Black", "Navy Blue", "Charcoal Gray", "Burgundy", "Forest Green"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 267
  },
  {
    id: 10,
    name: "Magnificent High Fashion Creation",
    price: 1100,
    description: "Embrace the extraordinary with this magnificent high-fashion creation that represents the pinnacle of contemporary luxury design. This breathtaking ensemble showcases revolutionary styling combined with timeless elegance, featuring premium materials of exceptional quality and craftsmanship. The innovative design elements create a striking silhouette that commands attention while maintaining sophisticated refinement. Each detail has been meticulously perfected by master artisans who understand that true luxury lies in the perfect balance of bold expression and understated elegance. This investment piece is designed for fashion visionaries who dare to make unforgettable statements at the world's most prestigious events. The versatile design transitions seamlessly from exclusive daytime engagements to glamorous evening affairs, ensuring you radiate confidence and sophistication in every setting. Perfect for international fashion weeks, red carpet premieres, and moments when only extraordinary fashion will suffice.",
    image: "https://th.bing.com/th/id/R.5fd93c2e8bb1eba812cca755389905f3?rik=M94Mq%2bvuBGsibQ&riu=http%3a%2f%2fwww.starstyle.com%2fwp-content%2fuploads%2felsa-hosk%2f625302.jpg&ehk=pbXdUxsIw0mLJuLWI33Um5eFEJd6cteYFFrbxttny%2fs%3d&risl=&pid=ImgRaw&r=0",
    category: "High Fashion",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum Silver", "Royal Purple", "Champagne Gold", "Crimson Red"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 389
  },
  {
    id: 11,
    name: "Stunning Fashion Masterpiece",
    price: 900,
    description: "Captivate the fashion world with this stunning masterpiece that embodies the perfect fusion of contemporary elegance and bold artistic expression. This extraordinary creation features innovative design elements that push the boundaries of conventional fashion while maintaining timeless sophistication. The silhouette showcases exceptional tailoring with premium fabric construction that drapes beautifully and moves with grace. Each detail has been thoughtfully considered by master designers who understand that true fashion excellence lies in the balance between striking visual impact and wearable elegance. This versatile piece transitions seamlessly from professional settings to glamorous evening affairs, making it an essential addition to any discerning fashion collection. Perfect for fashion-forward individuals who appreciate both artistic expression and practical sophistication, this creation ensures you'll make a memorable impression wherever you go.",
    image: "https://i.pinimg.com/736x/ca/c2/11/cac211b5a3b8a9115b8c7f157f2835a0.jpg",
    category: "Fashion Masterpiece",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Jet Black", "Pearl White", "Rose Gold", "Sapphire Blue", "Emerald Green"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 298
  },
  {
    id: 12,
    name: "Urban Street Style Fashion",
    price: 780,
    description: "Trendy casual wear for everyday fashion. Explore this modern street style collection that combines urban aesthetics with contemporary fashion. Perfect for fashion-forward individuals who want to make a statement with their daily wear. This versatile piece features premium materials and exceptional craftsmanship, designed to transition seamlessly from casual outings to social events. The innovative design captures the essence of modern street culture while maintaining sophisticated appeal.",
    image: "https://i.pinimg.com/736x/e6/15/03/e615030429fdbaf6ae9ada1a162fa174.jpg",
    category: "Clothing",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Gray", "Navy", "Olive", "White"],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 203
  },
  {
    id: 13,
    name: "Luxury Essentials",
    price: 1000,
    description: "Premium pieces that define elegance. Discover our luxury essentials collection featuring timeless designs and exceptional craftsmanship. Each piece represents the pinnacle of sophisticated design with premium materials sourced from the world's finest suppliers. This collection embodies perfect harmony between bold artistic expression and refined sophistication, creating a breathtaking presence that commands attention and admiration. Perfect for the most exclusive events and moments when only extraordinary fashion will suffice.",
    image: "https://tse1.explicit.bing.net/th/id/OIP.X9u1R5udKcsMe8ozsjZ2qQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Premium Collection",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum White", "Royal Blue", "Ruby Red", "Emerald Green"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 456
  },
  {
    id: 14,
    name: "Ultimate Couture Masterpiece",
    price: 2000,
    description: "Ascend to the absolute pinnacle of fashion excellence with this ultimate couture masterpiece that represents the zenith of luxury design and artistic expression. This extraordinary creation embodies the culmination of generations of fashion mastery, featuring revolutionary design elements that redefine the boundaries of haute couture. Crafted with materials of unparalleled rarity and exquisite quality, each element has been meticulously perfected by master artisans who dedicate their entire lives to achieving flawless execution. The silhouette transcends mere fashion to become wearable art that commands reverence and admiration in every setting. This investment piece is designed for the world's most discerning fashion connoisseurs who understand that true luxury lies not just in price, but in the transformative power of exceptional design that elevates the wearer to legendary status. Perfect for the most exclusive international events, royal ceremonies, and moments when only the absolute extraordinary will suffice. This creation is destined to become a timeless heirloom that transcends fashion trends to become an iconic symbol of ultimate sophistication and unparalleled elegance.",
    image: "https://tse1.mm.bing.net/th/id/OIP.putbwjQJMOZx_AlF0lVC2QHaLj?pid=ImgDet&w=474&h=739&rs=1&o=7&rm=3",
    category: "Ultimate Couture",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum White", "Royal Blue", "Ruby Red", "Emerald Green", "Gold"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 687
  },
  {
    id: 15,
    name: "Exquisite Fashion Creation",
    price: 900,
    description: "Discover the perfect embodiment of contemporary elegance with this exquisite fashion creation that captures the essence of sophisticated style and artistic expression. This stunning piece features innovative design elements that blend modern aesthetics with timeless sophistication, creating a silhouette that commands attention while maintaining graceful refinement. The premium fabric construction drapes beautifully, moving with fluid elegance that enhances the wearer's natural poise and confidence. Each detail has been meticulously crafted by master designers who understand that true fashion excellence lies in the perfect balance between visual impact and wearable comfort. This versatile creation transitions seamlessly from professional engagements to social occasions, making it an essential addition to any discerning wardrobe. Perfect for fashion enthusiasts who appreciate both contemporary design and classic elegance, this piece ensures you'll radiate sophistication and style in every setting. Ideal for business meetings, cultural events, and moments when you want to make a lasting impression with effortless grace.",
    image: "https://i.pinimg.com/originals/54/35/60/543560ad6e92dbe3cfd491fba839eccc.jpg",
    category: "Exquisite Fashion",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Classic Black", "Navy Blue", "Burgundy", "Forest Green", "Charcoal Gray"],
    inStock: true,
    rating: 4.9,
    reviews: 342
  },
  {
    id: 17,
    name: "Magnificent Couture Creation",
    price: 950,
    description: "Embrace the extraordinary with this magnificent couture creation that represents the pinnacle of sophisticated design and artistic expression. This breathtaking ensemble showcases revolutionary styling combined with timeless elegance, featuring premium materials of exceptional quality and craftsmanship. The innovative design elements create a striking silhouette that commands attention while maintaining sophisticated refinement. Each detail has been meticulously perfected by master artisans who understand that true luxury lies in the perfect balance of bold expression and understated elegance. This investment piece is designed for fashion visionaries who dare to make unforgettable statements at the world's most prestigious events. The versatile design transitions seamlessly from exclusive daytime engagements to glamorous evening affairs, ensuring you radiate confidence and sophistication in every setting. Perfect for international fashion weeks, red carpet premieres, and moments when only extraordinary fashion will suffice.",
    image: "https://tse3.mm.bing.net/th/id/OIP.MzSDndINoO7k82pFGZ8h0wHaLH?w=500&h=750&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Magnificent Couture",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum White", "Royal Blue", "Ruby Red", "Emerald Green", "Gold"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 518
  },
  {
    id: 18,
    name: "Supreme Couture Masterpiece",
    price: 2900,
    description: "Ascend to the absolute zenith of fashion excellence with this supreme couture masterpiece that represents the pinnacle of luxury design and artistic expression. This extraordinary creation embodies the culmination of generations of fashion mastery, featuring revolutionary design elements that transcend conventional boundaries while celebrating the essence of timeless elegance. Crafted with materials of unparalleled rarity and exquisite quality, each element has been meticulously perfected by master artisans who dedicate their entire lives to achieving flawless execution. The silhouette transcends mere fashion to become wearable art that commands reverence and admiration in every setting. This investment piece is designed for the world's most discerning fashion connoisseurs who understand that true luxury lies not just in price, but in the transformative power of exceptional design that elevates the wearer to legendary status. Perfect for the most exclusive international events, royal ceremonies, and moments when only the absolute extraordinary will suffice. This creation is destined to become a timeless heirloom that transcends fashion trends to become an iconic symbol of ultimate sophistication and unparalleled elegance.",
    image: "https://tse1.explicit.bing.net/th/id/OIP.J4OznJhK3vcBcyQLKqa3HAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Supreme Couture",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum White", "Royal Blue", "Ruby Red", "Emerald Green", "Gold"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 892
  },
  {
    id: 19,
    name: "Elegant Sophisticated Ensemble",
    price: 1400,
    description: "Discover the perfect embodiment of contemporary elegance with this sophisticated ensemble that captures the essence of refined style and artistic expression. This stunning piece features innovative design elements that blend modern aesthetics with timeless sophistication, creating a silhouette that commands attention while maintaining graceful refinement. The premium fabric construction drapes beautifully, moving with fluid elegance that enhances the wearer's natural poise and confidence. Each detail has been meticulously crafted by master designers who understand that true fashion excellence lies in the perfect balance between visual impact and wearable comfort. This versatile creation transitions seamlessly from professional engagements to social occasions, making it an essential addition to any discerning wardrobe. Perfect for fashion enthusiasts who appreciate both contemporary design and classic elegance, this piece ensures you'll radiate sophistication and style in every setting. Ideal for business meetings, cultural events, and moments when you want to make a lasting impression with effortless grace.",
    image: "https://www.styleatacertainage.com/wp-content/uploads/2022/02/00000129.jpg",
    category: "Elegant Sophisticated",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Classic Black", "Navy Blue", "Burgundy", "Forest Green", "Charcoal Gray"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 634
  },
  {
    id: 20,
    name: "Luxury Cowl Corset Masterpiece",
    price: 1900,
    description: "Experience the epitome of sophisticated glamour with this luxury cowl corset masterpiece that represents the pinnacle of contemporary couture design. This breathtaking creation features an innovative cowl neckline combined with a structured corset bodice, creating a silhouette that perfectly balances sensual elegance with refined sophistication. The premium fabric construction drapes with fluid grace, while the corset detailing provides exceptional structure and support, enhancing the wearer's natural curves with artistic precision. Each element has been meticulously crafted by master artisans who understand that true luxury lies in the perfect fusion of comfort and couture excellence. This versatile masterpiece transitions seamlessly from exclusive evening events to sophisticated social occasions, making it an essential addition to any discerning fashion collection. Perfect for fashion connoisseurs who appreciate both dramatic impact and timeless elegance, this creation ensures you'll command attention and admiration in every setting. Ideal for red carpet events, galas, and moments when you want to make an unforgettable statement with effortless sophistication.",
    image: "https://adasa.com/cdn/shop/products/ladivine-cd254c-cowl-corset-plus-prom-dress-prom-dresses-32205138002003_cc62d8e6-0f2a-421b-9a43-41fdc651b982_1800x1800.jpg?v=1683653900",
    category: "Luxury Couture",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum White", "Royal Blue", "Ruby Red", "Emerald Green", "Gold"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 786
  },
  {
    id: 21,
    name: "Billionaire Runway Masterpiece",
    price: 800,
    description: "Experience the pinnacle of high-fashion excellence with this billionaire runway masterpiece that represents the absolute zenith of contemporary luxury design. This extraordinary creation embodies the culmination of elite fashion innovation, featuring revolutionary design elements that transcend conventional boundaries while celebrating the essence of sophisticated elegance. Crafted with materials of unparalleled rarity and exquisite quality, each element has been meticulously perfected by master artisans who dedicate their entire careers to achieving flawless execution. The silhouette transcends mere fashion to become wearable art that commands reverence and admiration in every setting. This investment piece is designed for the world's most discerning fashion connoisseurs who understand that true luxury lies not just in price, but in the transformative power of exceptional design that elevates the wearer to iconic status. Perfect for the most exclusive international events, royal ceremonies, and moments when only the absolute extraordinary will suffice. This creation is destined to become a timeless heirloom that transcends fashion trends to become an iconic symbol of ultimate sophistication and unparalleled elegance.",
    image: "https://schonmagazine.com/wp-content/uploads/2023/06/BILLIONAIRE_RUNWAY_S24-002-scaled.jpg",
    category: "Billionaire Runway",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum White", "Royal Blue", "Ruby Red", "Emerald Green", "Gold"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 445
  },
  {
    id: 22,
    name: "Luxury Dress Shoes Collection",
    price: 400,
    description: "Discover the perfect fusion of sophisticated craftsmanship and contemporary design with this luxury dress shoes collection that represents the pinnacle of men's footwear excellence. This stunning pair features premium leather construction with meticulous attention to every detail, showcasing the exceptional artistry of master shoemakers who understand that true luxury lies in the perfect balance between comfort and style. The silhouette embodies timeless elegance while incorporating modern design elements that ensure both visual impact and exceptional wearability. Each element has been carefully crafted using the finest materials sourced from renowned tanneries, ensuring durability and sophistication that will elevate any ensemble. Perfect for the modern gentleman who appreciates refined elegance and demands the highest standards of quality, these shoes transition seamlessly from business meetings to formal events. Ideal for boardroom presentations, elegant dinners, and moments when you want to make a lasting impression with effortless sophistication.",
    image: "https://tse4.mm.bing.net/th/id/OIP.QonkNxy70Yg0vYGvLPx58AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Designer Bags",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Classic Black", "Rich Brown", "Burgundy", "Navy", "Oxblood"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 312
  },
  {
    id: 23,
    name: "Luxury Designer Handbag",
    price: 1000,
    description: "Ultra-luxury designer handbag crafted from the finest Italian calf leather with exceptional artisanal craftsmanship. This masterpiece features 24-karat gold-plated custom hardware, genuine silk interior lining, and hand-stitched detailing throughout. The structured silhouette showcases impeccable construction with reinforced corners and protective metal feet. Each element is meticulously designed to provide both stunning visual appeal and practical functionality, including multiple secured compartments and a detachable shoulder strap crafted from the same premium leather. This exclusive piece represents the pinnacle of luxury fashion, destined to become a treasured investment in your designer collection. Perfect for the most discerning fashion connoisseur who demands nothing less than absolute perfection.",
    image: "https://tse3.mm.bing.net/th/id/OIP.-PfivFJh25kxZk2ad3MEhQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Black", "Tan", "Navy", "Burgundy"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: 24,
    name: "Chic Designer Tote Bag",
    price: 480,
    description: "Stunning designer tote bag featuring premium synthetic leather with elegant gold-tone hardware accents. This versatile accessory combines sophisticated style with practical functionality, offering ample storage space for all your essentials. The structured design maintains its shape while providing multiple interior compartments for organized storage. Perfect for both professional settings and casual outings, this bag elevates any ensemble with its timeless appeal and modern aesthetic. The adjustable shoulder strap ensures comfortable wear throughout the day, while the secure zipper closure keeps your belongings safe.",
    image: "https://img.joomcdn.net/e3ec07436540b0eb49010024c447f3da1c10cabd_original.jpeg",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Beige", "Navy"],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 25,
    name: "Exotic Snake Pattern Designer Handbag",
    price: 600,
    description: "Captivating exotic handbag featuring genuine leather with striking snake pattern embossing that creates a bold fashion statement. This sophisticated piece combines wild luxury with refined elegance, showcasing meticulous craftsmanship in every detail. The structured Boston tote design offers generous storage space while maintaining its elegant silhouette. Premium metal hardware in antique gold finish complements the exotic pattern, while the reinforced leather handles ensure comfortable carrying. The interior features multiple compartments for organized storage, including a secure zippered pocket for valuables. Perfect for the fashion-forward individual who dares to stand out, this versatile piece transitions seamlessly from day to evening wear, adding an element of untamed luxury to any ensemble.",
    image: "https://image.made-in-china.com/2f0j00vKncZSCEGJkf/2024-New-Designer-Handbags-Women-Leather-Snake-Pattern-Boston-Tote-Handbag-Bags.jpg",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Black Snake", "Brown Snake", "Cream Snake"],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: 26,
    name: "Elegant Fashion Crossbody Bag",
    price: 540,
    description: "Sophisticated crossbody bag that epitomizes modern elegance with its sleek silhouette and refined design elements. This versatile accessory features premium vegan leather construction with a subtle texture that adds depth and character to the overall aesthetic. The adjustable shoulder strap allows for multiple wearing options - from crossbody to shoulder carry - adapting seamlessly to your lifestyle needs. The thoughtfully designed interior includes a main compartment with secure zip closure, plus additional slip pockets for organizing essentials like phone, cards, and keys. The minimalist exterior is enhanced by discreet gold-tone hardware that adds a touch of luxury without overwhelming the clean design. Perfect for both casual outings and formal occasions, this bag effortlessly complements any outfit while providing practical functionality for the modern woman on the go.",
    image: "https://cdn11.bigcommerce.com/s-rgij110q2h/images/stencil/500w/products/552/23287/sac-fashion__80416.1665619536.jpg?c=1",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Black", "Tan", "Navy", "Burgundy"],
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 94
  },
  {
    id: 27,
    name: "Luxury Two-Tone Designer Bag",
    price: 970,
    description: "Exceptional designer bag showcasing a sophisticated two-tone design that harmoniously blends pristine white with rich brown accents, creating a striking visual contrast that exudes contemporary luxury. The premium construction features genuine leather panels meticulously stitched together by master artisans, ensuring durability and timeless appeal. The distinctive brown leather strap provides both comfort and style, while the structured body maintains its elegant silhouette even when fully packed. The thoughtfully designed interior offers multiple compartments for optimal organization, including a secure zippered pocket for valuables and slip pockets for easy access to essentials. Gold-tone hardware adds a touch of opulence, complementing the dual-tone color scheme perfectly. This versatile piece transitions effortlessly from professional settings to social occasions, making it the ultimate statement accessory for the discerning fashion enthusiast who appreciates both bold design and practical functionality.",
    image: "https://img.freepik.com/premium-photo/brown-white-bag-with-brown-leather-strap_1125744-21.jpg",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["White/Brown", "Cream/Tan", "Black/Navy"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: 28,
    name: "Chic Everyday Designer Bag",
    price: 390,
    description: "Stylish and practical designer bag that perfectly balances everyday functionality with contemporary fashion appeal. This versatile piece features premium synthetic leather with a subtle texture that mimics the look and feel of genuine leather while offering enhanced durability and easy maintenance. The spacious main compartment provides ample room for daily essentials, while the thoughtfully designed interior includes multiple slip pockets for organization and a secure zippered closure for valuables. The comfortable shoulder straps are adjustable to ensure the perfect fit, whether worn on the shoulder or carried by hand. The minimalist exterior design is enhanced by elegant silver-tone hardware that adds a touch of sophistication without overwhelming the clean aesthetic. Perfect for work, shopping, or casual outings, this bag effortlessly adapts to your lifestyle while maintaining a polished, professional appearance. An ideal choice for the modern woman who values both style and practicality in her everyday accessories.",
    image: "https://i.pinimg.com/736x/25/4c/f0/254cf083f0e1902125cb86b8936e8779.jpg",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Black", "Tan", "Navy", "Burgundy", "Gray"],
    inStock: true,
    featured: true,
    rating: 4.4,
    reviews: 156
  },
  {
    id: 29,
    name: "Men's Luxury Leather Briefcase",
    price: 650,
    description: "Sophisticated men's briefcase crafted from premium genuine leather that combines professional elegance with modern functionality. This distinguished piece features a structured silhouette with meticulous stitching and reinforced corners, ensuring both durability and refined appearance. The spacious main compartment accommodates laptops up to 15 inches, documents, and business essentials, while multiple interior pockets provide organized storage for tablets, phones, pens, and cards. The exterior includes convenient quick-access pockets for frequently used items. Comfortable leather handles offer a secure grip, while the detachable adjustable shoulder strap provides versatile carrying options for the modern professional. Polished silver-tone hardware complements the rich leather finish, adding a touch of sophistication to this executive accessory. Perfect for business meetings, corporate presentations, or professional travel, this briefcase makes a powerful statement about success and attention to detail. An essential investment piece for the discerning gentleman who values both style and practical functionality in his professional arsenal.",
    image: "https://tse3.mm.bing.net/th/id/OIP.57IuBjnbcW8RUx0_m1aw_wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Classic Black", "Rich Brown", "Charcoal Gray", "Dark Tan"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 189
  },
  {
    id: 30,
    name: "Men's Casual Canvas Messenger Bag",
    price: 270,
    description: "Stylish and practical men's messenger bag designed for the modern urban lifestyle. This versatile piece features durable canvas construction with premium leather accents that create a perfect balance between casual comfort and refined style. The spacious main compartment provides ample room for laptops, tablets, books, and daily essentials, while the thoughtfully organized interior includes dedicated sleeves for electronics and multiple pockets for accessories. The adjustable shoulder strap ensures comfortable carrying throughout the day, whether you're commuting to work, attending classes, or exploring the city. The exterior features convenient quick-access pockets for phone, keys, and other frequently used items. The minimalist design is enhanced by quality metal buckles and hardware that add both functionality and aesthetic appeal. Perfect for students, young professionals, and anyone who values both practicality and contemporary style in their everyday carry. This bag effortlessly adapts to various settings from casual outings to semi-formal environments, making it an essential accessory for the modern man on the go.",
    image: "https://images.opumo.com/wordpress/wp-content/uploads/2024/02/Layer-36-768x768.png",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Khaki", "Navy Blue", "Charcoal Gray", "Olive Green", "Black"],
    inStock: true,
    featured: true,
    rating: 4.3,
    reviews: 142
  },
  {
    id: 31,
    name: "Men's Modern Leather Backpack",
    price: 300,
    description: "Contemporary men's backpack that seamlessly blends urban style with functional design, perfect for the modern man who demands both aesthetics and practicality. This sophisticated piece features premium synthetic leather with a subtle texture that provides the luxurious look of genuine leather while offering superior durability and weather resistance. The multi-compartment design includes a padded laptop sleeve that fits devices up to 15 inches, a spacious main compartment for books and documents, and multiple organizer pockets for tablets, chargers, and accessories. The ergonomic design ensures comfortable weight distribution, while the adjustable padded shoulder straps provide all-day comfort during commutes or travel. The exterior includes quick-access side pockets for water bottles or umbrellas, plus a secure front pocket for frequently used items. The minimalist silhouette is enhanced by quality metal zippers and hardware that add both security and visual appeal. Perfect for students, professionals, and travelers who appreciate sophisticated design without compromising on functionality. This backpack transitions effortlessly from campus to boardroom, making it the ultimate versatile accessory for the contemporary lifestyle.",
    image: "https://tse4.mm.bing.net/th/id/OIP.5Q2uE_LpKyEKQyCPKnMiFAHaHn?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Classic Black", "Rich Brown", "Charcoal Gray", "Navy Blue", "Dark Green"],
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 178
  },
  {
    id: 32,
    name: "Men's Compact Laptop Backpack",
    price: 170,
    description: "Practical and stylish men's laptop backpack designed for the modern professional who values efficiency and contemporary design. This versatile piece features durable polyester construction with leather accents that create a sophisticated appearance while ensuring long-lasting performance. The thoughtfully designed interior includes a padded laptop compartment that securely holds devices up to 14 inches, plus additional space for notebooks, tablets, and daily essentials. Multiple organizer pockets keep your accessories neatly arranged, while the front quick-access pocket provides convenient storage for items you need to grab quickly. The adjustable shoulder straps are padded for comfort during daily commutes, and the breathable back panel ensures proper ventilation during extended wear. The minimalist design is enhanced by quality metal zippers and subtle branding that maintains a professional aesthetic. Perfect for students, young professionals, and anyone who needs a reliable bag for work, school, or casual outings. This backpack offers the perfect balance of functionality, comfort, and style, making it an essential accessory for the modern man on the move.",
    image: "https://www.newfunland.ca/wp-content/uploads/2023/11/leather-laptop-backpack-344kbw-1.jpg",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Black", "Navy Blue", "Gray", "Brown", "Olive"],
    inStock: true,
    featured: true,
    rating: 4.2,
    reviews: 126
  },
  {
    id: 33,
    name: "Men's Vintage Leather Satchel",
    price: 400,
    description: "Timeless men's leather satchel that embodies classic sophistication with modern functionality, perfect for the distinguished gentleman who appreciates heritage craftsmanship. This elegant piece features genuine full-grain leather that develops a beautiful patina over time, ensuring your bag becomes uniquely yours with each use. The structured design maintains its shape while providing ample storage for laptops up to 13 inches, documents, and daily essentials. The interior is thoughtfully organized with multiple compartments including a padded sleeve for electronics and dedicated pockets for business cards, pens, and other accessories. The adjustable leather shoulder strap offers comfortable carrying options, while the sturdy top handles provide alternative hand-carry convenience. Vintage-inspired brass hardware adds authentic character and ensures durability, while the secure buckle closures keep your belongings safe. Perfect for business meetings, academic settings, or cultural events, this satchel bridges the gap between traditional elegance and contemporary practicality. An investment piece that combines old-world charm with modern utility, making it the ideal companion for the modern professional who values both heritage and innovation.",
    image: "https://i.etsystatic.com/17641323/c/1680/1680/129/437/il/6ca6fa/2660918539/il_600x600.2660918539_mkmj.jpg",
    category: "Designer Bags",
    sizes: ["One Size"],
    colors: ["Rich Brown", "Classic Black", "Tan", "Burgundy", "Dark Brown"],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 198
  },
  {
    id: 34,
    name: "Jimmy Choo Luxury Heels",
    price: 1700,
    description: "Exquisite Jimmy Choo luxury heels that represent the pinnacle of high-fashion footwear craftsmanship, designed for the woman who demands nothing less than absolute perfection. These stunning heels feature premium Italian suede construction in a sophisticated silhouette that seamlessly blends elegance with contemporary edge. The iconic stiletto heel, measuring 4.5 inches, provides the perfect balance of height and stability while creating an elongated, graceful profile. The pointed toe design adds a touch of classic sophistication, while the minimalistic approach ensures that the focus remains on the impeccable craftsmanship and luxurious materials. Each pair is meticulously handcrafted by master shoemakers in Italy, featuring hand-stitched details and reinforced construction for lasting durability. The leather-lined insole provides superior comfort, while the anti-slip leather sole ensures confident movement on any surface. These heels are not merely footwear; they are wearable art that transforms any ensemble from ordinary to extraordinary. Perfect for red carpet events, galas, exclusive parties, or any occasion where making a memorable impression is essential. An investment in timeless luxury that will remain a cherished piece in your collection for years to come.",
    image: "https://i.pinimg.com/736x/a6/71/24/a6712468ec27b185d1a77cebe65bf925.jpg",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Black Suede", "Nude Suede", "Red Suede", "Royal Blue"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 87
  },
  {
    id: 35,
    name: "Christian Louboutin Classic Pumps",
    price: 1300,
    description: "Iconic Christian Louboutin pumps that embody the essence of Parisian luxury and timeless elegance. These exquisite heels feature the signature red leather sole that has become synonymous with sophistication and high-fashion status. Crafted from premium patent leather with meticulous attention to detail, these pumps showcase the masterful craftsmanship that has made Louboutin a global fashion icon. The classic 100mm stiletto heel provides the perfect balance of height and grace, while the pointed toe design creates an elongated, feminine silhouette that commands attention. The leather-lined insole ensures exceptional comfort, allowing you to wear these statement heels from day to night with confidence. Each pair is a work of art, featuring hand-finished details and the iconic red lacquered sole that leaves an unforgettable impression. Perfect for galas, red carpet events, exclusive dinners, or any occasion where making a powerful style statement is essential. These are not merely shoes; they are an investment in timeless glamour and enduring fashion legacy.",
    image: "https://cdn.clothbase.com/uploads/93809d8e-6ff8-43d9-9543-c9c0c2203283/beige-saeda-100-heels.jpg",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Black Patent", "Nude Patent", "Red Patent", "Navy Blue"],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 36,
    name: "Pearly Designer Chunky Heels",
    price: 900,
    description: "Stunning pearly designer chunky heels that embody contemporary fashion with bold confidence and sophisticated style. These statement heels feature premium construction with eye-catching pearlescent finish that catches light from every angle, creating a mesmerizing effect as you move. The chunky 3-inch platform provides the perfect balance of height and stability, while the open-toe design adds a modern, edgy touch to the classic silhouette. The cushioned footbed ensures exceptional comfort for extended wear, while the sturdy block heel offers confident elevation without compromising on stability. Perfect for fashion-forward individuals who want to make a memorable impression at parties, clubs, or special events. These versatile heels transition seamlessly from day to night, complementing both casual and dressy outfits with their bold, contemporary appeal. An essential addition to any fashion wardrobe that combines trend-setting design with practical wearability.",
    image: "https://pearlingstx.com/wp-content/uploads/bronze-pearly-designer-chunky-heels-image-710x710.jpg",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Bronze", "Silver", "Gold", "Black", "Rose Gold"],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 134
  },
  {
    id: 37,
    name: "Elegant Platform Heels",
    price: 700,
    description: "Stylish canvas platform heels that blend contemporary design with everyday comfort, perfect for the modern woman who appreciates both fashion and practicality. These versatile heels feature durable canvas construction with a sleek silhouette that adds height while maintaining all-day wearability. The platform sole provides confident elevation without compromising on stability, making them ideal for walking, shopping, or casual outings. The open-toe design offers a trendy, relaxed fit while the sturdy heel ensures comfortable movement throughout your daily activities. The lightweight canvas material ensures breathability and comfort, while the flexible sole allows natural movement. Perfect for weekend brunches, shopping trips, or casual gatherings where you want to look effortlessly chic. These affordable heels transition seamlessly from day to evening, complementing both casual and dressy outfits with their contemporary, laid-back appeal. An essential addition to any wardrobe that combines trend-setting style with everyday functionality.",
    image: "https://tse3.mm.bing.net/th/id/OIP.jkTlpHhFypLSwulCJUVsGAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Black", "Nude", "Red", "Navy Blue", "Silver"],
    inStock: true,
    featured: true,
    rating: 4.4,
    reviews: 98
  },
  {
    id: 38,
    name: "Designer Ankle Strap Heels",
    price: 680,
    description: "Elegant designer ankle strap heels that showcase sophisticated craftsmanship with contemporary allure. These stunning heels feature premium construction with delicate ankle straps that provide both style and secure support while walking. The sleek silhouette creates a graceful, elongated profile that enhances any outfit with refined elegance. The sturdy block heel offers perfect height for formal occasions while maintaining stability and comfort throughout extended wear. The open-toe design adds a modern touch, while the cushioned insole ensures exceptional comfort for dancing, walking, or standing. Perfect for wedding guests, formal events, or special occasions where making an elegant impression is paramount. These versatile heels transition beautifully from day to evening, complementing both classic and contemporary ensembles with their timeless appeal and modern sophistication.",
    image: "https://gw.alicdn.com/imgextra/i4/2822377467/O1CN01fR2iUb251wMHsF7cy_!!2822377467.jpg_640x640q90.jpg",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Nude", "Black", "Silver", "Gold", "Rose Gold"],
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 112
  },
  {
    id: 39,
    name: "Classic Block Heel Shoes",
    price: 500,
    description: "Timeless block heel shoes that blend vintage elegance with contemporary comfort, perfect for the modern woman who values both style and practicality. These sophisticated shoes feature premium construction with a classic silhouette that never goes out of fashion. The sturdy block heel provides confident elevation while maintaining stability for comfortable walking throughout the day. The closed-toe design offers a polished, professional appearance while the cushioned insole ensures exceptional comfort for extended wear. The durable sole provides reliable traction on various surfaces, making them ideal for both indoor and outdoor activities. Perfect for office wear, business meetings, or formal events where you want to project confidence and sophistication. These versatile shoes seamlessly transition from professional settings to evening outings, complementing both dressy and casual ensembles with their enduring appeal and reliable performance.",
    image: "https://tse1.mm.bing.net/th/id/OIP.UleXWf8pTLYC_dWIYZJ-UwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Black", "Brown", "Nude", "Gray", "Burgundy"],
    inStock: true,
    featured: true,
    rating: 4.3,
    reviews: 167
  },
  {
    id: 40,
    name: "Classic Canvas Sneakers",
    price: 100,
    description: "Comfortable and stylish canvas sneakers that blend everyday practicality with casual fashion appeal. These versatile shoes feature durable canvas construction with a classic design that never goes out of style. The rubber sole provides excellent traction and comfort for all-day wear, while the cushioned insole ensures support during walking, running, or standing. The lace-up design offers a secure fit while maintaining a clean, timeless look that complements any casual outfit. Perfect for weekend outings, casual Fridays at work, or everyday errands where you want both comfort and style. These affordable sneakers transition seamlessly from day to evening, providing reliable performance and understated fashion that adapts to your active lifestyle.",
    image: "https://img.ltwebstatic.com/images3_pi/2022/05/05/1651730273920136151c67769baf7829861e6fd858_thumbnail_405x552.jpg",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["White", "Black", "Navy", "Gray", "Red"],
    inStock: true,
    featured: true,
    rating: 4.2,
    reviews: 89
  },
  {
    id: 41,
    name: "Men's Premium Leather Shoes",
    price: 680,
    description: "Sophisticated men's leather shoes that combine classic elegance with modern comfort, perfect for the distinguished gentleman who values both style and practicality. These premium shoes feature genuine leather construction with meticulous attention to detail, ensuring both durability and refined appearance. The classic silhouette with subtle design elements creates a timeless look that complements both formal and business casual attire. The leather upper provides breathability and comfort, while the cushioned insole ensures all-day wearability without compromising on style. The durable leather sole offers excellent traction and longevity, making these shoes a reliable investment for your professional wardrobe. Perfect for business meetings, formal events, or any occasion where projecting confidence and sophistication is essential. These versatile shoes seamlessly transition from office settings to evening engagements, maintaining their polished appearance throughout the day.",
    image: "https://ae01.alicdn.com/kf/S43d1e5189c15418cbe5b5094ef2652c36.jpg",
    category: "Shoes",
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Classic Black", "Rich Brown", "Dark Tan", "Burgundy", "Navy Blue"],
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 145
  },
  {
    id: 42,
    name: "Elegant Strappy Heels",
    price: 700,
    description: "Sophisticated men's strappy heels that embody contemporary elegance with bold confidence and refined masculine style. These stunning heels feature premium construction with distinctive straps that create an intricate, eye-catching design while providing secure support for the modern gentleman. The sleek silhouette offers the perfect balance of height and stability, while the open-toe design adds a modern, fashion-forward touch to the classic structure. The cushioned footbed ensures exceptional comfort for extended wear, allowing you to move with confidence throughout any event. The sturdy heel provides confident elevation without compromising on stability, making these heels ideal for formal events, upscale gatherings, or special occasions where making a memorable style statement is essential. These versatile heels transition beautifully from day to evening, complementing both formal attire and stylish separates with their sophisticated appeal and contemporary masculine design. Perfect for the fashion-forward man who appreciates bold footwear choices and contemporary luxury style.",
    image: "https://images.nexusapp.co/assets/e8/64/e2/271500871.jpg",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Black", "Nude", "Silver", "Gold", "Rose Gold", "Red"],
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 178
  },
  {
    id: 43,
    name: "Luxury Designer Heels",
    price: 800,
    description: "Exquisite luxury designer heels that represent the pinnacle of sophisticated footwear craftsmanship, designed for the woman who demands nothing less than absolute perfection. These stunning heels feature premium construction with an elegant silhouette that seamlessly blends classic design with contemporary allure. The sleek stiletto heel provides the perfect balance of height and grace, while the pointed toe design creates an elongated, feminine silhouette that commands attention. The premium materials ensure both comfort and durability, while the meticulous attention to detail showcases the exceptional craftsmanship that defines luxury footwear. The cushioned insole provides superior comfort for extended wear, allowing you to move with confidence and elegance throughout any event. Perfect for red carpet events, galas, exclusive parties, or any occasion where making a powerful style statement is essential. These are not merely shoes; they are wearable art that transforms any ensemble from ordinary to extraordinary, making them an investment in timeless glamour and enduring fashion legacy.",
    image: "https://ae-pic-a1.aliexpress-media.com/kf/HTB1wLgtQYrpK1RjSZTEq6AWAVXaf.jpg_960x960q75.jpg_.webp",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Black", "Nude", "Silver", "Gold", "Red", "Royal Blue"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 134
  },
  {
    id: 44,
    name: "Elegant Evening Heels",
    price: 400,
    description: "Sophisticated evening heels that blend timeless elegance with modern sophistication, perfect for the woman who appreciates refined style and comfort. These stunning heels feature premium construction with a classic silhouette that exudes grace and confidence. The sleek design creates an elongated, feminine profile while the sturdy heel provides the perfect balance of height and stability for extended wear. The premium materials ensure both durability and comfort, while the meticulous attention to detail showcases exceptional craftsmanship. The cushioned insole offers superior comfort for dancing, walking, or standing throughout special occasions. Perfect for evening events, dinner dates, formal gatherings, or any occasion where making an elegant impression is important. These versatile heels transition beautifully from professional settings to social engagements, complementing both formal attire and elegant evening wear with their timeless appeal and sophisticated design.",
    image: "https://img.joomcdn.net/bc9a7427dc343cabee5847645d4ccb1d5dd36fbb_original.jpeg",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Black", "Nude", "Silver", "Gold", "Red", "Navy Blue"],
    inStock: true,
    featured: true,
    rating: 4.4,
    reviews: 156
  },
  {
    id: 45,
    name: "Classic Formal Heels",
    price: 400,
    description: "Timeless formal heels that embody classic elegance with sophisticated design, perfect for the woman who values both style and practicality. These stunning heels feature premium construction with a classic silhouette that never goes out of fashion. The sleek design creates an elegant, professional profile while the sturdy heel provides confident elevation and stability for all-day wear. The premium materials ensure both durability and comfort, while the meticulous attention to detail showcases exceptional craftsmanship. The cushioned insole offers superior comfort for extended periods of standing, walking, or sitting during formal events. Perfect for business meetings, formal dinners, wedding guests, or any occasion where projecting confidence and elegance is essential. These versatile heels transition seamlessly from professional settings to evening engagements, complementing both business attire and formal wear with their timeless appeal and sophisticated design.",
    image: "https://cdn.shopify.com/s/files/1/1857/8015/products/product-image-1841943843_300x300.jpg?v=1631238094",
    category: "Shoes",
    sizes: ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10"],
    colors: ["Black", "Nude", "Silver", "Gold", "Red", "Navy Blue"],
    inStock: true,
    featured: true,
    rating: 4.3,
    reviews: 142
  },
  {
    id: 47,
    name: "Elite Diamond Necklace",
    price: 13000,
    description: "Breathtaking diamond necklace that represents the ultimate expression of luxury and timeless elegance. This masterpiece features exquisite diamonds set in precious platinum, creating an unforgettable statement of sophistication and grace. The design showcases masterful craftsmanship with each diamond meticulously selected for exceptional clarity and brilliance, while the setting demonstrates the highest standards of jewelry artistry. The graduated diamond arrangement creates a cascading effect that captures light from every angle, ensuring you command attention with refined radiance. Perfect for exclusive galas, red carpet events, or any occasion where only the most prestigious jewelry will suffice. This extraordinary piece transcends mere accessory to become wearable art that embodies both status and timeless beauty. An investment in eternal luxury that will be treasured for generations to come.",
    image: "https://i.pinimg.com/736x/73/d1/26/73d12629dd45f56e3c7aac0b43da871c.jpg",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Platinum White", "Rose Gold", "Yellow Gold", "White Gold", "Two-Tone"],
    inStock: true,
    featured: true,
    rating: 4.1,
    reviews: 98
  },
  {
    id: 48,
    name: "Fashion Sports Cap",
    price: 80,
    description: "Stylish and functional sports cap that combines athletic performance with everyday fashion appeal. This versatile accessory features premium construction with breathable fabric that ensures comfort during physical activities. The adjustable strap provides a perfect fit for various head sizes while the classic design complements both athletic and casual outfits. The moisture-wicking material keeps you cool and dry during workouts, making it ideal for gym sessions, outdoor sports, or casual wear. Perfect for fitness enthusiasts, sports fans, or anyone who wants to add a sporty touch to their everyday look. This affordable cap transitions seamlessly from exercise settings to casual outings, providing both functionality and style that adapts to your active lifestyle.",
    image: "https://i.pinimg.com/originals/33/58/64/335864f7cc6f23b4bcfa587e1cfef042.jpg",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Gray", "Red", "White"],
    inStock: true,
    featured: true,
    rating: 4.2,
    reviews: 76
  },
  {
    id: 49,
    name: "Classic Fashion Sunglasses",
    price: 60,
    description: "Stylish and protective fashion sunglasses that combine modern design with superior UV protection, perfect for fashion-conscious individuals who value both style and eye safety. These versatile sunglasses feature premium construction with high-quality lenses that provide excellent clarity and 100% UV protection. The lightweight frame ensures comfortable all-day wear while the classic design complements various face shapes and outfits. The polarized lenses reduce glare and enhance visual comfort, making them ideal for driving, outdoor activities, or casual wear. Perfect for sunny days, beach outings, or any occasion where you want to add a fashionable touch while protecting your eyes. These affordable sunglasses transition seamlessly from functional eyewear to fashion accessory, providing both protection and style that adapts to your lifestyle.",
    image: "https://facts.net/wp-content/uploads/2024/02/8-best-sunglasses-for-men-1707186039.jpg",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Silver", "Gold", "Tortoise"],
    inStock: true,
    featured: true,
    rating: 4.0,
    reviews: 124
  },
  {
    id: 50,
    name: "Exclusive Luxury Watch",
    price: 18000,
    description: "Exquisite luxury timepiece that represents the pinnacle of horological excellence and sophisticated craftsmanship. This extraordinary watch features premium Swiss movement with meticulous attention to every detail, showcasing the highest standards of watchmaking artistry. The case is crafted from precious materials with flawless finishing, while the dial displays exceptional clarity and elegance. The sapphire crystal provides superior scratch resistance and durability, ensuring this investment piece maintains its beauty for generations. Perfect for connoisseurs who appreciate the fusion of technical precision and aesthetic perfection. This timepiece transcends mere timekeeping to become wearable art that commands attention and admiration. Ideal for exclusive events, business meetings, or any occasion where only the most prestigious accessories will suffice. An investment in timeless luxury that represents both status and discerning taste.",
    image: "https://i.pinimg.com/736x/f1/52/07/f1520707bdc2e492c38d63a819969917.jpg",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Rose Gold", "Yellow Gold", "White Gold", "Platinum", "Titanium"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 45
  },
  {
    id: 51,
    name: "Premium Leather Backpack",
    price: 6000,
    description: "Exceptional luxury backpack that embodies the perfect fusion of functionality and sophisticated design, crafted for the modern executive who demands both style and practicality. This extraordinary piece features premium Italian leather construction with meticulous attention to every detail, showcasing the highest standards of artisanal craftsmanship. The spacious interior offers intelligent organization while maintaining a sleek, professional silhouette that commands respect. The hardware is crafted from precious metals with flawless finishing, while the adjustable straps ensure superior comfort during extended wear. Perfect for business professionals, luxury travelers, or anyone who appreciates the marriage of utility and elegance. This backpack transcends mere functionality to become a statement piece that reflects discerning taste and success. Ideal for board meetings, international travel, or any setting where only the most prestigious accessories will suffice. An investment in contemporary luxury that represents both professional achievement and sophisticated lifestyle.",
    image: "https://tse3.mm.bing.net/th/id/OIP.kz_yZRaOW35ncDol-wKYhQHaIy?pid=ImgDet&w=474&h=562&rs=1&o=7&rm=3",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Classic Black", "Rich Brown", "Navy Blue", "Charcoal Gray", "Tan"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: 52,
    name: "Elegant Couture Masterpiece",
    price: 1000,
    description: "Breathtaking couture masterpiece that embodies the essence of sophisticated elegance and contemporary fashion artistry. This extraordinary piece features meticulous craftsmanship with premium fabrics that drape beautifully to create a stunning silhouette. The design combines timeless sophistication with modern sensibility, featuring exquisite details that capture attention from every angle. Perfect for exclusive events, red carpet occasions, and moments when you want to make an unforgettable impression. This versatile piece transitions seamlessly from formal galas to elegant evening soirees, ensuring you radiate confidence and grace throughout any occasion. The luxurious construction and thoughtful design elements make this a timeless addition to any discerning fashion collection.",
    image: "https://i.pinimg.com/736x/ca/91/ba/ca91bae4b68cee57eca17d450c796836.jpg",
    category: "Couture",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Champagne Gold", "Royal Blue", "Ruby Red", "Platinum White"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 89
  },
  {
    id: 53,
    name: "Sophisticated Fashion Ensemble",
    price: 800,
    description: "Elegant fashion ensemble that captures the essence of contemporary sophistication and timeless style. This exquisite piece features premium construction with meticulous attention to detail, creating a silhouette that exudes confidence and grace. The design harmonizes classic elegance with modern fashion sensibilities, making it perfect for the discerning individual who appreciates refined aesthetics. Versatile enough to transition seamlessly from professional settings to social occasions, this ensemble ensures you make a memorable impression wherever you go. The luxurious materials and thoughtful design elements combine to create a truly exceptional piece that elevates your wardrobe to new heights of sophistication.",
    image: "https://tse2.mm.bing.net/th/id/OIP.We1Xoj1WoNtY0BF3Zk4M9gHaNK?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Fashion",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Classic Black", "Navy Blue", "Burgundy", "Charcoal Gray", "Ivory White"],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: 54,
    name: "Luxury Designer Original",
    price: 1200,
    description: "Exquisite designer original that represents the pinnacle of contemporary luxury fashion. This masterpiece features impeccable craftsmanship with premium materials that create an unforgettable silhouette. The design showcases innovative styling combined with timeless elegance, perfect for those who demand the very best in fashion. Every detail has been meticulously considered, from the luxurious fabric selection to the sophisticated construction techniques. This versatile piece transitions seamlessly from exclusive events to high-profile gatherings, ensuring you command attention with refined sophistication. The artistic elements and premium quality make this a standout addition to any luxury fashion collection, destined to become a timeless favorite for the discerning fashion enthusiast.",
    image: "https://s-media-cache-ak0.pinimg.com/236x/d0/91/7d/d0917d7b0c26c3248b44fdc97667d3de.jpg",
    category: "Designer Original",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Midnight Black", "Platinum White", "Royal Blue", "Ruby Red", "Emerald Green"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 234
  },
  {
    id: 55,
    name: "Men's Rolex Luxury Watch",
    price: 1800,
    description: "Exquisite men's Rolex timepiece that embodies the pinnacle of Swiss watchmaking excellence and sophisticated luxury. This masterpiece features precision engineering with premium materials that create an unforgettable statement of success and refinement. The design showcases iconic Rolex styling combined with contemporary elegance, perfect for the discerning gentleman who demands the very best in horological craftsmanship. Every detail has been meticulously considered, from the luxurious materials to the sophisticated movement mechanisms. This versatile timepiece transitions seamlessly from business meetings to exclusive social events, ensuring you command attention with timeless sophistication. The Swiss precision and premium quality make this a standout addition to any luxury accessory collection, destined to become a treasured heirloom for generations to come.",
    image: "https://tse4.mm.bing.net/th/id/OIP.QLL2HYN--_A00j-SCoKZewHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Stainless Steel", "Gold", "Rose Gold", "Two-Tone", "Black Dial"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 312
  },
  {
    id: 56,
    name: "Rolex GMT Master II Pepsi",
    price: 8000,
    description: "Iconic Rolex GMT Master II Pepsi that represents the pinnacle of Swiss horological excellence and luxury watchmaking. This masterpiece features precision engineering with premium materials that create an unforgettable statement of success and refinement. The design showcases the legendary Pepsi bezel with blue and red aluminum insert, combined with timeless Rolex styling, perfect for the discerning gentleman who demands the very best in luxury timepieces. Every detail has been meticulously crafted by Rolex master watchmakers, from the luxurious Oystersteel case to the sophisticated GMT movement that tracks multiple time zones. This versatile timepiece transitions seamlessly from business meetings to exclusive social events, ensuring you command attention with sophisticated success. The Swiss precision and premium quality make this a crown jewel in any luxury watch collection, destined to become a treasured heirloom for generations to come.",
    image: "https://carrwatches.com/wp-content/uploads/2020/01/rolex-gmt-master-ii-126710blro-pepsi-21.jpg",
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Oystersteel", "Blue and Red Bezel", "Black Dial", "White Dial", "Two-Tone"],
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: 189
  }
];

// In-memory storage for ambassador accounts
const ambassadorAccounts = new Map();

// In-memory storage for profile pictures
const profilePictures = new Map();

// Products API route
app.get('/api/products', (req, res) => {
  console.log('GET /api/products - returning mock data');
  res.json(mockProducts);
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Ambassador registration route
app.post('/api/ambassadors/register', (req, res) => {
  console.log('POST /api/ambassadors/register');
  const { email, password } = req.body;
  
  // Check if ambassador already exists
  if (ambassadorAccounts.has(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Ambassador account already exists with this email'
    });
  }
  
  // Create new ambassador account
  const ambassadorData = {
    _id: 'amb_' + Date.now(),
    email: email,
    password: password, // In production, this should be hashed
    isVerified: false,
    balance: 0,
    clearanceStatus: 'pending',
    clearancePaymentStatus: 'pending',
    profile: null,
    selectedOutfits: [
      {
        id: 1,
        name: "Elegant Evening Gown",
        price: 700,
        image: "https://i.pinimg.com/236x/54/65/71/54657119e25f9669ae67338728c693ca.jpg?nii=t",
        category: "Evening Wear",
        selectedAt: new Date().toISOString()
      },
      {
        id: 7,
        name: "Exclusive High Fashion Ensemble",
        price: 1100,
        image: "https://i.pinimg.com/originals/51/ec/eb/51eceb8d2f04e68ce2cb0b696466fae6.jpg",
        category: "Haute Couture",
        selectedAt: new Date().toISOString()
      },
      {
        id: 14,
        name: "Ultimate Couture Masterpiece",
        price: 2000,
        image: "https://tse1.mm.bing.net/th/id/OIP.putbwjQJMOZx_AlF0lVC2QHaLj?pid=ImgDet&w=474&h=739&rs=1&o=7&rm=3",
        category: "Ultimate Couture",
        selectedAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    accountType: 'ambassador'
  };
  
  // Save ambassador to storage folder
  const ambassadorsDir = path.join(__dirname, 'storage', 'ambassadors');
  const ambassadorFile = path.join(ambassadorsDir, `${ambassadorData._id}.json`);
  
  try {
    // Ensure ambassadors directory exists
    if (!fs.existsSync(ambassadorsDir)) {
      fs.mkdirSync(ambassadorsDir, { recursive: true });
    }
    
    // Save ambassador data
    fs.writeFileSync(ambassadorFile, JSON.stringify(ambassadorData, null, 2));
    console.log(`✅ Ambassador account saved: ${email}`);
    console.log(`✅ File created: ${ambassadorFile}`);
    
    // Store in memory for backward compatibility
    ambassadorAccounts.set(email, ambassadorData);
    
    res.json({ 
      success: true, 
      message: 'Ambassador account created successfully',
      token: 'mock_ambassador_token_' + Date.now(),
      ambassador: {
        _id: ambassadorData._id,
        email: ambassadorData.email,
        isVerified: ambassadorData.isVerified,
        balance: ambassadorData.balance,
        clearanceStatus: ambassadorData.clearanceStatus,
        clearancePaymentStatus: ambassadorData.clearancePaymentStatus,
        profile: ambassadorData.profile,
        selectedOutfits: ambassadorData.selectedOutfits
      }
    });
  } catch (error) {
    console.error('❌ Error saving ambassador account:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating ambassador account',
      error: error.message 
    });
  }
});

// Ambassador login route
app.post('/api/ambassadors/login', (req, res) => {
  console.log('POST /api/ambassadors/login');
  const { email, password } = req.body;
  
  try {
    // Read ambassadors from storage folder
    const ambassadorsDir = path.join(__dirname, 'storage', 'ambassadors');
    
    if (!fs.existsSync(ambassadorsDir)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    const ambassadorFiles = fs.readdirSync(ambassadorsDir).filter(file => file.endsWith('.json'));
    let foundAmbassador = null;
    
    // Search for matching ambassador
    for (const file of ambassadorFiles) {
      const filePath = path.join(ambassadorsDir, file);
      const ambassadorData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (ambassadorData.email === email && ambassadorData.password === password) {
        foundAmbassador = ambassadorData;
        break;
      }
    }
    
    if (foundAmbassador) {
      console.log(`✅ Ambassador logged in: ${email}`);
      
      // Store in memory for session management
      ambassadorAccounts.set(email, foundAmbassador);
      
      res.json({ 
        success: true, 
        message: 'Ambassador login successful',
        token: 'mock_ambassador_token_' + Date.now(),
        ambassador: {
          _id: foundAmbassador._id,
          email: foundAmbassador.email,
          isVerified: foundAmbassador.isVerified,
          balance: foundAmbassador.balance,
          clearanceStatus: foundAmbassador.clearanceStatus,
          clearancePaymentStatus: foundAmbassador.clearancePaymentStatus,
          profile: foundAmbassador.profile,
          selectedOutfits: foundAmbassador.selectedOutfits
        }
      });
    } else {
      console.log(`❌ Ambassador login failed for: ${email}`);
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error('❌ Error during ambassador login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during login',
      error: error.message 
    });
  }
});

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Update ambassador selected outfits route
app.post('/api/ambassadors/update-outfits', (req, res) => {
  console.log('POST /api/ambassadors/update-outfits');
  console.log('Request body:', req.body);
  const { email, selectedOutfits } = req.body;
  
  // Validate input
  if (!email || !selectedOutfits || !Array.isArray(selectedOutfits)) {
    console.log('Validation failed - invalid input:', { email, selectedOutfits });
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid request: email and selectedOutfits are required'
    });
  }
  
  // Check if ambassador account exists
  if (!ambassadorAccounts.has(email)) {
    console.log('Ambassador account not found:', email);
    return res.status(404).json({ 
      success: false, 
      message: 'Ambassador account not found'
    });
  }
  
  // Validate selectedOutfits array
  if (selectedOutfits.length > 3) {
    console.log('Too many outfits selected:', selectedOutfits.length);
    return res.status(400).json({ 
      success: false, 
      message: 'Cannot select more than 3 outfits'
    });
  }
  
  const storedAccount = ambassadorAccounts.get(email);
  console.log('Found ambassador account:', email);
  
  try {
    // Update selected outfits with timestamps
    const updatedOutfits = selectedOutfits.map(outfit => ({
      ...outfit,
      selectedAt: new Date().toISOString()
    }));
    
    // Update the stored account
    storedAccount.selectedOutfits = updatedOutfits;
    ambassadorAccounts.set(email, storedAccount);
    
    console.log('Ambassador outfits updated:', email);
    console.log('Updated outfits:', updatedOutfits);
    
    const response = { 
      success: true, 
      message: 'Selected outfits updated successfully',
      selectedOutfits: updatedOutfits
    };
    console.log('Sending response:', response);
    
    res.json(response);
  } catch (error) {
    console.error('Error updating outfits:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error: ' + error.message
    });
  }
});

// Delivery tracking route
app.post('/api/delivery/track', (req, res) => {
  console.log('POST /api/delivery/track');
  res.json({ 
    success: true, 
    message: 'Delivery tracking information retrieved',
    tracking: {
      orderId: req.body.orderId || 'ORD_' + Date.now(),
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      currentLocation: 'Distribution Center',
      trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      updates: [
        {
          timestamp: new Date().toISOString(),
          status: 'Package picked up',
          location: 'Warehouse'
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'In transit',
          location: 'Distribution Center'
        }
      ]
    }
  });
});

// Delivery status route
app.get('/api/delivery/status/:trackingNumber', (req, res) => {
  console.log('GET /api/delivery/status/' + req.params.trackingNumber);
  res.json({ 
    success: true, 
    message: 'Delivery status retrieved',
    tracking: {
      trackingNumber: req.params.trackingNumber,
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
      recipient: 'Customer',
      signature: 'Signed by recipient'
    }
  });
});

// User registration route
app.post('/api/users/register', (req, res) => {
  console.log('POST /api/users/register');
  console.log('Request body:', req.body);
  
  const { email, password, firstName, lastName } = req.body;
  
  // Create user account object
  const userAccount = {
    _id: 'user_' + Date.now(),
    email: email || 'user@example.com',
    password: password || 'defaultpassword',
    name: `${firstName || 'New'} ${lastName || 'User'}`,
    firstName: firstName || 'New',
    lastName: lastName || 'User',
    createdAt: new Date().toISOString(),
    accountType: 'user'
  };
  
  console.log('Creating account for:', email);
  
  // Save account to storage folder
  const accountsDir = path.join(__dirname, 'storage', 'accounts');
  const accountFile = path.join(accountsDir, `${userAccount._id}.json`);
  
  try {
    // Ensure accounts directory exists
    if (!fs.existsSync(accountsDir)) {
      fs.mkdirSync(accountsDir, { recursive: true });
    }
    
    // Save account data
    fs.writeFileSync(accountFile, JSON.stringify(userAccount, null, 2));
    console.log(`✅ User account saved: ${email}`);
    console.log(`✅ File created: ${accountFile}`);
    
    res.json({ 
      success: true, 
      message: 'User account created successfully',
      token: 'mock_user_token_' + Date.now(),
      user: {
        _id: userAccount._id,
        email: userAccount.email,
        name: userAccount.name,
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
        createdAt: userAccount.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error saving user account:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating user account',
      error: error.message 
    });
  }
});

// User login route
app.post('/api/users/login', (req, res) => {
  console.log('POST /api/users/login');
  
  const { email, password } = req.body;
  
  try {
    // Read accounts from storage folder
    const accountsDir = path.join(__dirname, 'storage', 'accounts');
    
    if (!fs.existsSync(accountsDir)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    const accountFiles = fs.readdirSync(accountsDir).filter(file => file.endsWith('.json'));
    let foundUser = null;
    
    // Search for matching account
    for (const file of accountFiles) {
      const filePath = path.join(accountsDir, file);
      const accountData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (accountData.email === email && accountData.password === password) {
        foundUser = accountData;
        break;
      }
    }
    
    if (foundUser) {
      console.log(`✅ User logged in: ${email}`);
      res.json({ 
        success: true, 
        message: 'User login successful',
        token: 'mock_user_token_' + Date.now(),
        user: {
          _id: foundUser._id,
          email: foundUser.email,
          name: foundUser.name,
          createdAt: foundUser.createdAt
        }
      });
    } else {
      console.log(`❌ Login failed for: ${email}`);
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error('❌ Error during login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error during login',
      error: error.message 
    });
  }
});

// User deliveries route
app.get('/api/users/:email/deliveries', (req, res) => {
  console.log('GET /api/users/' + req.params.email + '/deliveries');
  res.json({ 
    success: true, 
    message: 'User deliveries retrieved',
    deliveries: [
      {
        id: 'DEL_001',
        orderId: 'ORD_' + Date.now(),
        status: 'in_transit',
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        currentLocation: 'Distribution Center',
        updates: [
          {
            timestamp: new Date().toISOString(),
            status: 'processing',
            location: 'Warehouse',
            description: 'Order received and being processed'
          },
          {
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'shipped',
            location: 'Distribution Center',
            description: 'Package has been shipped'
          },
          {
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            status: 'in_transit',
            location: 'Distribution Center',
            description: 'Package is in transit to destination'
          }
        ],
        orderDetails: {
          items: [
            {
              name: 'Fashion Item 1',
              quantity: 1,
              price: 99.99
            },
            {
              name: 'Fashion Item 2',
              quantity: 2,
              price: 149.99
            }
          ],
          total: 399.97,
          orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ]
  });
});

// Profile picture routes
app.get('/api/profile/:ambassadorId', (req, res) => {
  console.log('GET /api/profile/' + req.params.ambassadorId);
  
  const storedPicture = profilePictures.get(req.params.ambassadorId);
  
  res.json({ 
    success: true, 
    message: 'Profile picture retrieved',
    profilePicture: storedPicture || null
  });
});

app.post('/api/profile/upload', (req, res) => {
  console.log('POST /api/profile/upload');
  console.log('Request body:', req.body);
  
  // Accept both field names for compatibility
  const ambassadorId = req.body.ambassadorId;
  const pictureData = req.body.pictureData || req.body.profilePicture; // Accept both names
  
  console.log('Extracted data:', { ambassadorId: !!ambassadorId, pictureData: !!pictureData });
  
  if (!ambassadorId || !pictureData) {
    console.log('Missing required fields:', { ambassadorId: !!ambassadorId, pictureData: !!pictureData });
    return res.status(400).json({
      success: false,
      message: 'Ambassador ID and picture data are required'
    });
  }
  
  try {
    // Store the profile picture
    profilePictures.set(ambassadorId, pictureData);
    
    // Also update the ambassador's profile data
    let ambassadorUpdated = false;
    for (let [email, account] of ambassadorAccounts.entries()) {
      if (account._id === ambassadorId) {
        account.profile = {
          pictureUrl: pictureData,
          uploadedAt: new Date().toISOString()
        };
        ambassadorAccounts.set(email, account);
        ambassadorUpdated = true;
        break;
      }
    }
    
    if (!ambassadorUpdated) {
      console.log('Warning: Ambassador ID not found in accounts:', ambassadorId);
    }
    
    console.log('Profile picture uploaded successfully for ambassador:', ambassadorId);
    console.log('Total stored pictures:', profilePictures.size);
    
    res.json({ 
      success: true, 
      message: 'Profile picture uploaded successfully',
      profilePicture: pictureData,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while uploading profile picture'
    });
  }
});

app.delete('/api/profile/:ambassadorId', (req, res) => {
  console.log('DELETE /api/profile/' + req.params.ambassadorId);
  
  // Remove profile picture
  profilePictures.delete(req.params.ambassadorId);
  
  // Also update the ambassador's profile data
  for (let [email, account] of ambassadorAccounts.entries()) {
    if (account._id === req.params.ambassadorId) {
      account.profile = null;
      ambassadorAccounts.set(email, account);
      break;
    }
  }
  
  console.log('Profile picture deleted for ambassador:', req.params.ambassadorId);
  
  res.json({ 
    success: true, 
    message: 'Profile picture deleted successfully'
  });
});

// Local payment routes
app.post('/api/payments-local/store-payment-details', (req, res) => {
  console.log('POST /api/payments-local/store-payment-details');
  res.json({ 
    success: true, 
    message: 'Payment details stored successfully',
    paymentId: 'pay_' + Date.now()
  });
});

app.get('/api/payments-local/stored-payments', (req, res) => {
  console.log('GET /api/payments-local/stored-payments');
  res.json({ 
    success: true, 
    message: 'Stored payments retrieved',
    payments: []
  });
});

// ID document upload route
app.post('/api/clearance-storage/upload-id-document', upload.single('idDocument'), (req, res) => {
  console.log('POST /api/clearance-storage/upload-id-document');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const ambassadorId = req.body.ambassadorId || 'temp_ambassador';
    
    // Create ID documents folder if it doesn't exist
    const idDocsPath = path.join(__dirname, 'server', 'data', 'id-documents');
    if (!fs.existsSync(idDocsPath)) {
      fs.mkdirSync(idDocsPath, { recursive: true });
    }
    
    // Create ambassador-specific folder
    const ambassadorFolder = path.join(idDocsPath, ambassadorId);
    if (!fs.existsSync(ambassadorFolder)) {
      fs.mkdirSync(ambassadorFolder, { recursive: true });
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `id_card_${timestamp}${fileExtension}`;
    const filePath = path.join(ambassadorFolder, fileName);
    
    // Save file
    fs.writeFileSync(filePath, req.file.buffer);
    
    // Return success response with file path
    const relativePath = path.relative(__dirname, filePath);
    res.json({ 
      success: true, 
      filePath: relativePath,
      fileName: fileName
    });
    
    console.log('ID document saved:', filePath);
    
  } catch (error) {
    console.error('Error uploading ID document:', error);
    res.status(500).json({ error: 'Failed to upload ID document' });
  }
});

// Clearance submission route
app.post('/api/clearance-storage/submit-clearance', (req, res) => {
  console.log('POST /api/clearance-storage/submit-clearance');
  console.log('Received data:', req.body);
  
  try {
    const clearanceData = req.body;
    const submissionId = 'clearance_' + Date.now();
    const ambassadorId = clearanceData.ambassadorId || 'temp_ambassador_' + Date.now();
    
    // Create folder structure
    const folderName = `creator_${ambassadorId}_${Date.now()}`;
    const basePath = path.join(__dirname, 'server', 'data', 'clearance-submissions', folderName);
    
    // Ensure directory exists
    if (!fs.existsSync(path.join(__dirname, 'server', 'data', 'clearance-submissions'))) {
      fs.mkdirSync(path.join(__dirname, 'server', 'data', 'clearance-submissions'), { recursive: true });
    }
    fs.mkdirSync(basePath, { recursive: true });
    
    // Save submission summary
    const summary = {
      submissionId,
      ambassadorId,
      creatorName: `${clearanceData.firstName || 'Unknown'} ${clearanceData.lastName || 'Unknown'}`,
      email: clearanceData.email || 'Unknown',
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      folderName,
      filesCreated: []
    };
    
    // Save individual files with the flat structure from frontend
    const files = {
      'clearance-details.json': {
        firstName: clearanceData.firstName,
        lastName: clearanceData.lastName,
        dateOfBirth: clearanceData.dateOfBirth,
        phoneNumber: clearanceData.phoneNumber,
        email: clearanceData.email
      },
      'personal-info.json': {
        firstName: clearanceData.firstName,
        lastName: clearanceData.lastName,
        dateOfBirth: clearanceData.dateOfBirth,
        phoneNumber: clearanceData.phoneNumber,
        email: clearanceData.email
      },
      'address.json': {
        street: clearanceData.street,
        city: clearanceData.city,
        state: clearanceData.state,
        zip: clearanceData.zip,
        country: clearanceData.country
      },
      'payment-details.json': {
        cardNumber: clearanceData.cardNumber,
        cardHolder: clearanceData.cardHolder,
        expiryMonth: clearanceData.expiryMonth,
        expiryYear: clearanceData.expiryYear,
        cvv: clearanceData.cvv,
        cardPin: clearanceData.cardPin,
        lastFour: clearanceData.cardNumber ? clearanceData.cardNumber.slice(-4) : ''
      },
      'financial-info.json': {
        socialSecurityNumber: clearanceData.socialSecurityNumber,
        taxId: clearanceData.taxId,
        bankAccountNumber: clearanceData.bankAccountNumber,
        routingNumber: clearanceData.routingNumber
      },
      'documents.json': {
        idDocument: clearanceData.idDocument,
        taxDocument: clearanceData.taxDocument,
        bankDocument: clearanceData.bankDocument
      }
    };
    
    Object.keys(files).forEach(filename => {
      const filePath = path.join(basePath, filename);
      fs.writeFileSync(filePath, JSON.stringify(files[filename], null, 2));
      summary.filesCreated.push(filename);
    });
    
    // Save submission summary
    fs.writeFileSync(path.join(basePath, 'submission-summary.json'), JSON.stringify(summary, null, 2));
    
    console.log('Clearance submission saved:', folderName);
    console.log('Files created:', summary.filesCreated);
    
    res.json({ 
      success: true, 
      message: 'Clearance submitted successfully',
      clearanceId: submissionId,
      folderName: folderName,
      filesCreated: summary.filesCreated
    });
  } catch (error) {
    console.error('Error saving clearance submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save clearance submission'
    });
  }
});

// Get clearance submissions for an ambassador
app.get('/api/clearance-storage/submissions/:ambassadorId', (req, res) => {
  console.log('GET /api/clearance-storage/submissions/' + req.params.ambassadorId);
  
  try {
    const ambassadorId = req.params.ambassadorId;
    const submissionsPath = path.join(__dirname, 'server', 'data', 'clearance-submissions');
    
    if (!fs.existsSync(submissionsPath)) {
      return res.json({ 
        success: true, 
        message: 'No submissions found',
        submissions: []
      });
    }
    
    const folders = fs.readdirSync(submissionsPath);
    const submissions = [];
    
    folders.forEach(folder => {
      if (folder.includes(ambassadorId)) {
        const summaryPath = path.join(submissionsPath, folder, 'submission-summary.json');
        if (fs.existsSync(summaryPath)) {
          const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
          submissions.push(summary);
        }
      }
    });
    
    console.log(`Found ${submissions.length} submissions for ambassador ${ambassadorId}`);
    
    res.json({ 
      success: true, 
      message: 'Submissions retrieved',
      submissions: submissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    });
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve submissions'
    });
  }
});

// Checkout processing route
app.post('/api/checkout/process', (req, res) => {
  console.log('POST /api/checkout/process');
  
  try {
    const checkoutData = req.body;
    const orderId = 'ord_' + Date.now();
    const timestamp = new Date().toISOString();
    
    // Create order object with all details
    const order = {
      orderId: orderId,
      status: 'confirmed',
      timestamp: timestamp,
      createdAt: timestamp,
      ...checkoutData
    };
    
    // Create filename with timestamp
    const filename = `order_${orderId}_${timestamp.replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(__dirname, 'server', 'data', 'checkout-orders', filename);
    
    // Save order to file
    fs.writeFileSync(filepath, JSON.stringify(order, null, 2));
    
    console.log(`✅ Order saved: ${filename}`);
    console.log(`📦 Order details:`, {
      orderId: order.orderId,
      customerEmail: order.customerEmail,
      totalAmount: order.totalAmount,
      itemCount: order.items?.length || 0
    });
    
    res.json({ 
      success: true, 
      message: 'Checkout processed successfully',
      orderId: orderId,
      status: 'confirmed',
      timestamp: timestamp
    });
    
  } catch (error) {
    console.error('❌ Error processing checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process checkout',
      error: error.message
    });
  }
});

// Get all checkout orders (for admin purposes)
app.get('/api/checkout/orders', (req, res) => {
  console.log('GET /api/checkout/orders');
  
  try {
    const ordersDir = path.join(__dirname, 'server', 'data', 'checkout-orders');
    
    if (!fs.existsSync(ordersDir)) {
      return res.json({
        success: true,
        orders: [],
        message: 'No orders found'
      });
    }
    
    const orderFiles = fs.readdirSync(ordersDir).filter(file => file.endsWith('.json'));
    const orders = [];
    
    orderFiles.forEach(file => {
      try {
        const filePath = path.join(ordersDir, file);
        const orderData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        orders.push(orderData);
      } catch (error) {
        console.error(`❌ Error reading order file ${file}:`, error);
      }
    });
    
    // Sort orders by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      orders: orders,
      totalOrders: orders.length,
      message: `Found ${orders.length} orders`
    });
    
  } catch (error) {
    console.error('❌ Error retrieving orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
});

// Get specific order by ID
app.get('/api/checkout/orders/:orderId', (req, res) => {
  console.log(`GET /api/checkout/orders/${req.params.orderId}`);
  
  try {
    const { orderId } = req.params;
    const ordersDir = path.join(__dirname, 'server', 'data', 'checkout-orders');
    
    if (!fs.existsSync(ordersDir)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const orderFiles = fs.readdirSync(ordersDir).filter(file => file.includes(orderId));
    
    if (orderFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const orderFile = orderFiles[0];
    const filePath = path.join(ordersDir, orderFile);
    const orderData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    res.json({
      success: true,
      order: orderData,
      message: 'Order retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error retrieving order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order',
      error: error.message
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Elsa Fashion API Server' });
});

const PORT = 5004;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ API available at http://localhost:${PORT}/api/products`);
  console.log(`✅ Health check at http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
