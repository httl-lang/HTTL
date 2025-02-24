import { HttlUrl, HttlUrlParams } from './url';
import test_data from './url.spec.data.json';

describe('HttlUrl', () => {

  Object.entries(test_data).forEach(([group, tests]) => {
    describe(group, () => {
      tests.forEach(([url, expected]: [string, any]) => {
        it(`should parse ${url}`, () => {
          // Act
          const result = HttlUrl.parse(url);

          // Assert
          expect(result.protocol).toBe(expected.protocol);
          expect(result.hostname).toBe(expected.hostname);
          expect(result.port).toBe(expected.port);
          expect(result.path).toBe(expected.path);
        });
      });
    });
  });
});
