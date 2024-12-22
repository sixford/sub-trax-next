import mongoose from 'mongoose'
import Subscription from '../src/models/Subscription' // Update the path if needed

const MONGODB_URI = 'mongodb://localhost:27017/subtraxdb' // Replace with your actual MongoDB connection URI

const cleanUpSubscriptions = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

    console.log('Connected. Cleaning up subscriptions...')
    const result = await Subscription.deleteMany({ userId: { $exists: false } }) // Remove orphaned subscriptions

    console.log(`Deleted ${result.deletedCount} orphaned subscriptions.`)
  } catch (error) {
    console.error('Error cleaning up subscriptions:', error)
  } finally {
    mongoose.disconnect()
    console.log('Disconnected from MongoDB.')
  }
}

cleanUpSubscriptions()
