// @ts-nocheck
import * as jwt from 'jsonwebtoken';
import generateToken from '../../app/routes/auth/token.utils';

describe('generateToken', () => {
  test('should return a JWT string using default secret when JWT_SECRET is not set', () => {
    // Ensure JWT_SECRET is not set
    delete process.env.JWT_SECRET;

    const token = generateToken(1);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);

    // Verify the token was signed with 'superSecret'
    const decoded = jwt.verify(token, 'superSecret') as any;
    expect(decoded.user.id).toBe(1);
  });

  test('should return a JWT string using JWT_SECRET env var when it is set', () => {
    process.env.JWT_SECRET = 'myTestSecret';

    const token = generateToken(99);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);

    // Verify the token was signed with 'myTestSecret'
    const decoded = jwt.verify(token, 'myTestSecret') as any;
    expect(decoded.user.id).toBe(99);

    // Cleanup
    delete process.env.JWT_SECRET;
  });
});
