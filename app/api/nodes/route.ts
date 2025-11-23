import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function GET() {
  try {
    // Backend already has /nodes endpoint
    const response = await fetch(`${BACKEND_URL}/nodes`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching nodes from backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nodes from backend' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
