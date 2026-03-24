// @ts-nocheck
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
      // Given
      const mockedResponse = [{ name: 'dragons' }, { name: 'training' }, { name: 'react' }];

      // When
      // 
      prismaMock.tag.findMany.mockResolvedValue(mockedResponse);

      // Then
      const result = await getTags();
      expect(result).toEqual(['dragons', 'training', 'react']);
      expect(result).toHaveLength(3);
    });

    test('should return a list of tag names with id (includes user query)', async () => {
      // Given
      const mockedResponse = [{ name: 'dragons' }, { name: 'mytag' }];

      // When
      // 
      prismaMock.tag.findMany.mockResolvedValue(mockedResponse);

      // Then
      const result = await getTags(123);
      expect(result).toEqual(['dragons', 'mytag']);
      expect(result).toHaveLength(2);
    });

    test('should return an empty array if no tags exist', async () => {
      // When
      // 
      prismaMock.tag.findMany.mockResolvedValue([]);

      // Then
      const result = await getTags();
      expect(result).toEqual([]);
    });
  });
});
