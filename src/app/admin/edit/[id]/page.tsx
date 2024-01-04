import { notFound, redirect } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'
import WriteWorkspace from '@/components/model/write-article/WriteWorkspace'
import { getArticleUseCase } from '@/layers/use-case/article/ArticleUseCase'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

type MetadataProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: MetadataProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const id: string = params.id

  return {
    title: `${id} - Edit | Telepapyrus`,
  }
}

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    notFound()
  }

  const username: string = session.user?.name

  const { id } = params

  const result = await getArticleUseCase().getArticle(username, id)
  if (result.isFailure()) {
    redirect('/admin/edit/error/not-found')
  }

  return <WriteWorkspace mode="edit-article" id={id} />
}
