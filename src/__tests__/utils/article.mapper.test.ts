import articleMapper from '../../app/routes/article/article.mapper';

describe('articleMapper', () => {
  const mockArticle = {
    slug: 'test-article-1',
    title: 'Test Article',
    description: 'Test description',
    body: 'Test body',
    tagList: [{ name: 'tag1' }, { name: 'tag2' }],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    favoritedBy: [{ id: 42 }],
    author: {
      username: 'TestUser',
      bio: null,
      image: null,
      followedBy: [],
    },
  };

  test('should return favorited: true when user has favorited the article', () => {
    const result = articleMapper(mockArticle, 42);
    expect(result.favorited).toBe(true);
  });

  test('should return favorited: false when user has NOT favorited the article', () => {
    const result = articleMapper(mockArticle, 99);
    expect(result.favorited).toBe(false);
  });

  test('should return favorited: false when no id is provided', () => {
    const result = articleMapper(mockArticle);
    expect(result.favorited).toBe(false);
  });

  test('should map tagList to an array of tag name strings', () => {
    const result = articleMapper(mockArticle, 42);
    expect(result.tagList).toEqual(['tag1', 'tag2']);
  });

  test('should include correct article fields', () => {
    const result = articleMapper(mockArticle, 42);
    expect(result).toHaveProperty('slug', 'test-article-1');
    expect(result).toHaveProperty('title', 'Test Article');
    expect(result).toHaveProperty('description', 'Test description');
    expect(result).toHaveProperty('body', 'Test body');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
    expect(result).toHaveProperty('favoritesCount', 1);
    expect(result).toHaveProperty('author');
  });
});
