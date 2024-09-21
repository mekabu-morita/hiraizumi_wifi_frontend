import { NextResponse } from 'next/server'
import { getSpots, addSpot } from '@/lib/spots'

export async function GET() {
  const spots = await getSpots()
  return NextResponse.json(spots)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newSpot = await addSpot(data)
  return NextResponse.json(newSpot, { status: 201 })
}
