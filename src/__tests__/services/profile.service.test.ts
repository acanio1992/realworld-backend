import prismaMock from '../prisma-mock';
import { followUser, getProfile, unfollowUser } from '../../app/routes/profile/profile.service';

const mockUserBase = {
  id: 456,
  username: 'OtherUser',
  email: 'other@me',
  bio: 'Bio text',
  image: 'img.png',
  followedBy: [] as { id: number }[],
};

describe('ProfileService', () => {
  describe('getProfile', () => {
    test('should return following:false when viewer is NOT in followedBy', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUserBase, followedBy: [] });
      const result = await getProfile('OtherUser', 123);
      expect(result).toHaveProperty('following', false);
    });

    test('should return following:true when viewer IS in followedBy', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUserBase,
        followedBy: [{ id: 123 }],
      });
      const result = await getProfile('OtherUser', 123);
      expect(result).toHaveProperty('following', true);
    });

    test('should return following:false when id is undefined', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUserBase,
        followedBy: [{ id: 123 }],
      });
      const result = await getProfile('OtherUser', undefined);
      expect(result).toHaveProperty('following', false);
    });

    test('should throw 404 when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(getProfile('Nobody', 123)).rejects.toThrow();
    });

    test('should call findUnique with correct username and include followedBy:true', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      await getProfile('OtherUser', 123);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'OtherUser' },
        include: { followedBy: true },
      });
    });

    test('should return correct profile shape', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      const result = await getProfile('OtherUser', 123);
      expect(result).toEqual({
        username: 'OtherUser',
        bio: 'Bio text',
        image: 'img.png',
        following: false,
      });
    });
  });

  describe('followUser', () => {
    test('should return following:true after following (viewer in followedBy)', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({
        ...mockUserBase,
        followedBy: [{ id: 123 }],
      });

      const result = await followUser('OtherUser', 123);
      expect(result).toHaveProperty('following', true);
    });

    test('should return following:false when viewer is not in followedBy after update', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      const result = await followUser('OtherUser', 999);
      expect(result).toHaveProperty('following', false);
    });

    test('should call update with connect (NOT disconnect)', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ ...mockUserBase, followedBy: [{ id: 123 }] });

      await followUser('OtherUser', 123);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { username: 'OtherUser' },
        data: { followedBy: { connect: { id: 123 } } },
        include: { followedBy: true },
      });
    });

    test('should call update with correct username in where clause', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      await followUser('TargetUser', 123);

      const call = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(call.where).toEqual({ username: 'TargetUser' });
    });

    test('should include followedBy:true in update query', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      await followUser('OtherUser', 123);

      const call = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(call.include).toEqual({ followedBy: true });
    });

    test('should throw when update throws (user not found)', async () => {
      prismaMock.user.update.mockRejectedValue(new Error('Record not found'));
      await expect(followUser('Nobody', 123)).rejects.toThrow();
    });
  });

  describe('unfollowUser', () => {
    test('should return following:false after unfollowing', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      const result = await unfollowUser('OtherUser', 123);
      expect(result).toHaveProperty('following', false);
    });

    test('should call update with disconnect (NOT connect)', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      await unfollowUser('OtherUser', 123);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { username: 'OtherUser' },
        data: { followedBy: { disconnect: { id: 123 } } },
        include: { followedBy: true },
      });
    });

    test('should call update with correct username in where clause', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      await unfollowUser('TargetUser', 456);

      const call = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(call.where).toEqual({ username: 'TargetUser' });
    });

    test('should include followedBy:true in unfollow update query', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ ...mockUserBase, followedBy: [] });

      await unfollowUser('OtherUser', 123);

      const call = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(call.include).toEqual({ followedBy: true });
    });

    test('should throw when update throws (user not found)', async () => {
      prismaMock.user.update.mockRejectedValue(new Error('Record not found'));
      await expect(unfollowUser('Nobody', 123)).rejects.toThrow();
    });
  });
});
