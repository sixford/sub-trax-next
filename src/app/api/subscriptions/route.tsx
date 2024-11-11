import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'

export async function GET(request: Request) {
  await dbConnect()

  try {
    const data = await request.json()
    const newSubscription = await Subscription.create(data)
    return NextResponse.json({ success: true, data: newSubscription })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message })
  }
}