import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  await dbConnect()

  const hashedPassword = await bcrypt.hash(password, 12)

  const newUser = new User({ email, password: hashedPassword })
  await newUser.save();

  return NextResponse.json({ success: true })
}
