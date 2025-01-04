import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Handle DELETE request by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorised' },
      { status: 401 }
    )
  }

  const { id } = await params // Await params before using its properties

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Handle PATCH request by ID
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorised' },
      { status: 401 }
    )
  }

  const { id } = await params // Await params before using its properties

  try {
    const data = await request.json()
    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: id, userId: session.user.id }, // Ensure subscription belongs to the user
      data,
      { new: true, runValidators: true }
    )

    if (!updatedSubscription) {
      return NextResponse.json(
        { success: false, message: 'Subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updatedSubscription })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}


