import { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { TAG_NAME_MAX_LENGTH } from '@/lib/constants/Constants'
import ArticleList from '@/components/layout/ArticleList'
import ArticleTag from '@/components/article/ArticleTag'
import {
  PresentationArticleOverview,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'
import { convertSearchParamPageToInteger } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

async function getArticles(
  username: string,
  tag: string,
  page: number = 1,
): Promise<PresentationArticleOverview[] | null> {
  const result = await getArticleUseCase().listArticle(username, {
    tags: [tag],
    page: page,
  })

  if (result.isSuccess()) {
    return result.value
  }

  return null
}

async function getMaxPageNumber(
  username: string,
  tag: string,
): Promise<number | null> {
  const result = await getArticleUseCase().countArticle(username, [tag])

  if (result.isSuccess()) {
    return Math.ceil(result.value / 10)
  }

  return null
}

type Props = {
  params: {
    tag: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  params.tag = decodeURI(params.tag)

  return {
    title: `タグ ${params.tag} が付いている記事`,
    robots: 'noindex',
  }
}

export default async function Page({ params, searchParams }: Props) {
  const tag = decodeURI(params.tag)

  if (tag.length > TAG_NAME_MAX_LENGTH) {
    notFound()
  }

  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    notFound()
  }

  const username: string = session.user?.name

  const rawPage = searchParams['page']
  const maxPageNum: number = (await getMaxPageNumber(username, tag)) ?? 1
  const pageParseResult = convertSearchParamPageToInteger(rawPage, maxPageNum)

  if (!pageParseResult.isValid && !pageParseResult.fallback) {
    redirect(`/tag/${tag}/`)
  }

  if (pageParseResult.fallback) {
    redirect(`/tag/${tag}/?page=${pageParseResult.page!}`)
  }

  const page: number = pageParseResult.page!

  const data: PresentationArticleOverview[] | null = await getArticles(
    username,
    tag,
    page,
  )

  if (data === null || maxPageNum === null) {
    notFound()
  }

  return (
    <div>
      <div className="flex flex-row justify-center mt-7">
        <ArticleTag tag={tag} noLink className="mr-2" />
        <h3>が付いている記事</h3>
      </div>
      <ArticleList
        articles={data}
        currentPage={page}
        totalPages={maxPageNum}
        path={`/tag/${tag}/`}
      />
    </div>
  )
}
