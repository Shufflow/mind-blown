import MockFirebase from 'mock-cloud-firestore';
import { createSandbox } from 'sinon';

import { stubFirebase } from 'src/utils/tests';

import PhrasesDataSource from '../phrases';

const mockPhrases = {
  0: { id: '0', en: 'foo' },
  1: { id: '1', en: 'bar' },
  2: { id: '2', en: 'xpto' },
};
jest.mock(
  'firebase',
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

    const result = await dataSource.getRandomPhrase();

    expect(result).toEqual(mockPhrases[0]);
  });

  it('does not use index greater than array lenght', async () => {
    sandbox.stub(Math, 'random').returns(1);

    const result = await dataSource.getRandomPhrase();

    expect(result).toEqual(mockPhrases[2]);
  });

  it('returns null when array is empty', async () => {
    sandbox.stub(dataSource, 'phrases').value([]);

    const result = await dataSource.getRandomPhrase();

    expect(result).toBeNull();
  });

  it('fails if loading fails', async () => {
    const reason = 'foobar';
    sandbox.stub(dataSource, 'phrases').value(Promise.reject(reason));

    try {
      await dataSource.getRandomPhrase();

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

describe('phrase repetition', () => {
  const dataSource = new PhrasesDataSource();

  it('does not repeat a phrase', async () => {
    sandbox.stub(dataSource, 'phrases').value(mockPhrases);
    const yieldedPhrasesIds: string[] = [];

    for (const _ of Object.keys(mockPhrases)) {
      const phrase = await dataSource.getRandomPhrase();

      expect(yieldedPhrasesIds).not.toContain(phrase!.id);
      yieldedPhrasesIds.push(phrase!.id);
    }
  });

  it('repeats when options have been exhausted', async () => {
    sandbox.stub(dataSource, 'phrases').value(mockPhrases);
    const yieldedPhrasesIds: string[] = [];

    for (const _ of Object.keys(mockPhrases)) {
      const p = await dataSource.getRandomPhrase();
      yieldedPhrasesIds.push(p!.id);
    }

    const phrase = await dataSource.getRandomPhrase();
    expect(yieldedPhrasesIds).toContain(phrase!.id);
  });
});

describe('suggestions', () => {
  const dataSource = new PhrasesDataSource();

  it('sends a suggestion', async () => {
    const content = 'foobar';

    expect(async () => {
      await dataSource.sendSuggestion(content);
    }).not.toThrow();
  });
});
