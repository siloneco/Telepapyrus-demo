import { PublishableDraft } from '../../entity/types'
import {
  ListArticleProps,
  PresentationArticle,
  PresentationArticleOverview,
} from './ArticleUseCase'
import {
  ArticleAlreadyExistsError,
  ArticleExcessiveScopeError,
  ArticleInvalidDataError,
  ArticleNotFoundError,
  ArticleUnexpectedReturnValueError,
} from './errors'
import { Result } from '@/lib/utils/Result'

export interface ArticleUseCase {
  createArticle(
    _username: string,
    _draft: PublishableDraft,
  ): Promise<
    Result<true, ArticleAlreadyExistsError | ArticleInvalidDataError | Error>
  >
  getArticle(
    _username: string,
    _id: string,
  ): Promise<
    Result<
      PresentationArticle,
      ArticleNotFoundError | ArticleExcessiveScopeError | Error
    >
  >
  updateArticle(
    _username: string,
    _draft: PublishableDraft,
  ): Promise<
    Result<true, ArticleInvalidDataError | ArticleNotFoundError | Error>
  >
  deleteArticle(
    _username: string,
    _id: string,
  ): Promise<
    Result<true, ArticleNotFoundError | ArticleExcessiveScopeError | Error>
  >

  countArticle(
    _username: string,
    _tags?: string[],
  ): Promise<
    Result<
      number,
      ArticleExcessiveScopeError | ArticleUnexpectedReturnValueError | Error
    >
  >
  listArticle(
    _username: string,
    _data: ListArticleProps,
  ): Promise<Result<PresentationArticleOverview[], Error>>
}
