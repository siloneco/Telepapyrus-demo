import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { Draft } from '@/layers/entity/types'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data: Draft = await request.json()
  const username: string = session.user.name

  const result = await getDraftUseCase().setDraftForPreview(username, data)

  if (result.isFailure()) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return new Response(null, { status: 204 })
}
