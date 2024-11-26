import mongoose, { Schema, model, models } from 'mongoose'

const SubscriptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  renewalDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'cancelled'], required: true },
})

const Subscription = models.Subscription || model('Subscription', SubscriptionSchema);

export default Subscription