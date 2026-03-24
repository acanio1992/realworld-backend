import authorMapper from '../../app/routes/article/author.mapper';

describe('authorMapper', () => {
  const mockAuthor = {
    username: 'TestUser',
    bio: 'My bio',
    image: 'http://example.com/image.png',
    followedBy: [{ id: 42 }],
  };

  test('should return following: true when user follows the author', () => {
    const result = authorMapper(mockAuthor, 42);
    expect(result.following).toBe(true);
  });

  test('should return following: false when user does NOT follow the author', () => {
    const result = authorMapper(mockAuthor, 99);
    expect(result.following).toBe(false);
  });

  test('should return following: false when no id is provided (undefined)', () => {
    const result = authorMapper(mockAuthor, undefined);
    expect(result.following).toBe(false);
  });

  test('should include correct author fields', () => {
    const result = authorMapper(mockAuthor, 42);
    expect(result).toHaveProperty('username', 'TestUser');
    expect(result).toHaveProperty('bio', 'My bio');
    expect(result).toHaveProperty('image', 'http://example.com/image.png');
  });
});
