import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  try {
    // Fetch subscriptions only for the logged-in user
    const subscriptions = await Subscription.find({ userId: session.user.id })
    return NextResponse.json({ success: true, data: subscriptions })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}


// POST: Add a new subscription
export async function POST(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  try {
    const data = await request.json()
    const newSubscription = await Subscription.create({
      ...data,
      userId: session.user.id,
    })

    return NextResponse.json({ success: true, data: newSubscription })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

