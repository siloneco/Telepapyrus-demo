import { Failure, Result, Success } from '@/lib/utils/Result'
import { ArticleInvalidDataError, ArticleNotFoundError } from '../errors'
import { ArticleRepository } from '@/layers/repository/ArticleRepository'
import { PublishableDraft } from '@/layers/entity/types'

export const updateArticle = async (
  repo: ArticleRepository,
  userId: string,
  draft: PublishableDraft,
): Promise<
  Result<true, ArticleNotFoundError | ArticleInvalidDataError | Error>
> => {
  const result = await repo.updateArticle(userId, draft)
  if (result.success) {
    return new Success(true)
  }

  const errorId = result.error?.id

  if (errorId === 'not-exists') {
    return new Failure(
      new ArticleNotFoundError(`Article not found: ${draft.id}`),
    )
  } else if (errorId === 'invalid-data') {
    return new Failure(new ArticleInvalidDataError(`Invalid data: ${draft.id}`))
  }

  return new Failure(
    new Error(`Failed to update article: ${result.error?.message}`),
  )
}
