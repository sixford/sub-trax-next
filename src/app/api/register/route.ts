import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import User from '../../../models/User'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 })
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({ email, password: hashedPassword })
    await newUser.save()

    return NextResponse.json({ success: true, message: 'User registered successfully' })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
