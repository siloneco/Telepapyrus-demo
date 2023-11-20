import { NextResponse } from 'next/server'
import { setDraftData } from '@/lib/article/DraftArticleCache'
import { Draft } from '@/components/types/Article'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(request: Request) {
  // Require authentication
  const session = await getServerSession(authOptions)
  if (session === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data: Draft = await request.json()
  await setDraftData(data)
  return new Response(null, { status: 204 })
}