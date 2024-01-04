import { Metadata } from 'next'
import ArticleList from '@/components/layout/ArticleList'
import {
  PresentationArticleOverview,
  getArticleUseCase,
} from '@/layers/use-case/article/ArticleUseCase'
import { notFound, redirect } from 'next/navigation'
import { convertSearchParamPageToInteger } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { FolderLock } from 'lucide-react'

async function getArticles(
  username: string,
  page: number,
): Promise<PresentationArticleOverview[] | null> {
  const result = await getArticleUseCase().listArticle(username, { page: page })
  if (result.isSuccess()) {
    return result.value
  }

  return null
}

async function getMaxPageNumber(username: string): Promise<number> {
  const result = await getArticleUseCase().countArticle(username)

  if (result.isSuccess()) {
    return Math.ceil(result.value / 10)
  }

  return -1
}

export const metadata: Metadata = {
  title: 'ホーム | Telepapyrus',
  robots: 'noindex',
}

const NoArticles: FC<{}> = () => {
  return (
    <div className="w-full my-10 mx-auto md:w-[768px]">
      <p className="flex justify-center">記事が公開されていません</p>
      <div className="flex flex-row justify-center items-center">
        <p>右上の</p>
        <Button asChild variant="ghost">
          <a href="/admin/dashboard">
            <FolderLock className="text-2xl text-white pr-0" />
          </a>
        </Button>
        <p>の管理画面から記事を投稿することができます</p>
      </div>
      <p className="flex justify-center text-gray-400">
        (このデモサイトでは、他のユーザーに記事が公開されることはありません)
      </p>
    </div>
  )
}

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Props) {
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    notFound()
  }

  const username: string = session.user?.name

  const rawPage = searchParams['page']
  const maxPage: number = await getMaxPageNumber(username)
  const pageParseResult = convertSearchParamPageToInteger(rawPage, maxPage)

  if (!pageParseResult.isValid && !pageParseResult.fallback) {
    redirect('/')
  }

  if (pageParseResult.fallback) {
    redirect(`/?page=${pageParseResult.page!}`)
  }

  const page: number = pageParseResult.page!

  const data: PresentationArticleOverview[] | null = await getArticles(
    username,
    page,
  )

  if (data === null || data.length === 0) {
    return <NoArticles />
  }

  return (
    <div className="mt-10">
      <ArticleList articles={data} currentPage={page} totalPages={maxPage} />
    </div>
  )
}
