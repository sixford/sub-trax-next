import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// DELETE: Delete a subscription by ID
export async function DELETE(request: Request, context: { params: { id: string } }) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = context.params

  try {
    const deletedSubscription = await Subscription.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    })

    if (!deletedSubscription) {
      return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Subscription deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// GET: Fetch a subscription by ID
export async function GET(request: Request, context: { params: { id: string } }) {
  await dbConnect()

  const { id } = context.params

  try {
    const subscription = await Subscription.findById(id)

    if (!subscription) {
      return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: subscription })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PATCH: Update a subscription by ID
export async function PATCH(request: Request, context: { params: { id: string } }) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = context.params

  try {
    const data = await request.json()
    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      data,
      { new: true, runValidators: true }
    )

    if (!updatedSubscription) {
      return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedSubscription })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

