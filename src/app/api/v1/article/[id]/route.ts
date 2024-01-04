import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getArticleUseCase } from '@/layers/use-case/article/ArticleUseCase'
import {
  ArticleAlreadyExistsError,
  ArticleExcessiveScopeError,
  ArticleInvalidDataError,
  ArticleNotFoundError,
} from '@/layers/use-case/article/errors'
import { PublishableDraft } from '@/layers/entity/types'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { MAX_ARTICLE_AMOUNT } from '@/lib/constants/UserLimits'

export const dynamic = 'force-dynamic'

type Props = {
  params: {
    id: string
  }
}

type RequestJson = PublishableDraft & { update?: boolean }

export async function GET(request: Request, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const username: string = session.user.name

  const result = await getArticleUseCase().getArticle(username, id)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof ArticleNotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (error instanceof ArticleExcessiveScopeError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const article = result.value

  return NextResponse.json(article)
}

export async function POST(request: Request, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const username: string = session.user.name
  const data: RequestJson = await request.json()
  data.id = params.id

  if (data.update === undefined || data.update === false) {
    const countResult = await getArticleUseCase().countArticle(username)
    if (countResult.isFailure()) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }

    if (countResult.value >= MAX_ARTICLE_AMOUNT) {
      return NextResponse.json(
        { error: 'You have already have too many articles' },
        { status: 400 },
      )
    }

    const result = await getArticleUseCase().createArticle(username, data)

    if (result.isFailure()) {
      const error = result.error

      if (error instanceof ArticleAlreadyExistsError) {
        return NextResponse.json({ error: 'Already Exists' }, { status: 409 })
      } else if (error instanceof ArticleInvalidDataError) {
        return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }

    // Delete draft
    const _ignoreResult = await getDraftUseCase().deleteDraft(username, data.id)

    return NextResponse.json({ status: 'OK' })
  } else {
    const result = await getArticleUseCase().updateArticle(username, data)

    if (result.isFailure()) {
      const error = result.error

      if (error instanceof ArticleNotFoundError) {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 })
      } else if (error instanceof ArticleInvalidDataError) {
        return NextResponse.json({ error: 'Invalid Data' }, { status: 400 })
      }

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      )
    }

    // Delete draft
    const _ignoreResult = await getDraftUseCase().deleteDraft(username, data.id)

    return NextResponse.json({ status: 'OK' })
  }
}

export async function DELETE(request: Request, { params }: Props) {
  // Require authentication
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const username: string = session.user.name

  const result = await getArticleUseCase().deleteArticle(username, id)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof ArticleNotFoundError) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    } else if (error instanceof ArticleExcessiveScopeError) {
      // pass
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  return NextResponse.json({ status: 'OK' })
}
