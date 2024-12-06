import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get request function

export async function GET() {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorised' },
      { status: 401 }
    )
  }

  try {
    const subscriptions = await Subscription.find({ user: session.user.id })
    return NextResponse.json({ success: true, data: subscriptions })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Add Subscription function

export async function POST(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const data = await request.json()
    const newSubscription = await Subscription.create({
      ...data,
      user: session.user.id, // Link subscription to user
    })
    return NextResponse.json({ success: true, data: newSubscription });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE function

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()


  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { id } = params

  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(id)

    if (!deletedSubscription) {
      return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Subscription deleted' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}