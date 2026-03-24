import * as bcrypt from 'bcryptjs';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import prisma from '../../prisma/prisma-client';
import { createUser, getCurrentUser, login, updateUser } from '../../app/routes/auth/auth.service';

jest.mock('../../prisma/prisma-client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe('AuthService', () => {
  describe('createUser', () => {
    test('should create new user and return a token', async () => {
      const user = { username: 'RealWorld', email: 'realworld@me', password: '1234' };
      const mockedResponse = { id: 123, username: 'RealWorld', email: 'realworld@me', bio: null, image: null };

      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue(mockedResponse);

      await expect(createUser(user)).resolves.toHaveProperty('token');
    });

    test('should throw when username is blank (whitespace)', async () => {
      await expect(createUser({ username: ' ', email: 'realworld@me', password: '1234' })).rejects.toThrow();
    });

    test('should throw 422 with username error when username is blank', async () => {
      await expect(createUser({ username: ' ', email: 'realworld@me', password: '1234' })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { username: ["can't be blank"] } },
      });
    });

    test('should throw when email is blank (whitespace)', async () => {
      await expect(createUser({ username: 'RealWorld', email: '  ', password: '1234' })).rejects.toThrow();
    });

    test('should throw 422 with email error when email is blank', async () => {
      await expect(createUser({ username: 'RealWorld', email: '  ', password: '1234' })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { email: ["can't be blank"] } },
      });
    });

    test('should throw when password is blank (whitespace)', async () => {
      await expect(createUser({ username: 'RealWorld', email: 'realworld@me', password: ' ' })).rejects.toThrow();
    });

    test('should throw 422 with password error when password is blank', async () => {
      await expect(createUser({ username: 'RealWorld', email: 'realworld@me', password: ' ' })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { password: ["can't be blank"] } },
      });
    });

    test('should throw when email is undefined', async () => {
      await expect(createUser({ username: 'RealWorld', email: undefined as any, password: '1234' })).rejects.toThrow();
    });

    test('should throw 422 with email error when email is undefined', async () => {
      await expect(createUser({ username: 'RealWorld', email: undefined as any, password: '1234' })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { email: ["can't be blank"] } },
      });
    });

    test('should throw when username is undefined', async () => {
      await expect(createUser({ username: undefined as any, email: 'r@me', password: '1234' })).rejects.toThrow();
    });

    test('should throw 422 with username error when username is undefined', async () => {
      await expect(createUser({ username: undefined as any, email: 'r@me', password: '1234' })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { username: ["can't be blank"] } },
      });
    });

    test('should throw when password is undefined', async () => {
      await expect(createUser({ username: 'RealWorld', email: 'r@me', password: undefined as any })).rejects.toThrow();
    });

    test('should throw 422 with password error when password is undefined', async () => {
      await expect(createUser({ username: 'RealWorld', email: 'r@me', password: undefined as any })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { password: ["can't be blank"] } },
      });
    });

    test('should throw when both email and username are already taken', async () => {
      const existingUser = { id: 1, username: 'RealWorld', email: 'realworld@me', password: 'x', bio: null, image: null, demo: false };
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(existingUser);
      await expect(createUser({ username: 'RealWorld', email: 'realworld@me', password: '1234' })).rejects.toThrow();
    });

    test('should throw error with email field only when only email is taken', async () => {
      const existingUserByEmail = { id: 1, username: 'Other', email: 'taken@me', password: 'x', bio: null, image: null, demo: false };
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValueOnce(existingUserByEmail);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(createUser({ username: 'NewUser', email: 'taken@me', password: '1234' })).rejects.toMatchObject({
        message: expect.objectContaining({ errors: expect.objectContaining({ email: ['has already been taken'] }) }),
      });
    });

    test('should throw error with username field only when only username is taken', async () => {
      const existingUserByUsername = { id: 2, username: 'TakenUser', email: 'other@me', password: 'x', bio: null, image: null, demo: false };
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValueOnce(existingUserByUsername);

      await expect(createUser({ username: 'TakenUser', email: 'new@me', password: '1234' })).rejects.toMatchObject({
        message: expect.objectContaining({ errors: expect.objectContaining({ username: ['has already been taken'] }) }),
      });
    });

    test('should call findUnique with email then with username for uniqueness check', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await createUser({ username: 'RW', email: 'rw@me', password: '1234' });

      expect(prismaMock.user.findUnique).toHaveBeenNthCalledWith(1,
        expect.objectContaining({ where: { email: 'rw@me' }, select: { id: true } }),
      );
      expect(prismaMock.user.findUnique).toHaveBeenNthCalledWith(2,
        expect.objectContaining({ where: { username: 'RW' }, select: { id: true } }),
      );
    });

    test('should call user.create with trimmed fields and hashed password', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await createUser({ username: '  RW  ', email: '  rw@me  ', password: '  pass  ' });

      const createCall = (prismaMock.user.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.username).toBe('RW');
      expect(createCall.data.email).toBe('rw@me');
      expect(typeof createCall.data.password).toBe('string');
      expect(createCall.data.password).not.toBe('pass'); // must be hashed
    });

    test('should call user.create with select containing all required fields', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await createUser({ username: 'RW', email: 'rw@me', password: '1234' });

      expect(prismaMock.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          select: { id: true, email: true, username: true, bio: true, image: true },
        }),
      );
    });

    test('should store a bcrypt hash (not plaintext) in create data', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await createUser({ username: 'RW', email: 'rw@me', password: 'secret' });

      const createCall = (prismaMock.user.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.password).not.toBe('secret');
      const isValidHash = await bcrypt.compare('secret', createCall.data.password);
      expect(isValidHash).toBe(true);
    });

    test('should create user with image when image is provided', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: 'img.png' });

      const result = await createUser({ username: 'RW', email: 'rw@me', password: '1234', image: 'img.png' });

      const createCall = (prismaMock.user.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.image).toBe('img.png');
      expect(result).toHaveProperty('token');
    });

    test('should create user with bio when bio is provided', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: 'My bio', image: null });

      await createUser({ username: 'RW', email: 'rw@me', password: '1234', bio: 'My bio' });

      const createCall = (prismaMock.user.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.bio).toBe('My bio');
    });

    test('should create user with demo flag when demo is true', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue({ id: 1, username: 'DemoUser', email: 'demo@me', bio: null, image: null });

      await createUser({ username: 'DemoUser', email: 'demo@me', password: '1234', demo: true });

      const createCall = (prismaMock.user.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data.demo).toBe(true);
    });

    test('should NOT include image in create data when image is falsy', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await createUser({ username: 'RW', email: 'rw@me', password: '1234' });

      const createCall = (prismaMock.user.create as jest.Mock).mock.calls[0][0] as any;
      expect(createCall.data).not.toHaveProperty('image');
      expect(createCall.data).not.toHaveProperty('bio');
      expect(createCall.data).not.toHaveProperty('demo');
    });
  });

  describe('login', () => {
    test('should return a token on successful login', async () => {
      const hashedPassword = await bcrypt.hash('1234', 10);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        id: 123, username: 'RealWorld', email: 'realworld@me',
        password: hashedPassword, bio: null, image: null, demo: false,
      });

      const result = await login({ email: 'realworld@me', password: '1234' });
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('email', 'realworld@me');
      expect(result).toHaveProperty('username', 'RealWorld');
    });

    test('should throw when email is blank', async () => {
      await expect(login({ email: ' ', password: '1234' })).rejects.toThrow();
    });

    test('should throw 422 with email error when email is blank', async () => {
      await expect(login({ email: ' ', password: '1234' })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { email: ["can't be blank"] } },
      });
    });

    test('should throw when password is blank', async () => {
      await expect(login({ email: 'realworld@me', password: ' ' })).rejects.toThrow();
    });

    test('should throw 422 with password error when password is blank', async () => {
      await expect(login({ email: 'realworld@me', password: ' ' })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { password: ["can't be blank"] } },
      });
    });

    test('should throw when email is undefined', async () => {
      await expect(login({ email: undefined, password: '1234' })).rejects.toThrow();
    });

    test('should throw 422 with email error when email is undefined', async () => {
      await expect(login({ email: undefined, password: '1234' })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { email: ["can't be blank"] } },
      });
    });

    test('should throw when password is undefined', async () => {
      await expect(login({ email: 'realworld@me', password: undefined })).rejects.toThrow();
    });

    test('should throw 422 with password error when password is undefined', async () => {
      await expect(login({ email: 'realworld@me', password: undefined })).rejects.toMatchObject({
        errorCode: 422,
        message: { errors: { password: ["can't be blank"] } },
      });
    });

    test('should throw when user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(login({ email: 'realworld@me', password: '1234' })).rejects.toThrow();
    });

    test('should throw with invalid credentials error when user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      await expect(login({ email: 'realworld@me', password: '1234' })).rejects.toMatchObject({
        message: { errors: { 'email or password': ['is invalid'] } },
      });
    });

    test('should throw with invalid credentials error when password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correct', 10);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        id: 123, username: 'RW', email: 'rw@me',
        password: hashedPassword, bio: null, image: null, demo: false,
      });
      await expect(login({ email: 'rw@me', password: 'wrong' })).rejects.toMatchObject({
        message: { errors: { 'email or password': ['is invalid'] } },
      });
    });

    test('should throw when password is wrong', async () => {
      const hashedPassword = await bcrypt.hash('correct', 10);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        id: 123, username: 'RW', email: 'rw@me',
        password: hashedPassword, bio: null, image: null, demo: false,
      });
      await expect(login({ email: 'rw@me', password: 'wrong' })).rejects.toThrow();
    });

    test('should call findUnique with trimmed email and correct select', async () => {
      const hashedPassword = await bcrypt.hash('1234', 10);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1, username: 'RW', email: 'rw@me',
        password: hashedPassword, bio: null, image: null, demo: false,
      });

      await login({ email: '  rw@me  ', password: '1234' });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'rw@me' },
        select: { id: true, email: true, username: true, password: true, bio: true, image: true },
      });
    });

    test('should return bio and image from user record', async () => {
      const hashedPassword = await bcrypt.hash('1234', 10);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1, username: 'RW', email: 'rw@me',
        password: hashedPassword, bio: 'My bio', image: 'img.png', demo: false,
      });

      const result = await login({ email: 'rw@me', password: '1234' });
      expect(result).toHaveProperty('bio', 'My bio');
      expect(result).toHaveProperty('image', 'img.png');
    });
  });

  describe('getCurrentUser', () => {
    test('should return a user with a token', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        id: 123, username: 'RealWorld', email: 'realworld@me',
        password: '1234', bio: null, image: null, demo: false,
      });

      await expect(getCurrentUser(123)).resolves.toHaveProperty('token');
    });

    test('should call findUnique with correct id and select', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        id: 123, username: 'RW', email: 'rw@me',
        password: 'x', bio: null, image: null, demo: false,
      });

      await getCurrentUser(123);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 123 },
        select: { id: true, email: true, username: true, bio: true, image: true },
      });
    });

    test('should include email and username in returned user', async () => {
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue({
        id: 123, username: 'RW', email: 'rw@me',
        password: 'x', bio: 'bio', image: 'img.png', demo: false,
      });

      const result = await getCurrentUser(123);
      expect(result).toHaveProperty('email', 'rw@me');
      expect(result).toHaveProperty('username', 'RW');
      expect(result).toHaveProperty('bio', 'bio');
      expect(result).toHaveProperty('image', 'img.png');
    });
  });

  describe('updateUser', () => {
    test('should return a token after update', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({
        id: 123, username: 'RW', email: 'rw@me',
        password: '1234', bio: null, image: null, demo: false,
      });

      await expect(updateUser({ username: 'RW', email: 'rw@me', password: '1234' }, 123)).resolves.toHaveProperty('token');
    });

    test('should call user.update with correct id and select', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 123, username: 'RW', email: 'rw@me', bio: null, image: null });

      await updateUser({ email: 'rw@me' }, 123);

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 123 },
          select: { id: true, email: true, username: true, bio: true, image: true },
        }),
      );
    });

    test('should include email in update data when email is provided', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 1, username: 'RW', email: 'new@me', bio: null, image: null });

      await updateUser({ email: 'new@me' }, 1);

      const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data.email).toBe('new@me');
    });

    test('should include username in update data when username is provided', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 1, username: 'NewName', email: 'rw@me', bio: null, image: null });

      await updateUser({ username: 'NewName' }, 1);

      const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data.username).toBe('NewName');
    });

    test('should include image in update data when image is provided', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: 'new.png' });

      await updateUser({ image: 'new.png' }, 1);

      const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data.image).toBe('new.png');
    });

    test('should include bio in update data when bio is provided', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: 'new bio', image: null });

      await updateUser({ bio: 'new bio' }, 1);

      const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data.bio).toBe('new bio');
    });

    test('should store a bcrypt hash (not plaintext) in update data when password is provided', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await updateUser({ password: 'newpass' }, 1);

      const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data.password).not.toBe('newpass');
      const isValidHash = await bcrypt.compare('newpass', updateCall.data.password);
      expect(isValidHash).toBe(true);
    });

    test('should include hashed password in update data when password is provided', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await updateUser({ password: 'newpass' }, 1);

      const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data.password).toBeDefined();
      expect(updateCall.data.password).not.toBe('newpass'); // must be hashed
    });

    test('should NOT include password in update data when no password in payload', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await updateUser({ username: 'RW', email: 'rw@me' }, 1);

      const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data).not.toHaveProperty('password');
    });

    test('should NOT include fields in data when they are falsy', async () => {
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue({ id: 1, username: 'RW', email: 'rw@me', bio: null, image: null });

      await updateUser({ bio: 'only bio' }, 1);

      const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0] as any;
      expect(updateCall.data).not.toHaveProperty('email');
      expect(updateCall.data).not.toHaveProperty('username');
      expect(updateCall.data).not.toHaveProperty('password');
      expect(updateCall.data).not.toHaveProperty('image');
    });
  });
});
