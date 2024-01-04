import { Failure, Result, Success } from '@/lib/utils/Result'
import { Draft } from '@/layers/entity/types'
import { DraftRepository } from '@/layers/repository/DraftRepository'

export const setDraftForPreview = async (
  repo: DraftRepository,
  userId: string,
  draft: Draft,
): Promise<Result<true, Error>> => {
  const result = await repo.setDraftForPreview(userId, draft)
  if (result.success) {
    return new Success(true)
  }

  return new Failure(
    new Error(`Failed to save draft: ${result.error?.message}`),
  )
}
