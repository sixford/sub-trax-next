import { NextResponse } from "next/server"
import dbConnect from '@/lib/dbConnect'
import Subscription from '@/models/Subscription'

export async function POST(request: Request) {
  await dbConnect()
}