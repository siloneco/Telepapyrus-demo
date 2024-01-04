import { NextResponse } from 'next/server'
import { getTagUseCase } from '@/layers/use-case/tag/TagUsesCase'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const username: string = session.user.name

  const result = await getTagUseCase().listTags(username)

  if (result.isFailure()) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const tags = result.value
  return NextResponse.json(tags, { status: 200 })
}
