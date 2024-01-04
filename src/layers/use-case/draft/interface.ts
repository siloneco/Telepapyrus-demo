import { Draft } from '../../entity/types'
import { Result } from '@/lib/utils/Result'
import {
  DraftExcessiveScopeError,
  DraftInvalidDataError,
  DraftNotFoundError,
} from './errors'
import { PresentationDraft } from './DraftUsesCase'

export interface DraftUseCase {
  saveDraft(
    _username: string,
    _draft: Draft,
  ): Promise<Result<true, DraftInvalidDataError | Error>>
  getDraft(
    _username: string,
    _id: string,
  ): Promise<
    Result<
      PresentationDraft,
      DraftNotFoundError | DraftExcessiveScopeError | Error
    >
  >
  deleteDraft(
    _username: string,
    _id: string,
  ): Promise<
    Result<true, DraftNotFoundError | DraftExcessiveScopeError | Error>
  >

  setDraftForPreview(
    _username: string,
    _draft: Draft,
  ): Promise<Result<true, Error>>
  getDraftForPreview(
    _username: string,
    _id: string,
  ): Promise<Result<PresentationDraft, DraftNotFoundError | Error>>
}
