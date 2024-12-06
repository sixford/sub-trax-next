import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import User from '../../../models/User'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  await dbConnect()

  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
