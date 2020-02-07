import MockFirebase from 'mock-cloud-firestore';
import { createSandbox, SinonStub, assert } from 'sinon';
import knuthShuffle from 'knuth-shuffle';

import { stubFirebase } from '@utils/tests';

import PhrasesDataSource from '../phrases';
import IAP from '../iap';

const mockPhrases = {
  0: { id: '0', en: 'foo', cz: 'oof' },
  1: { id: '1', en: 'bar', cz: 'rab' },
  2: { id: '2', en: 'xpto', cz: 'otpx' },
};
jest.mock(
  'firebase',
  () =>
    new MockFirebase(
      stubFirebase({
        phrases: [
          { id: '0', en: 'foo', cz: 'oof' },
          { id: '1', en: 'bar', cz: 'rab' },
          { id: '2', en: 'xpto', cz: 'otpx' },
        ],
      }),
    ),
);

const sandbox = createSandbox();
afterEach(sandbox.restore);

beforeEach(() => {
  sandbox.stub(knuthShuffle, 'knuthShuffle').callsFake(a => a.reverse());
});

describe('load all phrases', () => {
  const dataSource = new PhrasesDataSource();

  it('returns phrases', async () => {
    const result = await dataSource.loadAllPhrases();

    expect(result).toEqual(mockPhrases);
  });
});

describe('get random phrase', () => {
  let dataSource: PhrasesDataSource;
  let ad: SinonStub;
  let usedPhrases: sinon.SinonStub;

  beforeEach(() => {
    dataSource = new PhrasesDataSource();
    ad = sandbox.stub(dataSource.adManager, 'showAd').resolves();
    usedPhrases = sandbox
      .stub(dataSource.persist, 'getUsedPhrases')
      .resolves(new Set(['0']));
  });

  it('returns a phrase', async () => {
    const result = await dataSource.getRandomPhrase('en');

    expect(result).toEqual({
      content: mockPhrases[2].en,
      id: mockPhrases[2].id,
    });
    expect(ad.called).toEqual(false);
  });

  it('does not use index greater than array lenght', async () => {
    usedPhrases.resolves(new Set());
    sandbox
      .stub(dataSource.persist, 'getVisitedPhrases')
      .resolves(new Set(Object.keys(mockPhrases)));
    sandbox.stub(dataSource, 'shuffledPhraseIds').value(Promise.resolve([]));

    const result = await dataSource.getRandomPhrase('en');

    expect(result).toEqual({
      content: mockPhrases[2].en,
      id: mockPhrases[2].id,
    });
    expect(ad.called).toEqual(false);
  });

  it('returns undefined when array is empty', async () => {
    sandbox.stub(dataSource, 'phrases').value([]);

    const result = await dataSource.getRandomPhrase('en');

    expect(result).toBeUndefined();
    expect(ad.called).toEqual(false);
  });

  it('fails if loading fails', async () => {
    const reason = 'foobar';
    sandbox.stub(dataSource, 'phrases').value(Promise.reject(reason));

    try {
      await dataSource.getRandomPhrase('en');

      fail();
    } catch (e) {
      expect(e).toEqual(reason);
      expect(ad.called).toEqual(false);
    }
  });

  it('processes a phrase', async () => {
    sandbox.stub(Math, 'random').returns(0);
    const process = sandbox.stub(dataSource, 'processPhrase').callsFake(f => f);

    await dataSource.getRandomPhrase('en');

    expect(process.called).toEqual(true);
  });

  it('persists used phrases', async () => {
    const usePhrase = sandbox.stub(dataSource.persist, 'usePhrase');

    const phrase = await dataSource.getRandomPhrase('en');

    assert.calledWith(usePhrase, phrase!.id);
  });

  it('returns a phrase with the expected locale', async () => {
    const phrase = mockPhrases[0];
    sandbox.stub(dataSource as any, 'getNextPhrase').resolves(phrase as any);
    const result = await dataSource.getRandomPhrase('cz');

    expect(result).toEqual({
      content: phrase.cz,
      id: phrase.id,
    });
  });

  it('fallsback to english if locale is not found', async () => {
    const result = await dataSource.getRandomPhrase('foobar');

    expect(result).toEqual({
      content: mockPhrases[2].en,
      id: mockPhrases[2].id,
    });
  });
});

describe('review phrases', () => {
  let add: sinon.SinonStub;
  const doc = { id: 'foobar' };
  const dataSource = new PhrasesDataSource();
  const date = new Date();

  beforeEach(() => {
    const col = dataSource.firestore.collection('reviews');
    sandbox.useFakeTimers(date.getTime());
    add = sandbox.stub().callsFake(col.add.bind(col));
    sandbox.stub(dataSource.firestore, 'collection').returns({
      add,
      doc: () => doc,
    } as any);
  });

  it('adds a positive review', async () => {
    const result = await dataSource.reviewPhrase(doc.id, true);

    expect(result).not.toBeNull();
    assert.calledWith(add, {
      date,
      phrase: doc,
      positive: true,
    });
  });

  it('adds a negative review', async () => {
    const result = await dataSource.reviewPhrase(doc.id, false);

    expect(result).not.toBeNull();
    assert.calledWith(add, {
      date,
      phrase: doc,
      positive: false,
    });
  });
});

describe('phrase repetition', () => {
  const dataSource = new PhrasesDataSource();

  it('does not repeat a phrase', async () => {
    sandbox.stub(dataSource, 'phrases').value(mockPhrases);
    const yieldedPhrasesIds: string[] = [];

    for (const _ of Object.keys(mockPhrases)) {
      const phrase = await dataSource.getRandomPhrase('en');

      expect(yieldedPhrasesIds).not.toContain(phrase!.id);
      yieldedPhrasesIds.push(phrase!.id);
    }
  });

  it('repeats when options have been exhausted', async () => {
    sandbox.stub(dataSource, 'phrases').value(mockPhrases);
    const yieldedPhrasesIds: string[] = [];

    for (const _ of Object.keys(mockPhrases)) {
      const p = await dataSource.getRandomPhrase('en');
      yieldedPhrasesIds.push(p!.id);
    }

    const phrase = await dataSource.getRandomPhrase('en');
    expect(yieldedPhrasesIds).toContain(phrase!.id);
  });
});

describe('suggestions', () => {
  let add: sinon.SinonStub;
  const model = new PhrasesDataSource();
  const date = new Date();

  beforeEach(() => {
    const col = model.firestore.collection('suggestion');
    sandbox.useFakeTimers(date.getTime());
    add = sandbox.stub().callsFake(col.add.bind(col));
    sandbox.stub(model.firestore, 'collection').returns({
      add,
    } as any);
  });

  it('sends a suggestion', async () => {
    const content = 'foobar';

    expect(async () => {
      await model.sendSuggestion(content);
    }).not.toThrow();
    assert.calledWithExactly(add, {
      content,
      date,
      discarded: false,
    });
  });
});

describe('ads', () => {
  let dataSource: PhrasesDataSource;
  let ad: SinonStub;

  beforeEach(() => {
    dataSource = new PhrasesDataSource();
    ad = sandbox.stub(dataSource.adManager, 'showAd').resolves();
  });

  /**
   * TODO
   * Interstitial ads have been temporarily removed while IAP is not working
   */
  it.skip('shows ad after 3 phrases', async () => {
    sandbox.stub(Math, 'random').returns(0);
    (__DEV__ as any) = false;

    for (let i = 0; i < 3; i++) {
      await dataSource.getRandomPhrase('en');
    }

    expect(ad.called).toEqual(true);
  });

  it('does not show ads if is adfree', async () => {
    sandbox.stub(IAP, 'isAdFree').value(Promise.resolve(true));
    (__DEV__ as any) = false;

    for (let i = 0; i < 3; i++) {
      await dataSource.getRandomPhrase('en');
    }

    expect(ad.called).toEqual(false);
  });
});

describe('process phrases', () => {
  let dataSource: PhrasesDataSource;

  beforeEach(() => {
    dataSource = new PhrasesDataSource();
  });

  it('unescapes new lines', () => {
    const data = {
      en: 'foo\\nbar',
    };

    const result = dataSource.processPhrase(data);

    expect(result).toEqual({
      en: 'foo\nbar',
    });
  });

  it('keeps non-locale entries', () => {
    const data = {
      foo: 'bar\\n',
    };

    const result = dataSource.processPhrase(data);

    expect(result).toEqual(data);
  });
});

describe('shuffle phrases', () => {
  let dataSource: PhrasesDataSource;
  let visitedPhrases: sinon.SinonStub;
  let usedPhrases: sinon.SinonStub;

  beforeEach(() => {
    dataSource = new PhrasesDataSource();
    visitedPhrases = sandbox
      .stub(dataSource.persist, 'getVisitedPhrases')
      .resolves(new Set());
    usedPhrases = sandbox
      .stub(dataSource.persist, 'getUsedPhrases')
      .resolves(new Set());
  });

  it('returns null if phrases is empty', async () => {
    sandbox.stub(dataSource, 'phrases').value(Promise.resolve([]));

    const result = await dataSource.shufflePhraseIds();

    expect(result).toEqual([]);
  });

  it('shuffles unseen phrases at the top of the array', async () => {
    visitedPhrases.resolves(new Set(['0']));

    const result = await dataSource.shufflePhraseIds();

    expect(result!.slice(0, 2)).toEqual(
      Object.keys(mockPhrases)
        .reverse()
        .slice(0, 2),
    );
  });

  it('shuffles visited phrases at the bottom of the array', async () => {
    visitedPhrases.resolves(new Set(['0', '1']));

    const result = await dataSource.shufflePhraseIds();

    expect(result.slice(1, 3)).toEqual(
      Object.keys(mockPhrases)
        .reverse()
        .slice(1, 3),
    );
  });

  it('removes used phrases from the end result', async () => {
    usedPhrases.resolves(new Set(['0']));

    const result = await dataSource.shufflePhraseIds();

    expect(result).toEqual(
      Object.keys(mockPhrases)
        .filter(id => id !== '0')
        .reverse(),
    );
  });

  it('allows all phrases if used is full', async () => {
    usedPhrases.resolves(new Set(Object.keys(mockPhrases)));

    const result = await dataSource.shufflePhraseIds();

    expect(result).toEqual(Object.keys(mockPhrases).reverse());
  });
});
