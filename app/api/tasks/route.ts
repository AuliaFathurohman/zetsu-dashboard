import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '100'
    const offset = searchParams.get('offset') || '0'
    const status = searchParams.get('status')

    let url = `${BACKEND_URL}/api/tasks?limit=${limit}&offset=${offset}`
    if (status) {
      url += `&status=${status}`
    }

    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching tasks from backend:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks from backend' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
