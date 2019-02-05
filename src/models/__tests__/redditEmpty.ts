import MockFirebase from 'mock-cloud-firestore';
import { createSandbox } from 'sinon';

import { stubFirebase } from '@utils/tests';

import RedditDataSource from '../reddit';

jest.mock(
  'firebase',
  () =>
    new MockFirebase(
      stubFirebase({
        reddit: [],
      }),
    ),
);

const sandbox = createSandbox();

afterEach(sandbox.restore);

describe('load phrase', () => {
  const dataSource = new RedditDataSource();

  it('returns null if there are no phrases', async () => {
    const result = await dataSource.loadPhrase();

    expect(result).toBeNull();
  });
});
