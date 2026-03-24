// @ts-nocheck
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

describe('ArticleService', () => {
  describe('getArticles', () => {
    test('should return articles and count without id', async () => {
      // 
      prismaMock.article.count.mockResolvedValue(1);
      // 
      prismaMock.article.findMany.mockResolvedValue([mockArticleDb]);

      const result = await getArticles({});
      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('articlesCount', 1);
      expect(result.articles).toHaveLength(1);
    });

    test('should return articles with id', async () => {
      // 
      prismaMock.article.count.mockResolvedValue(1);
      // 
      prismaMock.article.findMany.mockResolvedValue([mockArticleDb]);

      const result = await getArticles({}, 1);
      expect(result).toHaveProperty('articles');
      expect(result.articles[0]).toHaveProperty('slug', 'test-article-1');
    });

    test('should filter by author query param', async () => {
      // 
      prismaMock.article.count.mockResolvedValue(0);
      // 
      prismaMock.article.findMany.mockResolvedValue([]);

      const result = await getArticles({ author: 'TestUser' });
      expect(result.articlesCount).toBe(0);
    });

    test('should filter by tag query param', async () => {
      // 
      prismaMock.article.count.mockResolvedValue(0);
      // 
      prismaMock.article.findMany.mockResolvedValue([]);

      const result = await getArticles({ tag: 'test' });
      expect(result.articlesCount).toBe(0);
    });

    test('should filter by favorited query param', async () => {
      // 
      prismaMock.article.count.mockResolvedValue(0);
      // 
      prismaMock.article.findMany.mockResolvedValue([]);

      const result = await getArticles({ favorited: 'TestUser' });
      expect(result.articlesCount).toBe(0);
    });

    test('should apply offset and limit', async () => {
      // 
      prismaMock.article.count.mockResolvedValue(5);
      // 
      prismaMock.article.findMany.mockResolvedValue([]);

      const result = await getArticles({ offset: 2, limit: 2 });
      expect(result.articlesCount).toBe(5);
    });
  });

  describe('getFeed', () => {
    test('should return feed articles and count', async () => {
      // 
      prismaMock.article.count.mockResolvedValue(1);
      // 
      prismaMock.article.findMany.mockResolvedValue([mockArticleDb]);

      const result = await getFeed(0, 10, 1);
      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('articlesCount', 1);
    });

    test('should use offset and default limit when limit is 0', async () => {
      // Covers `skip: offset || 0` left branch (offset truthy) and
      // `take: limit || 10` right branch (limit falsy → default 10)
      // 
      prismaMock.article.count.mockResolvedValue(0);
      // 
      prismaMock.article.findMany.mockResolvedValue([]);

      const result = await getFeed(5, 0, 1);
      expect(result).toHaveProperty('articlesCount', 0);
    });
  });

  describe('createArticle', () => {
    test('should throw if title is missing', async () => {
      await expect(createArticle({ description: 'desc', body: 'body' }, 1)).rejects.toThrow();
    });

    test('should throw if description is missing', async () => {
      await expect(createArticle({ title: 'Title', body: 'body' }, 1)).rejects.toThrow();
    });

    test('should throw if body is missing', async () => {
      await expect(
        createArticle({ title: 'Title', description: 'desc' }, 1),
      ).rejects.toThrow();
    });

    test('should use empty tagList if tagList is not an array', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue(null);
      // 
      prismaMock.article.create.mockResolvedValue({ ...mockArticleDb, tagList: [] });

      const result = await createArticle(
        { title: 'Test Article', description: 'desc', body: 'body', tagList: 'not-array' },
        1,
      );
      expect(result).toHaveProperty('slug');
    });

    test('should use tagList if tagList is an array', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue(null);
      // 
      prismaMock.article.create.mockResolvedValue({
        ...mockArticleDb,
        tagList: [{ name: 'tag1' }],
      });

      const result = await createArticle(
        { title: 'Test Article', description: 'desc', body: 'body', tagList: ['tag1'] },
        1,
      );
      expect(result).toHaveProperty('tagList');
    });

    test('should throw if slug already exists (duplicate title)', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue({ slug: 'test-article-1' });

      await expect(
        createArticle({ title: 'Test Article', description: 'desc', body: 'body' }, 1),
      ).rejects.toThrow();
    });

    test('should create article successfully', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue(null);
      // 
      prismaMock.article.create.mockResolvedValue(mockArticleDb);

      const result = await createArticle(
        { title: 'Test Article', description: 'Test description', body: 'Test body' },
        1,
      );
      expect(result).toHaveProperty('slug');
      expect(result).toHaveProperty('title');
    });
  });

  describe('getArticle', () => {
    test('should return article when found', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue(mockArticleDb);

      const result = await getArticle('test-article-1');
      expect(result).toHaveProperty('slug', 'test-article-1');
    });

    test('should return article with id for favorited check', async () => {
      const articleWithFavorite = {
        ...mockArticleDb,
        favoritedBy: [{ id: 1 }],
      };
      // 
      prismaMock.article.findUnique.mockResolvedValue(articleWithFavorite);

      const result = await getArticle('test-article-1', 1);
      expect(result).toHaveProperty('favorited', true);
    });

    test('should throw 404 when article not found', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue(null);

      await expect(getArticle('nonexistent')).rejects.toThrow();
    });
  });

  describe('updateArticle', () => {
    test('should throw 404 if article not found', async () => {
      // 
      prismaMock.article.findFirst.mockResolvedValue(null);

      await expect(
        updateArticle({ title: 'New Title' }, 'test-article-1', 1),
      ).rejects.toThrow();
    });

    test('should throw 403 if user is not the author', async () => {
      // 
      prismaMock.article.findFirst.mockResolvedValue({
        author: { id: 99, username: 'OtherUser' },
      } as any);

      await expect(
        updateArticle({ title: 'New Title' }, 'test-article-1', 1),
      ).rejects.toThrow();
    });

    test('should throw 422 if new slug already exists', async () => {
      // First findFirst is for ownership check
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce({
        author: { id: 1, username: 'TestUser' },
      } as any);
      // Second findFirst is for slug duplicate check
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce({ slug: 'new-title-1' });

      await expect(
        updateArticle({ title: 'New Title' }, 'old-slug', 1),
      ).rejects.toThrow();
    });

    test('should skip slug duplicate check when new slug equals old slug', async () => {
      // Ownership check
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce({
        author: { id: 1, username: 'TestUser' },
      } as any);
      // disconnectArticlesTags calls article.update
      // 
      prismaMock.article.update.mockResolvedValueOnce({});
      // Main update
      // 
      prismaMock.article.update.mockResolvedValueOnce(mockArticleDb);

      // slug 'Test-Article-1' from title 'Test Article' with id=1 should produce slug 'Test-Article-1'
      // The existing slug must match the generated slug
      const result = await updateArticle(
        { title: 'Test Article' },
        'Test-Article-1',
        1,
      );
      expect(result).toHaveProperty('slug');
    });

    test('should update article with new title and no slug conflict', async () => {
      // Ownership check
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce({
        author: { id: 1, username: 'TestUser' },
      } as any);
      // Slug uniqueness check (new slug is different and not found)
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce(null);
      // disconnectArticlesTags calls article.update
      // 
      prismaMock.article.update.mockResolvedValueOnce({});
      // Main update
      // 
      prismaMock.article.update.mockResolvedValueOnce({
        ...mockArticleDb,
        title: 'Brand New Title',
        slug: 'Brand-New-Title-1',
      });

      const result = await updateArticle(
        { title: 'Brand New Title' },
        'test-article-1',
        1,
      );
      expect(result).toHaveProperty('slug');
    });

    test('should update article without title change', async () => {
      // Ownership check
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce({
        author: { id: 1, username: 'TestUser' },
      } as any);
      // disconnectArticlesTags calls article.update
      // 
      prismaMock.article.update.mockResolvedValueOnce({});
      // Main update
      // 
      prismaMock.article.update.mockResolvedValueOnce({
        ...mockArticleDb,
        body: 'Updated body',
      });

      const result = await updateArticle({ body: 'Updated body' }, 'test-article-1', 1);
      expect(result).toHaveProperty('body');
    });

    test('should update article with description (covers description truthy branch)', async () => {
      // Ownership check
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce({
        author: { id: 1, username: 'TestUser' },
      } as any);
      // disconnectArticlesTags
      // 
      prismaMock.article.update.mockResolvedValueOnce({});
      // Main update
      // 
      prismaMock.article.update.mockResolvedValueOnce({
        ...mockArticleDb,
        description: 'New description',
      });

      const result = await updateArticle(
        { description: 'New description' },
        'test-article-1',
        1,
      );
      expect(result).toHaveProperty('description', 'New description');
    });

    test('should update article with tagList', async () => {
      // Ownership check
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce({
        author: { id: 1, username: 'TestUser' },
      } as any);
      // disconnectArticlesTags calls article.update
      // 
      prismaMock.article.update.mockResolvedValueOnce({});
      // Main update
      // 
      prismaMock.article.update.mockResolvedValueOnce({
        ...mockArticleDb,
        tagList: [{ name: 'newtag' }],
      });

      const result = await updateArticle(
        { tagList: ['newtag'] },
        'test-article-1',
        1,
      );
      expect(result).toHaveProperty('tagList');
    });

    test('should update article with empty tagList', async () => {
      // Ownership check
      // 
      prismaMock.article.findFirst.mockResolvedValueOnce({
        author: { id: 1, username: 'TestUser' },
      } as any);
      // disconnectArticlesTags calls article.update
      // 
      prismaMock.article.update.mockResolvedValueOnce({});
      // Main update
      // 
      prismaMock.article.update.mockResolvedValueOnce({
        ...mockArticleDb,
        tagList: [],
      });

      const result = await updateArticle({ tagList: [] }, 'test-article-1', 1);
      expect(result).toHaveProperty('tagList');
    });
  });

  describe('deleteArticle', () => {
    test('should throw 404 if article not found', async () => {
      // 
      prismaMock.article.findFirst.mockResolvedValue(null);

      await expect(deleteArticle('nonexistent', 1)).rejects.toThrow();
    });

    test('should throw 403 if user is not the author', async () => {
      // 
      prismaMock.article.findFirst.mockResolvedValue({
        author: { id: 99, username: 'OtherUser' },
      } as any);

      await expect(deleteArticle('test-article-1', 1)).rejects.toThrow();
    });

    test('should delete article successfully', async () => {
      prismaMock.article.findFirst.mockResolvedValue({
        author: { id: 1, username: 'TestUser' },
      } as any);
      // 
      prismaMock.article.delete.mockResolvedValue(mockArticleDb);

      await expect(deleteArticle('test-article-1', 1)).resolves.not.toThrow();
      expect(prismaMock.article.delete).toHaveBeenCalled();
    });
  });

  describe('getCommentsByArticle', () => {
    const mockCommentResult = {
      comments: [
        {
          id: 1,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          body: 'A comment',
          author: {
            username: 'TestUser',
            bio: null,
            image: null,
            followedBy: [{ id: 1 }],
          },
        },
      ],
    };

    test('should return comments without id', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      const result = await getCommentsByArticle('test-article-1');
      expect(result).toHaveLength(1);
      expect(result![0]).toHaveProperty('body', 'A comment');
      expect(result![0].author).toHaveProperty('following', false);
    });

    test('should return comments with id', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue(mockCommentResult);

      const result = await getCommentsByArticle('test-article-1', 1);
      expect(result).toHaveLength(1);
    });

    test('should return undefined when comments is null/undefined', async () => {
      // 
      prismaMock.article.findUnique.mockResolvedValue(null);

      const result = await getCommentsByArticle('test-article-1');
      expect(result).toBeUndefined();
    });
  });

  describe('addComment', () => {
    test('should throw if body is missing', async () => {
      await expect(addComment('', 'test-article-1', 1)).rejects.toThrow();
    });

    test('should add a comment successfully', async () => {
      prismaMock.article.findUnique.mockResolvedValue({ id: 1 } as any);
      //  - Prisma's CommentScalarWhereWithAggregatesInput has circular type refs (TS2615)
      prismaMock.comment.create.mockResolvedValue({
        id: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        body: 'Nice article',
        author: {
          username: 'TestUser',
          bio: null,
          image: null,
          followedBy: [{ id: 1 }],
        },
      } as any);

      const result = await addComment('Nice article', 'test-article-1', 1);
      expect(result).toHaveProperty('body', 'Nice article');
      expect(result.author).toHaveProperty('username', 'TestUser');
      expect(result.author).toHaveProperty('following', true);
    });

    test('should add a comment with following: false when user is not followed', async () => {
      // Covers `follow.id === id` returning false in the .some() callback (line 522)
      prismaMock.article.findUnique.mockResolvedValue({ id: 1 } as any);
      //  - Prisma's CommentScalarWhereWithAggregatesInput has circular type refs (TS2615)
      prismaMock.comment.create.mockResolvedValue({
        id: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        body: 'Another comment',
        author: {
          username: 'OtherUser',
          bio: null,
          image: null,
          followedBy: [{ id: 99 }], // id 2 is NOT in followedBy → following: false
        },
      } as any);

      const result = await addComment('Another comment', 'test-article-1', 2);
      expect(result.author).toHaveProperty('following', false);
    });
  });

  describe('deleteComment', () => {
    test('should throw 404 when comment is not found', async () => {
      // 
      prismaMock.comment.findFirst.mockResolvedValue(null);

      await expect(deleteComment(1, 123)).rejects.toThrow();
    });

    test('should throw 403 when user is not the author', async () => {
      // deleteComment queries with author.id === userId, so findFirst returns null for wrong user
      // But the service also checks comment.author.id !== userId after findFirst
      // The findFirst query already filters by author.id === userId, so if wrong user,
      // findFirst returns null. To test the 403 branch we need comment.author.id !== userId.
      // We mock findFirst to return a comment with a different author id.
      prismaMock.comment.findFirst.mockResolvedValue({
        author: { id: 999, username: 'Other' },
      } as any);

      await expect(deleteComment(1, 123)).rejects.toThrow();
    });

    test('should delete comment successfully', async () => {
      prismaMock.comment.findFirst.mockResolvedValue({
        author: { id: 123, username: 'TestUser' },
      } as any);
      // 
      prismaMock.comment.delete.mockResolvedValue({});

      await expect(deleteComment(1, 123)).resolves.not.toThrow();
      expect(prismaMock.comment.delete).toHaveBeenCalled();
    });
  });

  describe('favoriteArticle', () => {
    test('should return the favorited article', async () => {
      const mockedArticleResponse = {
        id: 123,
        slug: 'How-to-train-your-dragon',
        title: 'How to train your dragon',
        description: '',
        body: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 456,
        tagList: [{ name: 'dragons' }],
        favoritedBy: [{ id: 123 }],
        author: {
          username: 'RealWorld',
          bio: null,
          image: null,
          followedBy: [{ id: 123 }],
        },
        _count: { favoritedBy: 1 },
      };

      // 
      prismaMock.article.update.mockResolvedValue(mockedArticleResponse);

      await expect(favoriteArticle('How-to-train-your-dragon', 123)).resolves.toHaveProperty(
        'favoritesCount',
      );
    });

    test('should throw an error if article update fails', async () => {
      // 
      prismaMock.article.update.mockRejectedValue(new Error('Not found'));

      await expect(favoriteArticle('nonexistent', 123)).rejects.toThrow();
    });
  });

  describe('unfavoriteArticle', () => {
    test('should return the unfavorited article', async () => {
      const mockedArticleResponse = {
        id: 123,
        slug: 'How-to-train-your-dragon',
        title: 'How to train your dragon',
        description: '',
        body: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 456,
        tagList: [{ name: 'dragons' }],
        favoritedBy: [{ id: 456 }],
        author: {
          username: 'RealWorld',
          bio: null,
          image: null,
          followedBy: [],
        },
        _count: { favoritedBy: 1 },
      };

      // 
      prismaMock.article.update.mockResolvedValue(mockedArticleResponse);

      await expect(unfavoriteArticle('How-to-train-your-dragon', 123)).resolves.toHaveProperty(
        'favoritesCount',
      );
    });

    test('should throw an error if article update fails', async () => {
      // 
      prismaMock.article.update.mockRejectedValue(new Error('Not found'));

      await expect(unfavoriteArticle('nonexistent', 123)).rejects.toThrow();
    });
  });
});
