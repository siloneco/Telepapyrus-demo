import { Metadata, ResolvingMetadata } from 'next'
import ArticleHeader from '@/components/article/ArticleHeader'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { notFound } from 'next/navigation'
import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'
import { isValidID } from '@/lib/utils'
import {
  PresentationArticle,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

async function getArticle(
  username: string,
  id: string,
): Promise<PresentationArticle | null> {
  const result = await getArticleUseCase().getArticle(username, id)
  if (result.isSuccess()) {
    return result.value
  }

  return null
}

type MetadataProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: MetadataProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const NOT_FOUND_PAGE_TITLE = '404 Not Found | Telepapyrus'
  const id = decodeURI(params.id)

  if (id.length > ARTICLE_ID_MAX_LENGTH || !isValidID(id)) {
    return {
      title: NOT_FOUND_PAGE_TITLE,
      robots: 'noindex',
    }
  }

  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return {
      title: NOT_FOUND_PAGE_TITLE,
      robots: 'noindex',
    }
  }

  const username: string = session.user?.name

  const data: PresentationArticle | null = await getArticle(username, id)

  if (data === null) {
    return {
      title: NOT_FOUND_PAGE_TITLE,
      robots: 'noindex',
    }
  }

  return {
    title: data.title,
    description: data.description,
    robots: 'noindex',
  }
}

type PageProps = {
  params: {
    id: string
  }
}

export default async function Page({ params }: PageProps) {
  const id = decodeURI(params.id)

  if (id.length > ARTICLE_ID_MAX_LENGTH || !isValidID(id)) {
    notFound()
  }

  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    notFound()
  }

  const username: string = session.user?.name

  const data: PresentationArticle | null = await getArticle(username, id)

  if (data === null) {
    notFound()
  }

  return (
    <div className="max-w-3xl mt-5 mx-3 md:mx-auto">
      <ArticleHeader
        id={data.id}
        title={data.title}
        date={data.date}
        lastUpdated={data.last_updated}
        tags={data.tags}
      />
      <ArticleRenderer content={data.content} />
    </div>
  )
}
