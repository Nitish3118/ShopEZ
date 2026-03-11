const User = require('./models/User');
const Product = require('./models/Product');

const seedData = async () => {
  try {
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`ℹ️  Database already has ${existingProducts} products. Skipping seed.`);
      console.log('   To re-seed, drop the products collection in MongoDB and restart.');
      return;
    }

    console.log('🌱 Seeding sample data...');

    // Create seller
    let seller = await User.findOne({ email: 'seller@shopez.com' });
    if (!seller) {
      seller = await User.create({
        name: 'ShopEZ Store',
        email: 'seller@shopez.com',
        password: 'seller123',
        role: 'seller'
      });
    }

    // Create buyer
    const buyerExists = await User.findOne({ email: 'buyer@shopez.com' });
    if (!buyerExists) {
      await User.create({
        name: 'John Doe',
        email: 'buyer@shopez.com',
        password: 'buyer123',
        role: 'buyer'
      });
    }

    const products = [
      {
        name: 'Premium Wireless Headphones',
        description: 'Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.',
        price: 149.99,
        originalPrice: 249.99,
        discount: 40,
        category: 'Electronics',
        brand: 'SoundPro',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        stock: 50,
        seller: seller._id,
        featured: true,
        tags: ['headphones', 'wireless', 'audio'],
        reviews: [{ name: 'Alice', rating: 5, comment: 'Amazing sound quality!' }, { name: 'Bob', rating: 4, comment: 'Great value for money' }]
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Track your health metrics with precision. Heart rate monitoring, GPS, sleep tracking, and 100+ workout modes. Water resistant up to 50 meters.',
        price: 199.99,
        originalPrice: 299.99,
        discount: 33,
        category: 'Electronics',
        brand: 'FitTech',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
        stock: 30,
        seller: seller._id,
        featured: true,
        tags: ['smartwatch', 'fitness', 'health']
      },
      {
        name: 'Minimalist Leather Wallet',
        description: 'Slim, elegant RFID-blocking leather wallet. Holds up to 8 cards and cash. Made from genuine full-grain leather that ages beautifully.',
        price: 49.99,
        originalPrice: 79.99,
        discount: 37,
        category: 'Accessories',
        brand: 'LeatherCraft',
        images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=600'],
        stock: 100,
        seller: seller._id,
        featured: false,
        tags: ['wallet', 'leather', 'accessories']
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Designed for all-day comfort, this ergonomic chair features lumbar support, adjustable armrests, breathable mesh back, and 360-degree swivel.',
        price: 349.99,
        originalPrice: 499.99,
        discount: 30,
        category: 'Furniture',
        brand: 'ComfortPlus',
        images: ['https://images.unsplash.com/photo-1596162954151-cdcb4c0f70a8?w=600'],
        stock: 15,
        seller: seller._id,
        featured: true,
        tags: ['chair', 'office', 'ergonomic']
      },
      {
        name: 'Mechanical Keyboard',
        description: 'Tactile typing experience with Cherry MX switches. RGB backlit, compact TKL layout, durable aluminum frame, and programmable macros.',
        price: 129.99,
        originalPrice: 179.99,
        discount: 27,
        category: 'Electronics',
        brand: 'TypeMaster',
        images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600'],
        stock: 40,
        seller: seller._id,
        featured: false,
        tags: ['keyboard', 'mechanical', 'gaming']
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip, eco-friendly yoga mat made from natural rubber. 6mm thickness for joint support, alignment lines, and carrying strap included.',
        price: 64.99,
        originalPrice: 89.99,
        discount: 27,
        category: 'Sports',
        brand: 'ZenFit',
        images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'],
        stock: 75,
        seller: seller._id,
        featured: false,
        tags: ['yoga', 'fitness', 'wellness']
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Triple-insulated 32oz water bottle keeps drinks cold 48 hours and hot 24 hours. BPA-free, leak-proof, dishwasher safe.',
        price: 34.99,
        originalPrice: 49.99,
        discount: 30,
        category: 'Sports',
        brand: 'HydroFlow',
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
        stock: 120,
        seller: seller._id,
        featured: false,
        tags: ['water bottle', 'hydration', 'eco-friendly']
      },
      {
        name: 'Designer Sunglasses',
        description: 'UV400 protected polarized lenses in a lightweight titanium frame. Stylish wrap-around design perfect for outdoor activities.',
        price: 89.99,
        originalPrice: 139.99,
        discount: 35,
        category: 'Accessories',
        brand: 'VisionStyle',
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
        stock: 60,
        seller: seller._id,
        featured: true,
        tags: ['sunglasses', 'eyewear', 'fashion']
      },
      {
        name: 'Portable Bluetooth Speaker',
        description: 'Waterproof IPX7 speaker with 360-degree surround sound, 20-hour playback, and built-in power bank. Perfect for outdoor adventures.',
        price: 79.99,
        originalPrice: 119.99,
        discount: 33,
        category: 'Electronics',
        brand: 'SoundPro',
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
        stock: 45,
        seller: seller._id,
        featured: false,
        tags: ['speaker', 'bluetooth', 'portable']
      },
      {
        name: 'Ceramic Coffee Set',
        description: 'Handcrafted 6-piece ceramic coffee set with 2 mugs, saucers, and matching sugar/creamer bowls. Microwave and dishwasher safe.',
        price: 54.99,
        originalPrice: 74.99,
        discount: 26,
        category: 'Home',
        brand: 'ArtisanClay',
        images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600'],
        stock: 35,
        seller: seller._id,
        featured: false,
        tags: ['coffee', 'ceramic', 'kitchen']
      },
      {
        name: 'Running Shoes Pro',
        description: 'Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole for all terrains.',
        price: 119.99,
        originalPrice: 169.99,
        discount: 29,
        category: 'Sports',
        brand: 'SwiftRun',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
        stock: 80,
        seller: seller._id,
        featured: true,
        tags: ['shoes', 'running', 'sports']
      },
      {
        name: 'Scented Candle Collection',
        description: 'Set of 3 luxury soy wax candles in hand-poured glass jars. Fragrances: Lavender Dream, Vanilla Warmth, Cedar Forest. 50+ hours each.',
        price: 39.99,
        originalPrice: 59.99,
        discount: 33,
        category: 'Home',
        brand: 'GlowLux',
        images: ['https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600'],
        stock: 90,
        seller: seller._id,
        featured: false,
        tags: ['candles', 'home decor', 'scented']
      }
    ];

    for (const p of products) {
      const product = new Product(p);
      if (product.reviews && product.reviews.length > 0) {
        product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
        product.numReviews = product.reviews.length;
      }
      await product.save();
    }

    console.log('✅ Sample data seeded successfully!');
    console.log('📧 Seller: seller@shopez.com / seller123');
    console.log('📧 Buyer: buyer@shopez.com / buyer123');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

module.exports = seedData;
