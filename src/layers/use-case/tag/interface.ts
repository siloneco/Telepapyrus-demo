import { Result } from '@/lib/utils/Result'
import {
  TagAlreadyExistsError,
  TagExcessiveScopeError,
  TagInvalidDataError,
  TagNotFoundError,
} from './errors'

export interface TagUseCase {
  createTag(
    _username: string,
    _tag: string,
  ): Promise<Result<true, TagAlreadyExistsError | TagInvalidDataError | Error>>
  deleteTag(
    _username: string,
    _tag: string,
  ): Promise<Result<true, TagNotFoundError | TagExcessiveScopeError | Error>>

  listTags(_username: string): Promise<Result<string[], Error>>
}
