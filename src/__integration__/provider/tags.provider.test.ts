/**
 * Pact Provider Verification — realworld-backend
 *
 * This test verifies that the backend fulfills every interaction defined
 * in the pact file generated (or manually authored) by the frontend consumer.
 *
 * Flow:
 *  1. Jest starts the Express app on a random free port.
 *  2. The Pact Verifier reads `pacts/frontend-backend.json`.
 *  3. For each interaction it:
 *     a. Calls the matching stateHandler to configure the Prisma mock.
 *     b. Makes the real HTTP request to the running Express server.
 *     c. Asserts that the response matches the contract.
 */

import { Verifier } from '@pact-foundation/pact';
import { Server } from 'http';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

// ── Mock Prisma before importing anything that uses it ──────────────────────
jest.mock('../../prisma/prisma-client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

import prisma from '../../prisma/prisma-client';
import app from '../../app';

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// ── Server lifecycle ─────────────────────────────────────────────────────────

let server: Server;
let port: number;

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => resolve()); // port 0 → OS picks a free port
  });
  port = (server.address() as { port: number }).port;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

beforeEach(() => {
  mockReset(prismaMock);
});

// ── Provider verification ────────────────────────────────────────────────────

describe('Pact Provider Verification – realworld-backend', () => {
  it('fulfills all contracts defined by realworld-frontend', async () => {
    await new Verifier({
      provider: 'realworld-backend',
      providerBaseUrl: `http://localhost:${port}`,

      // Path to the pact file produced (or authored) by the consumer
      pactUrls: [
        path.join(__dirname, '../pacts/frontend-backend.json'),
      ],

      // ── State handlers ─────────────────────────────────────────────────
      // Each key matches the "providerState" field in the pact interaction.
      // The handler runs in-process before the verifier makes its request,
      // so any mock setup here is immediately visible to the Express handlers.
      stateHandlers: {

        // GET /api/tags — happy path
        'tags exist': async () => {
          // @ts-ignore
          prismaMock.tag.findMany.mockResolvedValue([
            { id: 1, name: 'javascript' },
            { id: 2, name: 'react' },
          ]);
        },

        // GET /api/tags — empty list
        'no tags exist': async () => {
          // @ts-ignore
          prismaMock.tag.findMany.mockResolvedValue([]);
        },

        // POST /api/users — register a brand-new user
        'user does not exist': async () => {
          // checkUserUniqueness makes two findUnique calls (email, username)
          // @ts-ignore
          prismaMock.user.findUnique.mockResolvedValue(null);
          // @ts-ignore
          prismaMock.user.create.mockResolvedValue({
            id: 1,
            email: 'jacinda@example.com',
            username: 'jacinda',
            bio: null,
            image: null,
          });
        },

        // POST /api/users/login — valid credentials
        'user jacinda exists': async () => {
          const hashedPassword = await bcrypt.hash('password123', 1);
          // @ts-ignore
          prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            email: 'jacinda@example.com',
            username: 'jacinda',
            password: hashedPassword,
            bio: null,
            image: null,
          });
        },

        // POST /api/users/login — wrong password → 403
        'user exists with different password': async () => {
          const hashedPassword = await bcrypt.hash('the-real-secret', 1);
          // @ts-ignore
          prismaMock.user.findUnique.mockResolvedValue({
            id: 1,
            email: 'jacinda@example.com',
            username: 'jacinda',
            password: hashedPassword,
            bio: null,
            image: null,
          });
        },
      },

      logLevel: 'warn',
    }).verifyProvider();
  });
});
