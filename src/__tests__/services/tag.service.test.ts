import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import prisma from '../../prisma/prisma-client';
import getTags from '../../app/routes/tag/tag.service';

jest.mock('../../prisma/prisma-client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe('TagService', () => {
  describe('getTags', () => {
    test('should return a list of tag names without id', async () => {
      const mockedResponse = [{ name: 'dragons' }, { name: 'training' }, { name: 'react' }];
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue(mockedResponse);

      const result = await getTags();
      expect(result).toEqual(['dragons', 'training', 'react']);
      expect(result).toHaveLength(3);
    });

    test('should return a list of tag names with id (includes user query)', async () => {
      const mockedResponse = [{ name: 'dragons' }, { name: 'mytag' }];
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue(mockedResponse);

      const result = await getTags(123);
      expect(result).toEqual(['dragons', 'mytag']);
      expect(result).toHaveLength(2);
    });

    test('should return an empty array if no tags exist', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      const result = await getTags();
      expect(result).toEqual([]);
    });

    test('should call findMany with demo:true in OR query when no id provided', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      await getTags();

      const call = (prismaMock.tag.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(call.where.articles.some.author.OR).toEqual([{ demo: true }]);
    });

    test('should call findMany with both demo:true AND id in OR query when id is provided', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      await getTags(123);

      const call = (prismaMock.tag.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(call.where.articles.some.author.OR).toEqual([
        { demo: true },
        { id: { equals: 123 } },
      ]);
    });

    test('should select only the name field', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      await getTags();

      const call = (prismaMock.tag.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(call.select).toEqual({ name: true });
    });

    test('should order results by article count descending', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      await getTags();

      const call = (prismaMock.tag.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(call.orderBy).toEqual({ articles: { _count: 'desc' } });
    });

    test('should limit results to exactly 10 tags', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      await getTags();

      const call = (prismaMock.tag.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(call.take).toBe(10);
    });

    test('should not include id in OR query when id is undefined', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      await getTags(undefined);

      const call = (prismaMock.tag.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(call.where.articles.some.author.OR).toHaveLength(1);
      expect(call.where.articles.some.author.OR[0]).toEqual({ demo: true });
    });

    test('should include exactly two items in OR query when id is provided', async () => {
      // @ts-ignore
      prismaMock.tag.findMany.mockResolvedValue([]);

      await getTags(42);

      const call = (prismaMock.tag.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(call.where.articles.some.author.OR).toHaveLength(2);
      expect(call.where.articles.some.author.OR[1]).toEqual({ id: { equals: 42 } });
    });
  });
});
