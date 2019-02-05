import MockFirebase from 'mock-cloud-firestore';
import { assert, createSandbox } from 'sinon';

import { stubFirebase } from '@utils/tests';

import RedditDataSource from '../reddit';

const mockPhrases: { [key: string]: any } = {
  bar: { score: 1, content: 'bar', id: 'bar', discarded: false },
  foo: { score: 0, content: 'foo', id: 'foo', discarded: false },
  xpto: { score: 2, content: 'xpto', id: 'xpto', discarded: false },
  yolo: { score: 3, content: 'yolo', id: 'yolo', discarded: true },
};
jest.mock(
  'firebase',
  () =>
    new MockFirebase(
      stubFirebase({
        reddit: [
          { score: 0, content: 'foo', id: 'foo', discarded: false },
          { score: 1, content: 'bar', id: 'bar', discarded: false },
          { score: 2, content: 'xpto', id: 'xpto', discarded: false },
          { score: 3, content: 'yolo', id: 'yolo', discarded: true },
        ],
      }),
    ),
);

const sandbox = createSandbox();
afterEach(sandbox.restore);

// TODO: where doesn't seem to be working on tests
// describe('load phrase', () => {
//   const dataSource = new RedditDataSource();

//   it.only('loads the phrase with highest score', async () => {
//     const result = dataSource.loadPhrase();

//     expect(result).toEqual(mockPhrases.xpto);
//     expect(result).not.toEqual(mockPhrases.yolo);
//   });
// });

describe('save phrase', () => {
  const dataSource = new RedditDataSource();
  const transl = { 'pt-BR': 'xpto' };
  const id = 'bar';

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

  it('marks the phrase as discarded', async () => {
    const id = 'bar';
    const update = sandbox.stub().resolves();
    const doc = sandbox.stub(dataSource.reddit, 'doc').returns({
      update,
      get: () => ({ data: () => ({ content: 'foobar' }) }),
    } as any);

    await dataSource.discardPhrase(id);

    assert.called(doc);
    expect(update.calledWith({ discarded: true })).toEqual(true);
  });
});
