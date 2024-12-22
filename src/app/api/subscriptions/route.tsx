import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET: Fetch all subscriptions
export async function GET(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    )
  }

  try {
    const subscriptions = await Subscription.find({ userId: session.user.id }) // Filter by userId
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
      userId: session.user.id, // Associate with logged-in user
    })

    return NextResponse.json({ success: true, data: newSubscription })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorised' },
      { status: 401 }
    )
  }

  const { id } = params

  try {
    const deletedSubscription = await Subscription.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!deletedSubscription) {
      return NextResponse.json(
        { success: false, message: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: 'Subscription deleted' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
