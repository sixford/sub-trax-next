import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'

// Handle DELETE request by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  const { id } = params

  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(id)

    if (!deletedSubscription) {
      return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Subscription deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Handle GET request by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  const { id } = params

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

// Handle PATCH request by ID
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;

  try {
    const data = await request.json();
    const updatedSubscription = await Subscription.findByIdAndUpdate(id, data, {
      new: true, 
      runValidators: true, 
    })

    if (!updatedSubscription) {
      return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedSubscription })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
