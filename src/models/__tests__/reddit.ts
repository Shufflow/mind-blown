import MockFirebase from 'mock-cloud-firestore';
import { assert, createSandbox } from 'sinon';

import { stubFirebase } from 'src/utils/tests';

import RedditDataSource from '../reddit';

const mockPhrases = {
  _0: { score: 0, content: 'foo', id: '_0' },
  _1: { score: 1, content: 'bar', id: '_1' },
  _2: { score: 2, content: 'xpto', id: '_2' },
};
jest.mock(
  'firebase',
  () =>
    new MockFirebase(
      stubFirebase({
        reddit: [
          { score: 0, content: 'foo', id: '_0' },
          { score: 1, content: 'bar', id: '_1' },
          { score: 2, content: 'xpto', id: '_2' },
        ],
      }),
    ),
);

const sandbox = createSandbox();
afterEach(sandbox.restore);

describe('load phrase', () => {
  const dataSource = new RedditDataSource();

  it('loads the phrase with highest score', async () => {
    const result = await dataSource.loadPhrase();

    expect(result).toEqual(mockPhrases._2);
  });
});

describe('save phrase', () => {
  const dataSource = new RedditDataSource();
  const transl = { 'pt-BR': 'xpto' };
  const id = '_0';

  it('saves a phrase into the "phrases" collection', async () => {
    const date = new Date();
    sandbox.useFakeTimers(date);
    const phrase = sandbox.stub().resolves();
    const doc = sandbox.stub(dataSource.phrases, 'doc').returns({
      set: phrase,
    } as any);

    await dataSource.savePhrase(id, transl);

    assert.calledWith(doc, id);
    assert.calledWith(phrase, {
      date,
      en: mockPhrases[id].content,
      ...transl,
    });
  });

  it('deletes a phrase from the "reddit" collection after saving', async () => {
    const del = sandbox.stub().resolves();
    const doc = sandbox.stub(dataSource.reddit, 'doc').returns({
      delete: del,
      get: () => ({ data: () => ({ content: 'foobar' }) }),
    } as any);

    await dataSource.savePhrase(id, transl);

    assert.called(doc);
    expect(del.called).toEqual(true);
  });
});

describe('discard phrase', () => {
  const dataSource = new RedditDataSource();

  it('deletes the phrase from the "reddit" collection', async () => {
    const id = '1';
    const del = sandbox.stub().resolves();
    const doc = sandbox.stub(dataSource.reddit, 'doc').returns({
      delete: del,
      get: () => ({ data: () => ({ content: 'foobar' }) }),
    } as any);

    await dataSource.discardPhrase(id);

    assert.called(doc);
    expect(del.called).toEqual(true);
  });
});
