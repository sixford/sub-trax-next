import mongoose, { Schema, Document } from 'mongoose';

interface ISubscription extends Document {
  name: string
  price: number
  renewalDate: Date
  status: 'active' | 'inactive'
}

const SubscriptionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  renewalDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], required: true },
})

const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema)

export default Subscription