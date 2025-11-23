import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'

    const response = await fetch(`${BACKEND_URL}/api/browsers?limit=${limit}&offset=${offset}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching browsers from backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch browsers from backend' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
