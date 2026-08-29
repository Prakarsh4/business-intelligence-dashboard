import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

dotenv.config();

const categoriesWithProducts = {
  Electronics: [
    { name: '4K Ultra HD Monitor 27"', basePrice: 380, margin: 0.28 },
    { name: 'Mechanical Gaming Keyboard', basePrice: 120, margin: 0.35 },
    { name: 'Wireless ANC Headphones', basePrice: 210, margin: 0.32 },
    { name: 'USB-C Docking Station Multiport', basePrice: 85, margin: 0.4 },
    { name: 'Smartwatch Pro GPS', basePrice: 290, margin: 0.25 }
  ],
  'Home & Kitchen': [
    { name: 'Espresso & Cappuccino Maker', basePrice: 240, margin: 0.3 },
    { name: 'Air Fryer Digital 5.8Qt', basePrice: 130, margin: 0.26 },
    { name: 'Stainless Steel Knife Set (15-Piece)', basePrice: 95, margin: 0.45 },
    { name: 'Robotic Vacuum Cleaner', basePrice: 340, margin: 0.22 }
  ],
  Apparel: [
    { name: 'Merino Wool Pullover Sweater', basePrice: 80, margin: 0.5 },
    { name: 'Slim-Fit Performance Chinos', basePrice: 65, margin: 0.55 },
    { name: 'All-Weather Waterproof Jacket', basePrice: 160, margin: 0.42 },
    { name: 'Leather Dress Oxford Shoes', basePrice: 140, margin: 0.38 }
  ],
  'Office Supplies': [
    { name: 'Ergonomic Mesh Executive Chair', basePrice: 310, margin: 0.34 },
    { name: 'Motorized Dual-Motor Standing Desk', basePrice: 480, margin: 0.29 },
    { name: 'LED Desk Lamp with Wireless Charging', basePrice: 50, margin: 0.48 },
    { name: 'Shredder High-Security Cross-Cut', basePrice: 110, margin: 0.36 }
  ],
  'Fitness & Outdoors': [
    { name: 'Adjustable Dumbbells Set 50lbs', basePrice: 280, margin: 0.31 },
    { name: 'Non-Slip High Density Yoga Mat', basePrice: 45, margin: 0.6 },
    { name: 'Camping 4-Person Waterproof Tent', basePrice: 190, margin: 0.35 },
    { name: 'Insulated Hydration Backpack 20L', basePrice: 60, margin: 0.46 }
  ]
};

const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
const paymentMethods = ['Credit Card', 'Debit Card', 'Bank Transfer', 'UPI / Digital Wallet', 'PayPal'];
const orderStatuses = ['Completed', 'Completed', 'Completed', 'Shipped', 'Shipped', 'Pending', 'Cancelled', 'Refunded'];

const customers = [
  'Apex Capital Ltd', 'TechNova Solutions', 'Vanguard Retail', 'Nordic Logistics', 'Quantum Health',
  'Blue Horizon Media', 'Global Trade Nexus', 'Synergy Works', 'Pinnacle Systems', 'Solaris Energy',
  'Summit Enterprises', 'Crestview Tech', 'Aurora Digital', 'Atlas Engineering', 'Ironclad Security',
  'Beacon Analytics', 'Zephyr Global', 'Horizon Labs', 'Silverline Capital', 'Oasis Consumer Goods'
];

const generateSampleRecords = (count = 300) => {
  const records = [];
  const categoryKeys = Object.keys(categoriesWithProducts);
  const startDate = new Date('2025-01-01T00:00:00.000Z');
  const endDate = new Date('2026-08-15T00:00:00.000Z');
  const timeSpan = endDate.getTime() - startDate.getTime();

  for (let i = 1; i <= count; i++) {
    const category = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const productList = categoriesWithProducts[category];
    const productObj = productList[Math.floor(Math.random() * productList.length)];

    const randomTimestamp = startDate.getTime() + Math.random() * timeSpan;
    const date = new Date(randomTimestamp);

    const quantity = Math.floor(Math.random() * 8) + 1;
    // Price variance +/- 8%
    const unitPrice = Number((productObj.basePrice * (0.92 + Math.random() * 0.16)).toFixed(2));
    const salesAmount = Number((unitPrice * quantity).toFixed(2));

    // Profit calculation based on margin with slight variance
    const actualMargin = productObj.margin * (0.85 + Math.random() * 0.3);
    const profit = Number((salesAmount * actualMargin).toFixed(2));

    const region = regions[Math.floor(Math.random() * regions.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

    records.push({
      transactionId: `TXN-${date.getFullYear()}-${String(i).padStart(5, '0')}`,
      date,
      customer,
      product: productObj.name,
      category,
      region,
      salesAmount,
      quantity,
      profit,
      paymentMethod,
      orderStatus
    });
  }
  return records;
};

const runSeed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bi_analytics_db';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB.');

    await Transaction.deleteMany({});
    console.log('[Seed] Cleared existing transaction records.');

    const seedData = generateSampleRecords(350);
    await Transaction.insertMany(seedData);
    console.log(`[Seed] Successfully populated ${seedData.length} business transaction records.`);

    await mongoose.disconnect();
    console.log('[Seed] Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

runSeed();