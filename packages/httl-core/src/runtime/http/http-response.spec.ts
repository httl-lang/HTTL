import { HttpSize } from './http-response';

describe('HttpSize.sizeOf', () => {
  it('counts UTF-8 byte length of headers and data without Buffer', () => {
    const size = HttpSize.sizeOf({
      headers: ['Content-Type', 'application/json'],
      data: 'héllo', // 'é' is 2 bytes in UTF-8 => 6 bytes total
    });

    expect(size.data).toBe(6);
    expect(size.headers).toBe('Content-Type'.length + 'application/json'.length);
    expect(size.totalFormatted).toBe('34 bytes');
  });

  it('handles empty data', () => {
    const size = HttpSize.sizeOf({ headers: [], data: '' });
    expect(size.data).toBe(0);
    expect(size.headers).toBe(0);
  });
});
