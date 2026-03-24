import slugify from 'slugify';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import prisma from '../../prisma/prisma-client';
import {
  getArticles,
  getFeed,
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  getCommentsByArticle,
  addComment,
  deleteComment,
  favoriteArticle,
  unfavoriteArticle,
} from '../../app/routes/article/article.service';

jest.mock('../../prisma/prisma-client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

const mockArticleDb = {
  id: 1,
  slug: 'test-article-1',
  title: 'Test Article',
  description: 'Test description',
  body: 'Test body',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  authorId: 1,
  tagList: [{ name: 'test' }],
  author: { username: 'TestUser', bio: null, image: null, followedBy: [] },
  favoritedBy: [],
  _count: { favoritedBy: 0 },
};

const ARTICLE_INCLUDE = {
  tagList: { select: { name: true } },
  author: { select: { username: true, bio: true, image: true, followedBy: true } },
  favoritedBy: true,
  _count: { select: { favoritedBy: true } },
};

// ─── getArticles ────────────────────────────────────────────────────────────

describe('ArticleService', () => {
  describe('getArticles', () => {
    test('should return articles and count', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(1);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([mockArticleDb]);

      const result = await getArticles({});
      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('articlesCount', 1);
      expect(result.articles).toHaveLength(1);
    });

    test('should call count and findMany with AND where clause', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const countCall = (prismaMock.article.count as jest.Mock).mock.calls[0][0] as any;
      expect(countCall.where).toHaveProperty('AND');
      expect(Array.isArray(countCall.where.AND)).toBe(true);

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.where).toHaveProperty('AND');
    });

    test('should order articles by createdAt desc', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.orderBy).toEqual({ createdAt: 'desc' });
    });

    test('should use skip=0 and take=10 by default', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.skip).toBe(0);
      expect(findCall.take).toBe(10);
    });

    test('should apply offset and limit from query', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(5);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({ offset: 2, limit: 3 });

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.skip).toBe(2);
      expect(findCall.take).toBe(3);
    });

    test('should fallback to take=10 when limit is 0', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({ offset: 5, limit: 0 });

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.skip).toBe(5);
      expect(findCall.take).toBe(10);
    });

    test('should include demo:true in author OR query', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      const authorQuery = findCall.where.AND[0].author;
      expect(authorQuery.OR).toContainEqual({ demo: { equals: true } });
    });

    test('should include user id in OR query when id is provided', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(1);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([mockArticleDb]);

      await getArticles({}, 5);

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      const authorQuery = findCall.where.AND[0].author;
      expect(authorQuery.OR).toContainEqual({ id: { equals: 5 } });
    });

    test('should NOT include id in OR query when no id provided', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      const orQuery = findCall.where.AND[0].author.OR;
      expect(orQuery).toHaveLength(1);
      expect(orQuery[0]).toEqual({ demo: { equals: true } });
    });

    test('should include author filter in AND query when author param is given', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({ author: 'TestUser' });

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      const andQuery = findCall.where.AND[0].author.AND;
      expect(andQuery).toContainEqual({ username: { equals: 'TestUser' } });
    });

    test('should include tag filter in AND queries when tag param is given', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({ tag: 'react' });

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      const andQueries = findCall.where.AND;
      expect(andQueries).toContainEqual({ tagList: { some: { name: 'react' } } });
    });

    test('should include favorited filter in AND queries when favorited param is given', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({ favorited: 'SomeUser' });

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      const andQueries = findCall.where.AND;
      expect(andQueries).toContainEqual({
        favoritedBy: { some: { username: { equals: 'SomeUser' } } },
      });
    });

    test('should not include tag filter when tag is not in query', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      const andQueries = findCall.where.AND as any[];
      const hasTagFilter = andQueries.some(q => q.tagList !== undefined);
      expect(hasTagFilter).toBe(false);
    });

    test('should not include favorited filter when favorited is not in query', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      const andQueries = findCall.where.AND as any[];
      const hasFavoritedFilter = andQueries.some(q => q.favoritedBy !== undefined);
      expect(hasFavoritedFilter).toBe(false);
    });

    test('should use exact include structure for findMany', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.include).toEqual(ARTICLE_INCLUDE);
    });

    test('should have empty andAuthorQuery when author is not in query', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getArticles({});

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.where.AND[0].author.AND).toEqual([]);
    });

    test('should map articles using articleMapper (tagList as string array)', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(1);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([mockArticleDb]);

      const result = await getArticles({});
      expect(result.articles[0].tagList).toEqual(['test']);
    });

    test('should return favorited:true when user id is in favoritedBy', async () => {
      const article = { ...mockArticleDb, favoritedBy: [{ id: 1 }] };
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(1);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([article]);

      const result = await getArticles({}, 1);
      expect(result.articles[0].favorited).toBe(true);
    });
  });

  // ─── getFeed ──────────────────────────────────────────────────────────────

  describe('getFeed', () => {
    test('should return feed articles and count', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(1);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([mockArticleDb]);

      const result = await getFeed(0, 10, 1);
      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('articlesCount', 1);
    });

    test('should call count and findMany with followedBy filter for user id', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getFeed(0, 10, 7);

      const countCall = (prismaMock.article.count as jest.Mock).mock.calls[0][0] as any;
      expect(countCall.where).toEqual({ author: { followedBy: { some: { id: 7 } } } });

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.where).toEqual({ author: { followedBy: { some: { id: 7 } } } });
    });

    test('should order feed by createdAt desc', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getFeed(0, 10, 1);

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.orderBy).toEqual({ createdAt: 'desc' });
    });

    test('should apply skip and take for feed pagination', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getFeed(5, 20, 1);

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.skip).toBe(5);
      expect(findCall.take).toBe(20);
    });

    test('should fallback to skip=0 when offset is 0', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getFeed(0, 10, 1);

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.skip).toBe(0);
    });

    test('should fallback to take=10 when limit is 0', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getFeed(5, 0, 1);

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.skip).toBe(5);
      expect(findCall.take).toBe(10);
    });

    test('should use exact include structure for feed findMany', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(0);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([]);

      await getFeed(0, 10, 1);

      const findCall = (prismaMock.article.findMany as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.include).toEqual(ARTICLE_INCLUDE);
    });

    test('should map feed articles (tagList as string array)', async () => {
      // @ts-ignore
      prismaMock.article.count.mockResolvedValue(1);
      // @ts-ignore
      prismaMock.article.findMany.mockResolvedValue([mockArticleDb]);

      const result = await getFeed(0, 10, 1);
      expect(result.articles[0].tagList).toEqual(['test']);
    });
  });

  // ─── createArticle ────────────────────────────────────────────────────────

  describe('createArticle', () => {
    test('should throw if title is missing', async () => {
      await expect(createArticle({ description: 'desc', body: 'body' }, 1)).rejects.toThrow();
    });

    test('should throw with title error when title is missing', async () => {
      await expect(createArticle({ description: 'desc', body: 'body' }, 1)).rejects.toMatchObject({
        message: { errors: { title: ["can't be blank"] } },
      });
    });

    test('should throw if description is missing', async () => {
      await expect(createArticle({ title: 'Title', body: 'body' }, 1)).rejects.toThrow();
    });

    test('should throw with description error when description is missing', async () => {
      await expect(createArticle({ title: 'Title', body: 'body' }, 1)).rejects.toMatchObject({
        message: { errors: { description: ["can't be blank"] } },
      });
    });

    test('should throw if body is missing', async () => {
      await expect(createArticle({ title: 'Title', description: 'desc' }, 1)).rejects.toThrow();
    });

    test('should throw with body error when body is missing', async () => {
      await expect(createArticle({ title: 'Title', description: 'desc' }, 1)).rejects.toMatchObject({
        message: { errors: { body: ["can't be blank"] } },
      });
    });

    test('should throw if slug already exists (duplicate title)', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue({ slug: 'Test-Article-1' });

      await expect(createArticle({ title: 'Test Article', description: 'desc', body: 'body' }, 1)).rejects.toThrow();
    });

    test('should throw with unique title error when slug already exists', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue({ slug: 'Test-Article-1' });

      await expect(createArticle({ title: 'Test Article', description: 'desc', body: 'body' }, 1)).rejects.toMatchObject({
        message: { errors: { title: ['must be unique'] } },
      });
    });

    test('should create article successfully and return mapped article', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue(mockArticleDb);

      const result = await createArticle({ title: 'Test Article', description: 'Test description', body: 'Test body' }, 1);
      expect(result).toHaveProperty('slug');
      expect(result).toHaveProperty('title');
    });

    test('should check for slug uniqueness using slugify(title)-id', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue(mockArticleDb);

      await createArticle({ title: 'My Title', description: 'desc', body: 'body' }, 42);

      const expectedSlug = `${slugify('My Title')}-42`;
      expect(prismaMock.article.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: expectedSlug } }),
      );
    });

    test('should call findUnique with select:{slug:true} for uniqueness check', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue(mockArticleDb);

      await createArticle({ title: 'Test Article', description: 'desc', body: 'body' }, 1);

      const findCall = (prismaMock.article.findUnique as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.select).toEqual({ slug: true });
    });

    test('should call article.create with correct title, description, body, slug', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue(mockArticleDb);

      await createArticle({ title: 'Test Article', description: 'Test description', body: 'Test body' }, 1);

      const createCall = (prismaMock.article.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.title).toBe('Test Article');
      expect(createCall.data.description).toBe('Test description');
      expect(createCall.data.body).toBe('Test body');
      expect(createCall.data.slug).toBe(`${slugify('Test Article')}-1`);
    });

    test('should connect author by id in create call', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue(mockArticleDb);

      await createArticle({ title: 'Test Article', description: 'desc', body: 'body' }, 99);

      const createCall = (prismaMock.article.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.author).toEqual({ connect: { id: 99 } });
    });

    test('should use connectOrCreate with tags when tagList is an array', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue({ ...mockArticleDb, tagList: [{ name: 'tag1' }] });

      await createArticle({ title: 'Test Article', description: 'desc', body: 'body', tagList: ['tag1'] }, 1);

      const createCall = (prismaMock.article.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.tagList.connectOrCreate).toHaveLength(1);
      expect(createCall.data.tagList.connectOrCreate[0]).toEqual({
        create: { name: 'tag1' },
        where: { name: 'tag1' },
      });
    });

    test('should use empty connectOrCreate when tagList is not an array', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue({ ...mockArticleDb, tagList: [] });

      await createArticle({ title: 'Test Article', description: 'desc', body: 'body', tagList: 'not-array' }, 1);

      const createCall = (prismaMock.article.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.tagList.connectOrCreate).toEqual([]);
    });

    test('should use exact include structure for article.create', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.article.create.mockResolvedValue(mockArticleDb);

      await createArticle({ title: 'Test Article', description: 'desc', body: 'body' }, 1);

      const createCall = (prismaMock.article.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.include).toEqual(ARTICLE_INCLUDE);
    });
  });

  // ─── getArticle ───────────────────────────────────────────────────────────

  describe('getArticle', () => {
    test('should return article when found', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockArticleDb);

      const result = await getArticle('test-article-1');
      expect(result).toHaveProperty('slug', 'test-article-1');
    });

    test('should throw 404 when article not found', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);

      await expect(getArticle('nonexistent')).rejects.toThrow();
    });

    test('should throw 404 with exact error structure when article not found', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);

      await expect(getArticle('nonexistent')).rejects.toMatchObject({
        errorCode: 404,
        message: { errors: { article: ['not found'] } },
      });
    });

    test('should call findUnique with correct slug', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockArticleDb);

      await getArticle('test-article-1');

      const findCall = (prismaMock.article.findUnique as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.where).toEqual({ slug: 'test-article-1' });
    });

    test('should use exact include structure for getArticle findUnique', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockArticleDb);

      await getArticle('test-article-1');

      const findCall = (prismaMock.article.findUnique as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.include).toEqual(ARTICLE_INCLUDE);
    });

    test('should return favorited:true when user id is in favoritedBy', async () => {
      const articleWithFavorite = { ...mockArticleDb, favoritedBy: [{ id: 1 }] };
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(articleWithFavorite);

      const result = await getArticle('test-article-1', 1);
      expect(result.favorited).toBe(true);
    });

    test('should return favorited:false when user id is NOT in favoritedBy', async () => {
      const articleWithFavorite = { ...mockArticleDb, favoritedBy: [{ id: 99 }] };
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(articleWithFavorite);

      const result = await getArticle('test-article-1', 1);
      expect(result.favorited).toBe(false);
    });
  });

  // ─── updateArticle ────────────────────────────────────────────────────────

  describe('updateArticle', () => {
    test('should throw 404 if article not found', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValue(null);

      await expect(updateArticle({ title: 'New Title' }, 'test-article-1', 1)).rejects.toThrow();
    });

    test('should throw 404 with status when article not found', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValue(null);

      await expect(updateArticle({ title: 'New Title' }, 'test-article-1', 1)).rejects.toMatchObject({
        errorCode: 404,
      });
    });

    test('should throw 403 if user is not the author', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValue({ author: { id: 99, username: 'OtherUser' } });

      await expect(updateArticle({ title: 'New Title' }, 'test-article-1', 1)).rejects.toThrow();
    });

    test('should throw 403 with exact message when user is not the author', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValue({ author: { id: 99, username: 'OtherUser' } });

      await expect(updateArticle({ title: 'New Title' }, 'test-article-1', 1)).rejects.toMatchObject({
        errorCode: 403,
        message: { message: 'You are not authorized to update this article' },
      });
    });

    test('should throw 422 if new slug already exists', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ slug: 'new-title-1' });

      await expect(updateArticle({ title: 'New Title' }, 'old-slug', 1)).rejects.toThrow();
    });

    test('should throw 422 with exact error when slug is not unique', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ slug: 'new-title-1' });

      await expect(updateArticle({ title: 'New Title' }, 'old-slug', 1)).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { title: ['must be unique'] } },
      });
    });

    test('should call findFirst with slug for ownership check', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce(mockArticleDb);

      await updateArticle({ body: 'New body' }, 'test-article-1', 1);

      const findFirstCall = (prismaMock.article.findFirst as jest.Mock).mock.calls[0][0] as any;
      expect(findFirstCall.where).toEqual({ slug: 'test-article-1' });
      expect(findFirstCall.select.author).toBeDefined();
    });

    test('should disconnect tags before updating (call update with tagList.set:[])', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce(mockArticleDb);

      await updateArticle({ body: 'New body' }, 'test-article-1', 1);

      // First update call should disconnect tags
      const firstUpdateCall = (prismaMock.article.update as jest.Mock).mock.calls[0][0] as any;
      expect(firstUpdateCall.data.tagList).toEqual({ set: [] });
      expect(firstUpdateCall.where).toEqual({ slug: 'test-article-1' });
    });

    test('should include title in update data when title is provided', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce(null); // slug not taken
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({ ...mockArticleDb, title: 'New Title' });

      await updateArticle({ title: 'New Title' }, 'old-slug', 1);

      const mainUpdateCall = (prismaMock.article.update as jest.Mock).mock.calls[1][0] as any;
      expect(mainUpdateCall.data.title).toBe('New Title');
    });

    test('should include body in update data when body is provided', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({ ...mockArticleDb, body: 'New body' });

      await updateArticle({ body: 'New body' }, 'test-article-1', 1);

      const mainUpdateCall = (prismaMock.article.update as jest.Mock).mock.calls[1][0] as any;
      expect(mainUpdateCall.data.body).toBe('New body');
    });

    test('should include description in update data when description is provided', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({ ...mockArticleDb, description: 'New desc' });

      await updateArticle({ description: 'New desc' }, 'test-article-1', 1);

      const mainUpdateCall = (prismaMock.article.update as jest.Mock).mock.calls[1][0] as any;
      expect(mainUpdateCall.data.description).toBe('New desc');
    });

    test('should include new slug in update data when title changes', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce(null);
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({ ...mockArticleDb, slug: 'Brand-New-Title-1' });

      await updateArticle({ title: 'Brand New Title' }, 'old-slug', 1);

      const mainUpdateCall = (prismaMock.article.update as jest.Mock).mock.calls[1][0] as any;
      const expectedSlug = `${slugify('Brand New Title')}-1`;
      expect(mainUpdateCall.data.slug).toBe(expectedSlug);
    });

    test('should NOT include fields in update data when they are falsy', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce(mockArticleDb);

      await updateArticle({}, 'test-article-1', 1);

      const mainUpdateCall = (prismaMock.article.update as jest.Mock).mock.calls[1][0] as any;
      expect(mainUpdateCall.data).not.toHaveProperty('title');
      expect(mainUpdateCall.data).not.toHaveProperty('body');
      expect(mainUpdateCall.data).not.toHaveProperty('description');
      expect(mainUpdateCall.data).not.toHaveProperty('slug');
    });

    test('should skip slug uniqueness check when new slug equals current slug', async () => {
      const currentSlug = `${slugify('Test Article')}-1`;
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce(mockArticleDb);

      await updateArticle({ title: 'Test Article' }, currentSlug, 1);

      // findFirst should only be called once (ownership check), not twice
      expect(prismaMock.article.findFirst).toHaveBeenCalledTimes(1);
    });

    test('should use connectOrCreate for tagList when updating with non-empty array', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({ ...mockArticleDb, tagList: [{ name: 'newtag' }] });

      await updateArticle({ tagList: ['newtag'] }, 'test-article-1', 1);

      const mainUpdateCall = (prismaMock.article.update as jest.Mock).mock.calls[1][0] as any;
      expect(mainUpdateCall.data.tagList.connectOrCreate).toHaveLength(1);
      expect(mainUpdateCall.data.tagList.connectOrCreate[0]).toEqual({
        create: { name: 'newtag' },
        where: { name: 'newtag' },
      });
    });

    test('should use exact include structure for updateArticle main update', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValueOnce({ author: { id: 1, username: 'TestUser' } });
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce({});
      // @ts-ignore
      prismaMock.article.update.mockResolvedValueOnce(mockArticleDb);

      await updateArticle({ body: 'Updated body' }, 'test-article-1', 1);

      const mainUpdateCall = (prismaMock.article.update as jest.Mock).mock.calls[1][0] as any;
      expect(mainUpdateCall.include).toEqual(ARTICLE_INCLUDE);
    });
  });

  // ─── deleteArticle ────────────────────────────────────────────────────────

  describe('deleteArticle', () => {
    test('should throw 404 if article not found', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValue(null);

      await expect(deleteArticle('nonexistent', 1)).rejects.toThrow();
    });

    test('should throw 404 with status when article not found', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValue(null);

      await expect(deleteArticle('nonexistent', 1)).rejects.toMatchObject({ errorCode: 404 });
    });

    test('should throw 403 if user is not the author', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValue({ author: { id: 99, username: 'OtherUser' } });

      await expect(deleteArticle('test-article-1', 1)).rejects.toThrow();
    });

    test('should throw 403 with exact message when user is not authorized to delete', async () => {
      // @ts-ignore
      prismaMock.article.findFirst.mockResolvedValue({ author: { id: 99, username: 'OtherUser' } });

      await expect(deleteArticle('test-article-1', 1)).rejects.toMatchObject({
        errorCode: 403,
        message: { message: 'You are not authorized to delete this article' },
      });
    });

    test('should delete article successfully', async () => {
      prismaMock.article.findFirst.mockResolvedValue({ author: { id: 1, username: 'TestUser' } } as any);
      // @ts-ignore
      prismaMock.article.delete.mockResolvedValue(mockArticleDb);

      await expect(deleteArticle('test-article-1', 1)).resolves.not.toThrow();
    });

    test('should call article.delete with correct slug', async () => {
      prismaMock.article.findFirst.mockResolvedValue({ author: { id: 1, username: 'TestUser' } } as any);
      // @ts-ignore
      prismaMock.article.delete.mockResolvedValue({});

      await deleteArticle('test-article-1', 1);

      expect(prismaMock.article.delete).toHaveBeenCalledWith({ where: { slug: 'test-article-1' } });
    });

    test('should call findFirst with correct slug for ownership check', async () => {
      prismaMock.article.findFirst.mockResolvedValue({ author: { id: 1, username: 'TestUser' } } as any);
      // @ts-ignore
      prismaMock.article.delete.mockResolvedValue({});

      await deleteArticle('my-article-slug', 1);

      const findFirstCall = (prismaMock.article.findFirst as jest.Mock).mock.calls[0][0] as any;
      expect(findFirstCall.where).toEqual({ slug: 'my-article-slug' });
    });
  });

  // ─── getCommentsByArticle ─────────────────────────────────────────────────

  describe('getCommentsByArticle', () => {
    const mockCommentResult = {
      comments: [
        {
          id: 1,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          body: 'A comment',
          author: { username: 'TestUser', bio: null, image: null, followedBy: [{ id: 1 }] },
        },
      ],
    };

    test('should return comments without id (following:false)', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      const result = await getCommentsByArticle('test-article-1');
      expect(result).toHaveLength(1);
      expect(result![0]).toHaveProperty('body', 'A comment');
      expect(result![0].author).toHaveProperty('following', false);
    });

    test('should return following:true when user id is in comment author followedBy', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      const result = await getCommentsByArticle('test-article-1', 1);
      expect(result![0].author).toHaveProperty('following', true);
    });

    test('should return following:false when user id is NOT in followedBy', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      const result = await getCommentsByArticle('test-article-1', 999);
      expect(result![0].author).toHaveProperty('following', false);
    });

    test('should return undefined when article not found', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(null);

      const result = await getCommentsByArticle('test-article-1');
      expect(result).toBeUndefined();
    });

    test('should call findUnique with correct slug and comments include', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      await getCommentsByArticle('test-article-1', 1);

      const findCall = (prismaMock.article.findUnique as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.where).toEqual({ slug: 'test-article-1' });
      expect(findCall.include).toHaveProperty('comments');
    });

    test('should include demo:true in comments OR query', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      await getCommentsByArticle('test-article-1');

      const findCall = (prismaMock.article.findUnique as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.include.comments.where.OR).toContainEqual({ author: { demo: true } });
    });

    test('should include user id in comments OR query when id provided', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      await getCommentsByArticle('test-article-1', 5);

      const findCall = (prismaMock.article.findUnique as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.include.comments.where.OR).toContainEqual({ author: { id: 5 } });
    });

    test('should not include user id in OR query when id is not provided', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      await getCommentsByArticle('test-article-1');

      const findCall = (prismaMock.article.findUnique as jest.Mock).mock.calls[0][0] as any;
      const orQuery = findCall.include.comments.where.OR;
      expect(orQuery).toHaveLength(1);
    });

    test('should map comment fields correctly (id, body, createdAt, updatedAt, author)', async () => {
      // @ts-ignore
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      const result = await getCommentsByArticle('test-article-1');
      const comment = result![0];
      expect(comment).toHaveProperty('id', 1);
      expect(comment).toHaveProperty('body', 'A comment');
      expect(comment.author).toHaveProperty('username', 'TestUser');
    });
  });

  // ─── addComment ───────────────────────────────────────────────────────────

  describe('addComment', () => {
    test('should throw if body is missing', async () => {
      await expect(addComment('', 'test-article-1', 1)).rejects.toThrow();
    });

    test('should add a comment and return it with following:true', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 1 } as any);
      // @ts-ignore
      prismaMock.comment.create.mockResolvedValue({
        id: 1, createdAt: new Date(), updatedAt: new Date(), body: 'Nice article',
        author: { username: 'TestUser', bio: null, image: null, followedBy: [{ id: 1 }] },
      } as any);

      const result = await addComment('Nice article', 'test-article-1', 1);
      expect(result).toHaveProperty('body', 'Nice article');
      expect(result.author).toHaveProperty('following', true);
    });

    test('should return following:false when user id not in followedBy', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 1 } as any);
      // @ts-ignore
      prismaMock.comment.create.mockResolvedValue({
        id: 2, createdAt: new Date(), updatedAt: new Date(), body: 'Another',
        author: { username: 'Other', bio: null, image: null, followedBy: [{ id: 99 }] },
      } as any);

      const result = await addComment('Another', 'test-article-1', 2);
      expect(result.author).toHaveProperty('following', false);
    });

    test('should call article.findUnique to get article id by slug', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 7 } as any);
      // @ts-ignore
      prismaMock.comment.create.mockResolvedValue({
        id: 1, createdAt: new Date(), updatedAt: new Date(), body: 'test',
        author: { username: 'U', bio: null, image: null, followedBy: [] },
      } as any);

      await addComment('test', 'my-slug', 1);

      const findCall = (prismaMock.article.findUnique as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.where).toEqual({ slug: 'my-slug' });
      expect(findCall.select).toEqual({ id: true });
    });

    test('should call comment.create with body, article id connect, and author id connect', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 7 } as any);
      // @ts-ignore
      prismaMock.comment.create.mockResolvedValue({
        id: 1, createdAt: new Date(), updatedAt: new Date(), body: 'Hello',
        author: { username: 'U', bio: null, image: null, followedBy: [] },
      } as any);

      await addComment('Hello', 'test-article-1', 5);

      const createCall = (prismaMock.comment.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.body).toBe('Hello');
      expect(createCall.data.article).toEqual({ connect: { id: 7 } });
      expect(createCall.data.author).toEqual({ connect: { id: 5 } });
    });

    test('should use exact include structure for comment.create', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 7 } as any);
      // @ts-ignore
      prismaMock.comment.create.mockResolvedValue({
        id: 1, createdAt: new Date(), updatedAt: new Date(), body: 'test',
        author: { username: 'U', bio: null, image: null, followedBy: [] },
      } as any);

      await addComment('test', 'test-article-1', 1);

      const createCall = (prismaMock.comment.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.include).toEqual({
        author: { select: { username: true, bio: true, image: true, followedBy: true } },
      });
    });

    test('should throw with body error when body is empty', async () => {
      await expect(addComment('', 'test-article-1', 1)).rejects.toMatchObject({
        message: { errors: { body: ["can't be blank"] } },
      });
    });
  });

  // ─── deleteComment ────────────────────────────────────────────────────────

  describe('deleteComment', () => {
    test('should throw 404 when comment is not found', async () => {
      // @ts-ignore
      prismaMock.comment.findFirst.mockResolvedValue(null);

      await expect(deleteComment(1, 123)).rejects.toThrow();
    });

    test('should throw 403 when comment author id differs from userId', async () => {
      prismaMock.comment.findFirst.mockResolvedValue({ author: { id: 999, username: 'Other' } } as any);

      await expect(deleteComment(1, 123)).rejects.toThrow();
    });

    test('should delete comment successfully', async () => {
      prismaMock.comment.findFirst.mockResolvedValue({ author: { id: 123, username: 'TestUser' } } as any);
      // @ts-ignore
      prismaMock.comment.delete.mockResolvedValue({});

      await expect(deleteComment(1, 123)).resolves.not.toThrow();
    });

    test('should call comment.findFirst with id and author.id:userId', async () => {
      prismaMock.comment.findFirst.mockResolvedValue({ author: { id: 123, username: 'TestUser' } } as any);
      // @ts-ignore
      prismaMock.comment.delete.mockResolvedValue({});

      await deleteComment(42, 123);

      const findCall = (prismaMock.comment.findFirst as jest.Mock).mock.calls[0][0] as any;
      expect(findCall.where.id).toBe(42);
      expect(findCall.where.author.id).toBe(123);
    });

    test('should call comment.delete with correct comment id', async () => {
      prismaMock.comment.findFirst.mockResolvedValue({ author: { id: 123, username: 'TestUser' } } as any);
      // @ts-ignore
      prismaMock.comment.delete.mockResolvedValue({});

      await deleteComment(42, 123);

      expect(prismaMock.comment.delete).toHaveBeenCalledWith({ where: { id: 42 } });
    });
  });

  // ─── favoriteArticle ──────────────────────────────────────────────────────

  describe('favoriteArticle', () => {
    const mockedFavoriteResponse = {
      id: 123, slug: 'test-article', title: 'Test', description: '', body: '',
      createdAt: new Date(), updatedAt: new Date(), authorId: 456,
      tagList: [{ name: 'dragons' }],
      favoritedBy: [{ id: 123 }],
      author: { username: 'RealWorld', bio: null, image: null, followedBy: [{ id: 123 }] },
      _count: { favoritedBy: 1 },
    };

    test('should return the favorited article with favoritesCount', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedFavoriteResponse);

      const result = await favoriteArticle('test-article', 123);
      expect(result).toHaveProperty('favoritesCount', 1);
    });

    test('should return favorited:true when user id is in favoritedBy', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedFavoriteResponse);

      const result = await favoriteArticle('test-article', 123);
      expect(result).toHaveProperty('favorited', true);
    });

    test('should return favorited:false when user id is NOT in favoritedBy', async () => {
      const response = { ...mockedFavoriteResponse, favoritedBy: [{ id: 456 }], _count: { favoritedBy: 1 } };
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(response);

      const result = await favoriteArticle('test-article', 123);
      expect(result).toHaveProperty('favorited', false);
    });

    test('should call update with connect (NOT disconnect)', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedFavoriteResponse);

      await favoriteArticle('test-article', 123);

      const updateCall = (prismaMock.article.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data.favoritedBy).toEqual({ connect: { id: 123 } });
    });

    test('should call update with correct slug in where', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedFavoriteResponse);

      await favoriteArticle('my-slug', 123);

      const updateCall = (prismaMock.article.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.where).toEqual({ slug: 'my-slug' });
    });

    test('should return tagList as array of strings', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedFavoriteResponse);

      const result = await favoriteArticle('test-article', 123);
      expect(result.tagList).toEqual(['dragons']);
    });

    test('should return favoritesCount from _count.favoritedBy', async () => {
      const response = { ...mockedFavoriteResponse, _count: { favoritedBy: 5 } };
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(response);

      const result = await favoriteArticle('test-article', 123);
      expect(result.favoritesCount).toBe(5);
    });

    test('should throw when article update fails', async () => {
      // @ts-ignore
      prismaMock.article.update.mockRejectedValue(new Error('Not found'));

      await expect(favoriteArticle('nonexistent', 123)).rejects.toThrow();
    });

    test('should use exact include structure for favoriteArticle update', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedFavoriteResponse);

      await favoriteArticle('test-article', 123);

      const updateCall = (prismaMock.article.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.include).toEqual(ARTICLE_INCLUDE);
    });
  });

  // ─── unfavoriteArticle ────────────────────────────────────────────────────

  describe('unfavoriteArticle', () => {
    const mockedUnfavoriteResponse = {
      id: 123, slug: 'test-article', title: 'Test', description: '', body: '',
      createdAt: new Date(), updatedAt: new Date(), authorId: 456,
      tagList: [{ name: 'react' }],
      favoritedBy: [{ id: 456 }],
      author: { username: 'RealWorld', bio: null, image: null, followedBy: [] },
      _count: { favoritedBy: 1 },
    };

    test('should return the unfavorited article', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedUnfavoriteResponse);

      const result = await unfavoriteArticle('test-article', 123);
      expect(result).toHaveProperty('favoritesCount', 1);
    });

    test('should return favorited:false when user id NOT in favoritedBy after unfavorite', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedUnfavoriteResponse);

      const result = await unfavoriteArticle('test-article', 123);
      expect(result).toHaveProperty('favorited', false);
    });

    test('should call update with disconnect (NOT connect)', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedUnfavoriteResponse);

      await unfavoriteArticle('test-article', 123);

      const updateCall = (prismaMock.article.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data.favoritedBy).toEqual({ disconnect: { id: 123 } });
    });

    test('should call update with correct slug in where', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedUnfavoriteResponse);

      await unfavoriteArticle('my-slug', 123);

      const updateCall = (prismaMock.article.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.where).toEqual({ slug: 'my-slug' });
    });

    test('should return tagList as array of strings', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedUnfavoriteResponse);

      const result = await unfavoriteArticle('test-article', 123);
      expect(result.tagList).toEqual(['react']);
    });

    test('should return favoritesCount from _count.favoritedBy', async () => {
      const response = { ...mockedUnfavoriteResponse, _count: { favoritedBy: 3 } };
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(response);

      const result = await unfavoriteArticle('test-article', 123);
      expect(result.favoritesCount).toBe(3);
    });

    test('should throw when article update fails', async () => {
      // @ts-ignore
      prismaMock.article.update.mockRejectedValue(new Error('Not found'));

      await expect(unfavoriteArticle('nonexistent', 123)).rejects.toThrow();
    });

    test('should use exact include structure for unfavoriteArticle update', async () => {
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedUnfavoriteResponse);

      await unfavoriteArticle('test-article', 123);

      const updateCall = (prismaMock.article.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.include).toEqual(ARTICLE_INCLUDE);
    });
  });
});
