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
    test('should create new user ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
      };

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      // @ts-ignore - mock findUnique to return null so uniqueness check passes
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue(mockedResponse);

      // Then
      await expect(createUser(user)).resolves.toHaveProperty('token');
    });

    test('should throw an error when creating new user with empty username ', async () => {
      // Given
      const user = {
        id: 123,
        username: ' ',
        email: 'realworld@me',
        password: '1234',
      };

      // Then
      const error = String({ errors: { username: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an error when creating new user with empty email ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: '  ',
        password: '1234',
      };

      // Then
      const error = String({ errors: { email: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an error when creating new user with empty password ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: ' ',
      };

      // Then
      const error = String({ errors: { password: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an exception when creating a new user with already existing user on same username ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
      };

      const mockedExistingUser = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedExistingUser);

      // Then
      const error = { email: ['has already been taken'] }.toString();
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw error with email field only when only email is taken', async () => {
      // Given
      const user = {
        username: 'NewUser',
        email: 'taken@me',
        password: '1234',
      };

      const mockedExistingUserByEmail = {
        id: 1,
        username: 'OtherUser',
        email: 'taken@me',
        password: 'hashed',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When: first findUnique (by email) returns user, second (by username) returns null
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValueOnce(mockedExistingUserByEmail);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      // Then
      await expect(createUser(user)).rejects.toMatchObject({
        message: expect.objectContaining({
          errors: expect.objectContaining({ email: ['has already been taken'] }),
        }),
      });
    });

    test('should throw error with username field only when only username is taken', async () => {
      // Given
      const user = {
        username: 'TakenUser',
        email: 'new@me',
        password: '1234',
      };

      const mockedExistingUserByUsername = {
        id: 2,
        username: 'TakenUser',
        email: 'other@me',
        password: 'hashed',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When: first findUnique (by email) returns null, second (by username) returns user
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValueOnce(mockedExistingUserByUsername);

      // Then
      await expect(createUser(user)).rejects.toMatchObject({
        message: expect.objectContaining({
          errors: expect.objectContaining({ username: ['has already been taken'] }),
        }),
      });
    });

    test('should create user successfully when image and bio are provided', async () => {
      // Given
      const user = {
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        image: 'http://example.com/image.png',
        bio: 'My happy life',
      };

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        bio: 'My happy life',
        image: 'http://example.com/image.png',
      };

      // When
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue(mockedResponse);

      // Then
      const result = await createUser(user);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('bio', 'My happy life');
      expect(result).toHaveProperty('image', 'http://example.com/image.png');
    });

    test('should create user with demo flag', async () => {
      // Given - covers the `demo ? { demo } : {}` truthy branch
      const user = {
        username: 'DemoUser',
        email: 'demo@me',
        password: '1234',
        demo: true,
      };

      const mockedResponse = {
        id: 456,
        username: 'DemoUser',
        email: 'demo@me',
        bio: null,
        image: null,
      };

      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(null);
      // @ts-ignore
      prismaMock.user.create.mockResolvedValue(mockedResponse);

      const result = await createUser(user);
      expect(result).toHaveProperty('token');
    });

    test('should throw when email is undefined (null branch of ?. operator)', async () => {
      // Covers `input.email?.trim()` null branch
      await expect(
        createUser({ username: 'RealWorld', email: undefined as any, password: '1234' }),
      ).rejects.toThrow();
    });

    test('should throw when username is undefined (null branch of ?. operator)', async () => {
      // Covers `input.username?.trim()` null branch
      await expect(
        createUser({ username: undefined as any, email: 'realworld@me', password: '1234' }),
      ).rejects.toThrow();
    });

    test('should throw when password is undefined (null branch of ?. operator)', async () => {
      // Covers `input.password?.trim()` null branch
      await expect(
        createUser({ username: 'RealWorld', email: 'realworld@me', password: undefined as any }),
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    test('should return a token', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: '1234',
      };

      const hashedPassword = await bcrypt.hash(user.password, 10);

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: hashedPassword,
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      // Then
      await expect(login(user)).resolves.toHaveProperty('token');
    });

    test('should throw an error when the email is empty', async () => {
      // Given
      const user = {
        email: ' ',
        password: '1234',
      };

      // Then
      const error = String({ errors: { email: ["can't be blank"] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw an error when the password is empty', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: ' ',
      };

      // Then
      const error = String({ errors: { password: ["can't be blank"] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw an error when no user is found', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: '1234',
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw when login email is undefined (null branch of ?. operator)', async () => {
      // Covers `userPayload.email?.trim()` null branch
      await expect(login({ email: undefined, password: '1234' })).rejects.toThrow();
    });

    test('should throw when login password is undefined (null branch of ?. operator)', async () => {
      // Covers `userPayload.password?.trim()` null branch
      await expect(login({ email: 'realworld@me', password: undefined })).rejects.toThrow();
    });

    test('should throw an error if the password is wrong', async () => {
      // Given
      const user = {
        email: 'realworld@me',
        password: '1234',
      };

      const hashedPassword = await bcrypt.hash('4321', 10);

      const mockedResponse = {
        id: 123,
        username: 'Gerome',
        email: 'realworld@me',
        password: hashedPassword,
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(login(user)).rejects.toThrow(error);
    });
  });

  describe('getCurrentUser', () => {
    test('should return a token', async () => {
      // Given
      const id = 123;

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      // Then
      await expect(getCurrentUser(id)).resolves.toHaveProperty('token');
    });
  });

  describe('updateUser', () => {
    test('should return a token', async () => {
      // Given
      const user = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
      };

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      // When
      prismaMock.user.update.mockResolvedValue(mockedResponse);

      // Then
      await expect(updateUser(user, user.id)).resolves.toHaveProperty('token');
    });

    test('should update user with image and bio (truthy branches)', async () => {
      // Given - covers `image ? { image } : {}` and `bio ? { bio } : {}` truthy branches
      const userPayload = {
        image: 'http://example.com/avatar.png',
        bio: 'Updated bio',
      };

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        bio: 'Updated bio',
        image: 'http://example.com/avatar.png',
      };

      // @ts-ignore
      prismaMock.user.update.mockResolvedValue(mockedResponse);

      const result = await updateUser(userPayload, 123);
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('bio', 'Updated bio');
      expect(result).toHaveProperty('image', 'http://example.com/avatar.png');
    });

    test('should update user without email or username (falsy spread branches)', async () => {
      // Given - covers `email ? { email } : {}` and `username ? { username } : {}` falsy branches
      const userPayload = {
        bio: 'Updated bio only',
      };

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        bio: 'Updated bio only',
        image: null,
      };

      // @ts-ignore
      prismaMock.user.update.mockResolvedValue(mockedResponse);

      const result = await updateUser(userPayload, 123);
      expect(result).toHaveProperty('token');
    });

    test('should not hash password when password is not provided in payload', async () => {
      // Given - payload without password
      const userPayload = {
        username: 'RealWorld',
        email: 'realworld@me',
      };

      const mockedResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        bio: null,
        image: null,
      };

      // When
      // @ts-ignore
      prismaMock.user.update.mockResolvedValue(mockedResponse);

      const bcryptSpy = jest.spyOn(require('bcryptjs'), 'hash');

      // Then
      await expect(updateUser(userPayload, 123)).resolves.toHaveProperty('token');
      expect(bcryptSpy).not.toHaveBeenCalled();

      bcryptSpy.mockRestore();
    });
  });
});
