import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'

export async function GET() {
  await dbConnect()

  try {
    const subscriptions = await Subscription.find({})
    return NextResponse.json({ success: true, data: subscriptions })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}