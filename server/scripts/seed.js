require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const PlatformSetting = require('../models/PlatformSetting');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/craftnest';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany(),
      SellerProfile.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
      Cart.deleteMany(),
      Wishlist.deleteMany(),
      PlatformSetting.deleteMany()
    ]);

    console.log('Creating platform settings...');
    await PlatformSetting.create({
      commissionPercent: 10,
      marketplaceName: 'CraftNest',
      tagline: 'Handmade with Heart',
      announcementNotice: 'Welcome to CraftNest! Free delivery across India on artisanal orders above ₹999.',
      supportEmail: 'support@craftnest.in'
    });

    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('Admin@123', salt);
    const sellerHash = await bcrypt.hash('Seller@123', salt);
    const buyerHash = await bcrypt.hash('Buyer@123', salt);

    // 1. Admin
    const admin = await User.create({
      name: 'CraftNest Admin',
      email: 'admin@craftnest.in',
      passwordHash: adminHash,
      role: 'admin',
      phone: '+91 98765 00001',
      accountStatus: 'active'
    });

    // 2. Sellers
    const sellerAarohi = await User.create({
      name: 'Aarohi Sharma',
      email: 'aarohi@craftnest.in',
      passwordHash: sellerHash,
      role: 'seller',
      phone: '+91 98765 11002',
      accountStatus: 'active'
    });

    const sellerKavya = await User.create({
      name: 'Kavya Patel',
      email: 'kavya@craftnest.in',
      passwordHash: sellerHash,
      role: 'seller',
      phone: '+91 98765 22003',
      accountStatus: 'active'
    });

    const sellerDhruv = await User.create({
      name: 'Dhruv Verma',
      email: 'dhruv@craftnest.in',
      passwordHash: sellerHash,
      role: 'seller',
      phone: '+91 98765 33004',
      accountStatus: 'active'
    });

    // 3. Buyers
    const buyerPriya = await User.create({
      name: 'Priya Sundaram',
      email: 'priya@example.com',
      passwordHash: buyerHash,
      role: 'buyer',
      phone: '+91 98111 44556',
      addresses: [{
        fullName: 'Priya Sundaram',
        phone: '+91 98111 44556',
        street: '402 Lotus Meadows, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
        isDefault: true
      }],
      accountStatus: 'active'
    });

    const buyerRahul = await User.create({
      name: 'Rahul Sen',
      email: 'rahul@example.com',
      passwordHash: buyerHash,
      role: 'buyer',
      phone: '+91 97222 88990',
      addresses: [{
        fullName: 'Rahul Sen',
        phone: '+91 97222 88990',
        street: '12-B Green Park Extension',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110016',
        country: 'India',
        isDefault: true
      }],
      accountStatus: 'active'
    });

    console.log('Creating seller profiles...');
    const profileAarohi = await SellerProfile.create({
      userId: sellerAarohi._id,
      shopName: 'Aarohi Botanicals & Candles',
      slug: 'aarohi-botanicals',
      description: 'Hand-poured 100% natural soy wax candles infused with pure therapeutic grade essential oils and botanical petals.',
      logo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
      contactDetails: {
        email: 'aarohi@craftnest.in',
        phone: '+91 98765 11002',
        city: 'Jaipur',
        state: 'Rajasthan',
        craftSpeciality: 'Soy Wax Candles & Botanical Fragrances'
      },
      approvalStatus: 'approved',
      rating: 4.9,
      totalSalesCount: 48
    });

    const profileKavya = await SellerProfile.create({
      userId: sellerKavya._id,
      shopName: 'Kavya Knotwork & Crochet',
      slug: 'kavya-knotwork',
      description: 'Slow-crafted crochet, knitted blankets, and macramé wall decor woven with organic cotton yarn and mindful care.',
      logo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
      contactDetails: {
        email: 'kavya@craftnest.in',
        phone: '+91 98765 22003',
        city: 'Ahmedabad',
        state: 'Gujarat',
        craftSpeciality: 'Crochet & Cotton Macramé'
      },
      approvalStatus: 'approved',
      rating: 4.8,
      totalSalesCount: 35
    });

    const profileDhruv = await SellerProfile.create({
      userId: sellerDhruv._id,
      shopName: 'Mitti & Clay Studio',
      slug: 'mitti-and-clay',
      description: 'Earth-fired terracotta pottery, hand-painted ceramic mugs, and resin botanical jewellery capturing natural elegance.',
      logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80',
      banner: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      contactDetails: {
        email: 'dhruv@craftnest.in',
        phone: '+91 98765 33004',
        city: 'Pune',
        state: 'Maharashtra',
        craftSpeciality: 'Terracotta Pottery & Hand-Painted Ceramic'
      },
      approvalStatus: 'approved',
      rating: 4.9,
      totalSalesCount: 62
    });

    console.log('Creating curated handmade products...');
    const productsData = [
      {
        sellerId: sellerAarohi._id,
        name: 'Lavender & Dried Botanical Soy Wax Candle',
        slug: 'lavender-dried-botanical-soy-wax-candle',
        description: 'Hand-poured candle made from 100% natural golden soy wax, topped with organic French lavender buds and rose petals. Emits a soothing aroma that relieves stress and creates an intimate serene ambiance.',
        category: 'Handmade Candles',
        price: 549,
        stock: 24,
        images: [
          'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1572726729437-3732efc7ec9e?auto=format&fit=crop&w=800&q=80'
        ],
        materials: '100% Natural Soy Wax, Cotton Wick, Dried French Lavender, Essential Oils',
        dimensions: '8cm diameter x 9cm height (240g)',
        customizationAvailable: true,
        customizationNotes: 'Custom gift tag message or fragrance intensity on request',
        processingTime: '1-2 business days',
        featured: true,
        salesCount: 18,
        averageRating: 4.9,
        reviewCount: 3
      },
      {
        sellerId: sellerAarohi._id,
        name: 'Spiced Vanilla & Amber Artisanal Concrete Candle',
        slug: 'spiced-vanilla-amber-concrete-candle',
        description: 'Poured into a handcrafted fluted terracotta-tone concrete jar. Features a wooden crackling wick with rich notes of warm Madagascar vanilla, spiced cinnamon, and sandalwood amber.',
        category: 'Handmade Candles',
        price: 799,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1508759073847-9ca702cec7d2?auto=format&fit=crop&w=800&q=80'
        ],
        materials: 'Handmade concrete jar, Wooden crackle wick, Pure Soy-Coconut blend wax',
        dimensions: '9cm x 9cm x 10cm (320g)',
        customizationAvailable: false,
        processingTime: '2-3 business days',
        featured: true,
        salesCount: 12,
        averageRating: 5.0,
        reviewCount: 2
      },
      {
        sellerId: sellerDhruv._id,
        name: 'Handcrafted Real Pressed Wildflower Resin Necklace',
        slug: 'real-pressed-wildflower-resin-necklace',
        description: 'Delicate teardrop pendant preserving real hand-picked Himalayan forget-me-nots and baby’s breath in crystal-clear eco-resin, strung on an 18K gold-plated hypoallergenic chain.',
        category: 'Jewellery',
        price: 899,
        stock: 10,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
        ],
        materials: 'Preserved botanicals, UV-resistant eco-resin, 18K gold-plated brass chain',
        dimensions: 'Pendant: 2.5cm x 1.8cm, Chain length: 45cm + 5cm extension',
        customizationAvailable: true,
        customizationNotes: 'Choice of silver chain or specific flower petal colors',
        processingTime: '2-4 business days',
        featured: true,
        salesCount: 22,
        averageRating: 4.8,
        reviewCount: 4
      },
      {
        sellerId: sellerDhruv._id,
        name: 'Terracotta & Raw Brass Dangle Statement Earrings',
        slug: 'terracotta-raw-brass-dangle-earrings',
        description: 'Earthy hand-rolled terracotta clay beads baked to a warm rustic finish, accented with hand-hammered raw brass arches. Lightweight, hypoallergenic, and timelessly modern.',
        category: 'Jewellery',
        price: 649,
        stock: 14,
        images: [
          'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'
        ],
        materials: 'Natural terracotta clay, Raw unlacquered brass, Surgical steel posts',
        dimensions: '5.5cm drop length, weight: 6g pair',
        customizationAvailable: false,
        processingTime: '1-2 business days',
        featured: false,
        salesCount: 9,
        averageRating: 4.7,
        reviewCount: 2
      },
      {
        sellerId: sellerKavya._id,
        name: 'Hand-Knitted Chunky Merino Wool Throw Blanket',
        slug: 'hand-knitted-chunky-merino-throw-blanket',
        description: 'Incredibly cozy, tactile cloud-soft throw hand-knitted without needles using chunky organic wool. An exquisite centerpiece for couches, reading nooks, or bed layering.',
        category: 'Crochet and Knitting',
        price: 2499,
        stock: 6,
        images: [
          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80'
        ],
        materials: '100% Unspun Australian Merino Wool (Ethically Sourced)',
        dimensions: '120cm x 150cm (48in x 60in)',
        customizationAvailable: true,
        customizationNotes: 'Available in Forest Green, Warm Cream, Terracotta, or Soft Grey',
        processingTime: '5-7 business days',
        featured: true,
        salesCount: 8,
        averageRating: 5.0,
        reviewCount: 2
      },
      {
        sellerId: sellerKavya._id,
        name: 'Everlasting Crochet Sunflower & Daisy Table Bouquet',
        slug: 'everlasting-crochet-sunflower-daisy-bouquet',
        description: 'Cheery handmade crochet blossoms that never wilt. Features 3 golden sunflowers, 4 white meadow daisies, and eucalyptus sprigs wrapped in craft twine.',
        category: 'Crochet and Knitting',
        price: 1199,
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
        ],
        materials: '100% Mercerized Cotton Yarn, Floral wire stems, Jute ribbon',
        dimensions: 'Height: 32cm, Bouquet span: 20cm',
        customizationAvailable: true,
        customizationNotes: 'Custom flower combinations or wrapped vase included on request',
        processingTime: '3-4 business days',
        featured: false,
        salesCount: 14,
        averageRating: 4.9,
        reviewCount: 3
      },
      {
        sellerId: sellerDhruv._id,
        name: 'Hand-Thrown Ceramic Coffee Mug with Forest Glaze',
        slug: 'hand-thrown-ceramic-coffee-mug-forest-glaze',
        description: 'Individually wheel-thrown stoneware mug finished in a cascading forest-green reactive glaze. Each mug possesses organic variations that celebrate the artisan potter’s touch.',
        category: 'Home Décor',
        price: 749,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
        ],
        materials: 'High-fire stoneware clay, Food-safe lead-free reactive glaze',
        dimensions: 'Capacity: 350ml, Height: 9.5cm, Diameter: 8.5cm',
        customizationAvailable: false,
        processingTime: '1-2 business days',
        featured: true,
        salesCount: 25,
        averageRating: 4.9,
        reviewCount: 5
      },
      {
        sellerId: sellerKavya._id,
        name: 'Bohemian Woven Cotton Macramé Wall Hanging',
        slug: 'bohemian-woven-cotton-macrame-wall-hanging',
        description: 'Intricately hand-knotted natural cotton macramé tapestry mounted on a sustainably sourced natural teakwood drift branch. Adds warmth, acoustic softness, and artisanal texture.',
        category: 'Home Décor',
        price: 1399,
        stock: 8,
        images: [
          'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'
        ],
        materials: '4mm unbleached braided cotton cord, Natural reclaimed wood rod',
        dimensions: 'Width: 50cm, Length: 85cm from wood dowel',
        customizationAvailable: true,
        customizationNotes: 'Custom dimensions or dip-dyed ombre tones available',
        processingTime: '3-5 business days',
        featured: false,
        salesCount: 11,
        averageRating: 4.8,
        reviewCount: 2
      },
      {
        sellerId: sellerDhruv._id,
        name: 'Madhubani "Tree of Life" Original Folk Painting',
        slug: 'madhubani-tree-of-life-original-painting',
        description: 'Authentic Mithila folk painting meticulously detailed with natural mineral pigments and fine nib pens on handmade Lokta paper. Depicts peacocks and birds nestled in the eternal sacred tree.',
        category: 'Paintings and Art',
        price: 1899,
        stock: 5,
        images: [
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
        ],
        materials: 'Handmade acid-free Lokta paper, Natural organic ink & acrylic pigments',
        dimensions: '12in x 16in (unframed, shipped in protective roll)',
        customizationAvailable: true,
        customizationNotes: 'Name inscriptions or custom border motifs',
        processingTime: '4-6 business days',
        featured: true,
        salesCount: 7,
        averageRating: 5.0,
        reviewCount: 3
      },
      {
        sellerId: sellerAarohi._id,
        name: 'Botanical Pressed Petal Greeting Cards (Pack of 5)',
        slug: 'botanical-pressed-petal-greeting-cards-pack-of-5',
        description: 'Set of 5 artisanal folded cards made from cotton rag deckle-edge paper, decorated with hand-pressed wild marigold, cosmos, and bougainvillea petals with matching Kraft envelopes.',
        category: 'Greeting Cards',
        price: 499,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'
        ],
        materials: '100% recycled cotton rag paper, Pressed floral specimens, Recycled kraft envelopes',
        dimensions: 'A6 size (10.5cm x 14.8cm)',
        customizationAvailable: true,
        customizationNotes: 'Calligraphy name personalization inside or on envelopes',
        processingTime: '1-2 business days',
        featured: false,
        salesCount: 19,
        averageRating: 4.8,
        reviewCount: 3
      },
      {
        sellerId: sellerAarohi._id,
        name: 'The Artisan Sanctuary Self-Care Gift Hamper',
        slug: 'the-artisan-sanctuary-self-care-gift-hamper',
        description: 'Curated luxury care package containing 1 botanical soy candle, 1 handmade cold-process goat milk & honey soap, 1 lavender bath soak jar, and a ceramic match striker in a reusable wooden crate.',
        category: 'Gift Hampers',
        price: 1799,
        stock: 14,
        images: [
          'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        ],
        materials: 'Pinewood box, Botanical bath soak, Cold-process artisan soap, Soy candle',
        dimensions: 'Box: 25cm x 20cm x 12cm',
        customizationAvailable: true,
        customizationNotes: 'Handwritten calligraphed gift note with recipient name',
        processingTime: '2-3 business days',
        featured: true,
        salesCount: 16,
        averageRating: 5.0,
        reviewCount: 4
      },
      {
        sellerId: sellerDhruv._id,
        name: 'Hand-Engraved Teak Wood Name Plaque with Pyrography',
        slug: 'hand-engraved-teak-wood-name-plaque-pyrography',
        description: 'Custom family nameplate crafted from live-edge reclaimed teak wood, wood-burned by hand using traditional pyrography techniques and sealed with natural beeswax polish.',
        category: 'Personalized Gifts',
        price: 1299,
        stock: 9,
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        ],
        materials: 'Reclaimed seasoned teak wood, Natural beeswax & mineral oil sealant, Brass hanging hardware',
        dimensions: '35cm x 14cm x 2cm',
        customizationAvailable: true,
        customizationNotes: 'Provide custom family name, house number, or floral border choice',
        processingTime: '4-7 business days',
        featured: true,
        salesCount: 15,
        averageRating: 4.9,
        reviewCount: 3
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} artisanal products.`);

    console.log('Creating initial orders for demonstration...');
    // Create an order for buyerPriya
    const candleProd = createdProducts[0];
    const mugProd = createdProducts[6];
    const orderItems1 = [
      {
        productId: candleProd._id,
        sellerId: candleProd.sellerId,
        productNameSnapshot: candleProd.name,
        unitPriceSnapshot: candleProd.price,
        imageSnapshot: candleProd.images[0],
        quantity: 2,
        itemStatus: 'Delivered'
      },
      {
        productId: mugProd._id,
        sellerId: mugProd.sellerId,
        productNameSnapshot: mugProd.name,
        unitPriceSnapshot: mugProd.price,
        imageSnapshot: mugProd.images[0],
        quantity: 1,
        itemStatus: 'Delivered'
      }
    ];

    const subtotal1 = candleProd.price * 2 + mugProd.price * 1;
    const shippingFee1 = subtotal1 > 999 ? 0 : 79;
    const total1 = subtotal1 + shippingFee1;
    const comm1 = Math.round(subtotal1 * 0.1);

    const order1 = await Order.create({
      orderNumber: 'CN-202610-1001',
      buyerId: buyerPriya._id,
      items: orderItems1,
      shippingAddressSnapshot: buyerPriya.addresses[0],
      subtotal: subtotal1,
      shippingFee: shippingFee1,
      total: total1,
      paymentMethod: 'TestCard',
      paymentStatus: 'paid',
      orderStatus: 'Delivered',
      commissionAmount: comm1,
      sellerEarnings: subtotal1 - comm1,
      trackingInformation: { carrier: 'BlueDart Artisanal Express', trackingNumber: 'BD98273641IN' },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    // Create a pending/processing order for buyerRahul
    const hamperProd = createdProducts[10];
    const orderItems2 = [
      {
        productId: hamperProd._id,
        sellerId: hamperProd.sellerId,
        productNameSnapshot: hamperProd.name,
        unitPriceSnapshot: hamperProd.price,
        imageSnapshot: hamperProd.images[0],
        quantity: 1,
        itemStatus: 'Processing'
      }
    ];
    const subtotal2 = hamperProd.price;
    const shippingFee2 = 0;
    const total2 = subtotal2 + shippingFee2;
    const comm2 = Math.round(subtotal2 * 0.1);

    const order2 = await Order.create({
      orderNumber: 'CN-202610-1002',
      buyerId: buyerRahul._id,
      items: orderItems2,
      shippingAddressSnapshot: buyerRahul.addresses[0],
      subtotal: subtotal2,
      shippingFee: shippingFee2,
      total: total2,
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      orderStatus: 'Processing',
      commissionAmount: comm2,
      sellerEarnings: subtotal2 - comm2,
      notes: 'Please add a birthday card wishing Ananya!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });

    console.log('Creating verified buyer reviews...');
    await Review.create([
      {
        buyerId: buyerPriya._id,
        productId: candleProd._id,
        orderId: order1._id,
        buyerName: buyerPriya.name,
        rating: 5,
        comment: 'The scent throw on this lavender candle is divine! You can immediately tell it is pure essential oil and clean soy wax, not artificial perfume. Arrived beautifully wrapped in kraft tissue paper.'
      },
      {
        buyerId: buyerPriya._id,
        productId: mugProd._id,
        orderId: order1._id,
        buyerName: buyerPriya.name,
        rating: 5,
        comment: 'The green reactive glaze looks even more stunning in person than in the photos. Perfect weight and feels wonderful in the hands during morning filter coffee.'
      }
    ]);

    console.log('Creating initial carts and wishlists...');
    await Cart.create({
      buyerId: buyerPriya._id,
      items: []
    });
    await Cart.create({
      buyerId: buyerRahul._id,
      items: [{ productId: createdProducts[2]._id, quantity: 1 }]
    });

    await Wishlist.create({
      buyerId: buyerPriya._id,
      products: [createdProducts[4]._id, createdProducts[8]._id]
    });
    await Wishlist.create({
      buyerId: buyerRahul._id,
      products: [createdProducts[1]._id]
    });

    console.log('=============================================');
    console.log('CraftNest Database Seed Completed Successfully!');
    console.log('=============================================');
    console.log('DEMO ACCOUNTS:');
    console.log('Admin:   admin@craftnest.in   / Admin@123');
    console.log('Seller:  aarohi@craftnest.in  / Seller@123 (Aarohi Botanicals)');
    console.log('Seller:  kavya@craftnest.in   / Seller@123 (Kavya Knotwork)');
    console.log('Seller:  dhruv@craftnest.in   / Seller@123 (Mitti & Clay Studio)');
    console.log('Buyer:   priya@example.com    / Buyer@123');
    console.log('Buyer:   rahul@example.com    / Buyer@123');
    console.log('=============================================');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
