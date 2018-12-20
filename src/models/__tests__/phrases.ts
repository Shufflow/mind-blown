import MockFirebase from 'mock-cloud-firestore';
import { createSandbox } from 'sinon';

import { stubFirebase } from 'src/utils/tests';

import PhrasesDataSource from '../phrases';

const mockPhrases = [
  { id: '0', en: 'foo' },
  { id: '1', en: 'bar' },
  { id: '2', en: 'xpto' },
];
jest.mock(
  'react-native-firebase',
  () =>
    new MockFirebase(
      stubFirebase({
        phrases: [
          { id: '0', en: 'foo' },
          { id: '1', en: 'bar' },
          { id: '2', en: 'xpto' },
        ],
      }),
    ),
);

const sandbox = createSandbox();

afterEach(sandbox.restore);

describe('load all phrases', () => {
  const dataSource = new PhrasesDataSource();

  it('returns phrases', async () => {
    const result = await dataSource.loadAllPhrases();

    expect(result).toEqual(mockPhrases);
  });
});

describe('get random phrase', () => {
  const dataSource = new PhrasesDataSource();

  it('returns a phrase', async () => {
    sandbox.stub(Math, 'random').returns(0);

    const result = await dataSource.getRandomPhrase('en');

    expect(result).toEqual({
      content: mockPhrases[0].en,
      id: mockPhrases[0].id,
    });
  });

  it('fallsback to en for unknown locales', async () => {
    sandbox.stub(Math, 'random').returns(0);

    const result = await dataSource.getRandomPhrase('foo');

    expect(result).toEqual({
      content: mockPhrases[0].en,
      id: mockPhrases[0].id,
    });
  });

  it('does not use index greater than array lenght', async () => {
    sandbox.stub(Math, 'random').returns(1);

    const result = await dataSource.getRandomPhrase('en');

    expect(result).toEqual({
      content: mockPhrases[2].en,
      id: mockPhrases[2].id,
    });
  });

  it('returns null when array is empty', async () => {
    sandbox.stub(dataSource, 'phrases').value([]);

    const result = await dataSource.getRandomPhrase('en');

    expect(result).toBeNull();
  });

  it('fails if loading fails', async () => {
    const reason = 'foobar';
    sandbox.stub(dataSource, 'phrases').value(Promise.reject(reason));

    try {
      await dataSource.getRandomPhrase('en');

      fail();
    } catch (e) {
      expect(e).toEqual(reason);
    }
  });
});

describe('review phrases', () => {
  const dataSource = new PhrasesDataSource();

  it('adds a positive review', async () => {
    const result = await dataSource.reviewPhrase('foobar', true);
    expect(result).not.toBeNull();
  });

  it('adds a negative review', async () => {
    const result = await dataSource.reviewPhrase('foobar', false);
    expect(result).not.toBeNull();
  });
});
