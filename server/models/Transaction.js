import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    customer: {
      type: String,
      required: true,
      trim: true
    },
    product: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      index: true,
      enum: ['Electronics', 'Home & Kitchen', 'Apparel', 'Office Supplies', 'Fitness & Outdoors']
    },
    region: {
      type: String,
      required: true,
      index: true,
      enum: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East']
    },
    salesAmount: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    profit: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'UPI / Digital Wallet', 'PayPal']
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Completed', 'Shipped', 'Pending', 'Cancelled', 'Refunded'],
      default: 'Completed'
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for time-series and filtered aggregations
transactionSchema.index({ date: -1, category: 1, region: 1 });
transactionSchema.index({ date: -1, orderStatus: 1, paymentMethod: 1 });
transactionSchema.index({ customer: 1, product: 1 });

export default mongoose.model('Transaction', transactionSchema);