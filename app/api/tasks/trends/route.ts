import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = searchParams.get('days') || '7'

    const response = await fetch(`${BACKEND_URL}/api/tasks/trends?days=${days}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching trends from backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trends from backend' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
