import mongoose from 'mongoose';

const priceSchema = mongoose.Schema({
  productId: String,
  price: {
    value: Number,
    currency_code: String,
  },
});

const priceModel = mongoose.model('ProductPricing', priceSchema, 'ProductPricing');

export default priceModel;
