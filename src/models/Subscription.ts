import mongoose from 'mongoose'

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  renewalDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'cancelled'], required: true },
})

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema)