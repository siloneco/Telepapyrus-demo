jest.mock('@/layers/use-case/tag/TagUsesCase')
jest.mock('next-auth')

import { NextRequest, NextResponse } from 'next/server'
import { GET } from './route'
import { Failure, Success } from '@/lib/utils/Result'
import { TagUseCase } from '@/layers/use-case/tag/interface'
import { getTagUseCase } from '@/layers/use-case/tag/TagUsesCase'
import { getTestUsername } from '@/layers/constant/databaseConstants'
import { getServerSession } from 'next-auth'

const sampleTagList = ['tag-1', 'tag-2']

const tagUseCaseMock: TagUseCase = {
  createTag: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  deleteTag: jest.fn().mockImplementation(async () => {
    throw new Error('Not Used and Not Implemented')
  }),
  listTags: jest
    .fn()
    .mockReturnValueOnce(new Failure(new Error('')))
    .mockReturnValue(new Success(['tag-1', 'tag-2'])),
}

beforeAll(() => {
  const getTagUseCaseMock = getTagUseCase as jest.Mock
  getTagUseCaseMock.mockReturnValue(tagUseCaseMock)
})

describe('GET /api/v1/tag/list', () => {
  beforeAll(() => {
    const getServerSessionMock = getServerSession as jest.Mock
    getServerSessionMock
      .mockClear()
      .mockReturnValueOnce(Promise.resolve(null)) // Access Denied
      .mockReturnValue(Promise.resolve({ user: { name: getTestUsername() } })) // Access Granted
  })

  it('responds 401 (Unauthorized) when you does not have permission', async () => {
    const req = new NextRequest('http://localhost/')

    const result: NextResponse<any> = await GET(req)

    expect(result.status).toBe(401)
  })

  it('responds 500 (Internal Server Error) when unknown error occured', async () => {
    const req = new NextRequest('http://localhost/')

    const listTagsMock = tagUseCaseMock.listTags as jest.Mock

    const result: NextResponse<any> = await GET(req)

    expect(result.status).toBe(500)
    expect(listTagsMock).toHaveBeenCalledTimes(1)
  })

  it('responds 200 (OK) and correct list of tags', async () => {
    const req = new NextRequest('http://localhost/')

    const listTagsMock = tagUseCaseMock.listTags as jest.Mock

    const data: NextResponse<any> = await GET(req)
    const responseJson = await data.json()

    expect(data.status).toBe(200)
    expect(responseJson).toEqual(sampleTagList)

    expect(listTagsMock).toHaveBeenCalledTimes(2)
  })
})
