import MockFirebase from 'mock-cloud-firestore';
import { createSandbox } from 'sinon';
import { decode } from 'base-64';

import { stubFirebase } from '@utils/tests';

import RawPhrasesDataSource from '../rawPhrases';

jest.mock(
  'firebase',
  () =>
    new MockFirebase(
      stubFirebase({
        [decode('cmVkZGl0')]: [],
      }),
    ),
);

const sandbox = createSandbox();

afterEach(sandbox.restore);

describe('load phrase', () => {
  const dataSource = new RawPhrasesDataSource();

  it('returns null if there are no phrases', async () => {
    const result = await dataSource.loadPhrase();

    expect(result).toBeNull();
  });
});
