import { Draft, DraftOverview } from '../../entity/types'
import { Result } from '@/lib/utils/Result'
import { PresentationDraft } from './DraftUsesCase'
import {
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'

export interface DraftUseCase {
  saveDraft(
    _username: string,
    _draft: Draft,
  ): Promise<Result<true, InvalidDataError | Error>>
  getDraft(
    _username: string,
    _id: string,
  ): Promise<
    Result<
      PresentationDraft,
      NotFoundError | UnexpectedBehaviorDetectedError | Error
    >
  >
  deleteDraft(
    _username: string,
    _id: string,
  ): Promise<
    Result<true, NotFoundError | UnexpectedBehaviorDetectedError | Error>
  >
  listDraft(
    _username: string,
    _page?: number,
  ): Promise<Result<DraftOverview[], Error>>

  setDraftForPreview(
    _username: string,
    _draft: Draft,
  ): Promise<Result<true, Error>>
  getDraftForPreview(
    _username: string,
    _id: string,
  ): Promise<Result<PresentationDraft, NotFoundError | Error>>
}
