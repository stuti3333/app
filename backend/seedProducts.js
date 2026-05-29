import mongoose from 'mongoose';
import Product from './models/productModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to generate products for a category
const generateProducts = (category, count, baseData) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const suffix = i + 1;
    products.push({
      name: `${baseData.name} ${suffix}`,
      slug: `${baseData.slug}-${suffix}`,
      color: baseData.colors[i % baseData.colors.length],
      category: category,
      image: baseData.images[i % baseData.images.length],
      price:
        baseData.priceRange[0] +
        Math.random() * (baseData.priceRange[1] - baseData.priceRange[0]),
      countInStock: Math.floor(Math.random() * 100) + 10,
      brand: baseData.brands[i % baseData.brands.length],
      rating: (Math.random() * 2 + 3).toFixed(1),
      numReviews: Math.floor(Math.random() * 500) + 50,
      description: `${baseData.description} Variant ${suffix} with premium quality and excellent features.`,
    });
  }
  return products;
};

const categoryData = {
  Electronics: {
    count: 150,
    name: 'Electronic Device',
    slug: 'electronic-device',
    colors: ['Black', 'Silver', 'White', 'Blue', 'Red', 'Gray'],
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
      'https://images.unsplash.com/photo-1580910051074-3eb694886f9d?w=500',
    ],
    priceRange: [50, 2000],
    brands: [
      'Apple',
      'Samsung',
      'Sony',
      'LG',
      'Dell',
      'HP',
      'Microsoft',
      'Asus',
    ],
    description:
      'High-quality electronic device with advanced features and modern technology.',
  },
  Fashion: {
    count: 320,
    name: 'Fashion Item',
    slug: 'fashion-item',
    colors: ['Black', 'White', 'Blue', 'Red', 'Green', 'Brown', 'Gray', 'Pink'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500',
    ],
    priceRange: [20, 500],
    brands: [
      'Zara',
      'H&M',
      'Nike',
      'Adidas',
      "Levi's",
      'Gucci',
      'Prada',
      'Uniqlo',
    ],
    description:
      'Stylish fashion item with premium materials and contemporary design.',
  },
  Home: {
    count: 89,
    name: 'Home Product',
    slug: 'home-product',
    colors: ['White', 'Brown', 'Gray', 'Black', 'Beige', 'Blue'],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
    ],
    priceRange: [30, 1500],
    brands: [
      'IKEA',
      'West Elm',
      'Target',
      'Amazon Basics',
      'Philips',
      'Brooklinen',
    ],
    description: 'Quality home product designed for comfort and functionality.',
  },
  Beauty: {
    count: 120,
    name: 'Beauty Product',
    slug: 'beauty-product',
    colors: ['White', 'Pink', 'Gold', 'Black', 'Red', 'Purple'],
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
    ],
    priceRange: [15, 300],
    brands: [
      'The Ordinary',
      'CeraVe',
      'Chanel',
      'Dior',
      'MAC',
      'Olaplex',
      "L'Oreal",
    ],
    description:
      'Premium beauty product for enhancing your natural beauty and skincare routine.',
  },
  Books: {
    count: 200,
    name: 'Book',
    slug: 'book',
    colors: ['Blue', 'Red', 'Green', 'Black', 'Brown', 'Yellow'],
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
    ],
    priceRange: [10, 100],
    brands: [
      'Penguin',
      'HarperCollins',
      'Random House',
      'Simon & Schuster',
      'Macmillan',
      'Tor Books',
    ],
    description:
      'Engaging book that captivates readers with compelling stories and valuable insights.',
  },
  Sports: {
    count: 75,
    name: 'Sports Equipment',
    slug: 'sports-equipment',
    colors: ['Black', 'Red', 'Blue', 'Green', 'Orange', 'White'],
    images: [
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500',
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500',
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500',
    ],
    priceRange: [20, 500],
    brands: [
      'Nike',
      'Adidas',
      'Under Armour',
      'Wilson',
      'Spalding',
      'Garmin',
      'Bowflex',
    ],
    description:
      'Professional sports equipment designed for performance and durability.',
  },
  Toys: {
    count: 95,
    name: 'Toy',
    slug: 'toy',
    colors: ['Multicolor', 'Blue', 'Red', 'Green', 'Yellow', 'Pink'],
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500',
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500',
    ],
    priceRange: [15, 200],
    brands: [
      'LEGO',
      'Hasbro',
      'Mattel',
      'Fisher-Price',
      'Crayola',
      "K'NEX",
      'Traxxas',
    ],
    description:
      'Fun and educational toy designed to inspire creativity and learning.',
  },
  Groceries: {
    count: 180,
    name: 'Grocery Item',
    slug: 'grocery-item',
    colors: ['Brown', 'Green', 'Yellow', 'Red', 'White', 'Golden'],
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500',
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
    ],
    priceRange: [5, 100],
    brands: [
      'Starbucks',
      'Colavita',
      'De Cecco',
      'Twinings',
      "Nature Nate's",
      'Organic Valley',
    ],
    description:
      'Quality grocery item sourced from trusted suppliers for your daily needs.',
  },
};

// Generate all products
const products = [];
Object.keys(categoryData).forEach((category) => {
  const data = categoryData[category];
  const categoryProducts = generateProducts(category, data.count, data);
  products.push(...categoryProducts);
});

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Products seeded successfully');

    // Count products per category
    const categoryCounts = {};
    for (const category of Object.keys(categoryData)) {
      const count = await Product.countDocuments({ category });
      categoryCounts[category] = count;
    }

    console.log('\nCategory Product Counts:');
    Object.keys(categoryCounts).forEach((category) => {
      console.log(`${category}: ${categoryCounts[category]} products`);
    });

    console.log(`\nTotal products seeded: ${products.length}`);
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
