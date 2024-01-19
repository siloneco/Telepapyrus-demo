import ArticleRenderer from '@/components/article/ArticleRenderer'
import { NotFoundError } from '@/layers/entity/errors'
import { getDraftUseCase } from '@/layers/use-case/draft/DraftUsesCase'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'

type Props = {
  id: string
}

export default async function PreviewLoader({ id }: Props) {
  const session: any = await getServerSession(authOptions)
  if (!session || session.user?.name === undefined) {
    return <p>Internal Server Error</p>
  }

  const username: string = session.user?.name

  const result = await getDraftUseCase().getDraftForPreview(username, id)

  if (result.isFailure()) {
    const error = result.error

    if (error instanceof NotFoundError) {
      return <p>Not Found</p>
    }

    return <p>Internal Server Error</p>
  }

  return <ArticleRenderer content={result.value.content} />
}
