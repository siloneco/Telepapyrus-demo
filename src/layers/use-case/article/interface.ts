import {
  AlreadyExistsError,
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'
import { PublishableDraft } from '../../entity/types'
import {
  ListArticleProps,
  PresentationArticle,
  PresentationArticleOverview,
} from './ArticleUseCase'
import { Result } from '@/lib/utils/Result'

export interface ArticleUseCase {
  createArticle(
    _username: string,
    _draft: PublishableDraft,
  ): Promise<Result<true, AlreadyExistsError | InvalidDataError | Error>>
  getArticle(
    _username: string,
    _id: string,
  ): Promise<
    Result<
      PresentationArticle,
      NotFoundError | UnexpectedBehaviorDetectedError | Error
    >
  >
  updateArticle(
    _username: string,
    _draft: PublishableDraft,
  ): Promise<Result<true, InvalidDataError | NotFoundError | Error>>
  deleteArticle(
    _username: string,
    _id: string,
  ): Promise<
    Result<true, NotFoundError | UnexpectedBehaviorDetectedError | Error>
  >

  countArticle(
    _username: string,
    _tags?: string[],
  ): Promise<Result<number, UnexpectedBehaviorDetectedError | Error>>
  listArticle(
    _username: string,
    _data: ListArticleProps,
  ): Promise<Result<PresentationArticleOverview[], Error>>
}
