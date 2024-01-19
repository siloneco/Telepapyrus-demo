import { NextRequest, NextResponse } from 'next/server'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { Draft } from '@/layers/entity/types'
import NodeCache from 'node-cache'
import { MAX_DRAFT_AMOUNT } from '@/lib/constants/UserLimits'

const countCache = new NodeCache()
import {
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

export const dynamic = 'force-dynamic'

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const username: string = session.user.name
  const { id } = params

  const result = await getDraftUseCase().getDraft(username, id)

  if (result.isFailure()) {
    if (result.error instanceof NotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (result.error instanceof UnexpectedBehaviorDetectedError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return NextResponse.json(result.value)
}

export async function POST(request: NextRequest, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const username: string = session.user.name
  const data: Draft = await request.json()

  data.id = id

  const amount = countCache.get<number>(username) ?? 0

  if (amount >= MAX_DRAFT_AMOUNT) {
    return NextResponse.json(
      { error: 'You have already too many drafts' },
      { status: 400 },
    )
  }

  const result = await getDraftUseCase().saveDraft(username, data)

  if (result.isFailure()) {
    if (result.error instanceof InvalidDataError) {
      return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  countCache.set(username, amount + 1)

  return NextResponse.json({ status: 'ok' }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const username: string = session.user.name

  const result = await getDraftUseCase().deleteDraft(username, id)

  if (result.isFailure()) {
    if (result.error instanceof NotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (result.error instanceof UnexpectedBehaviorDetectedError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const amount = countCache.get<number>(username) ?? 0
  countCache.set(username, Math.max(amount - 1, 0))

  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
