import MockFirebase from 'mock-cloud-firestore';
import { assert, createSandbox } from 'sinon';

import { stubFirebase } from 'src/utils/tests';

import RedditDataSource from '../reddit';

const mockPhrases = {
  0: { score: 0, content: 'foo' },
  1: { score: 1, content: 'bar' },
  2: { score: 2, content: 'xpto' },
};
jest.mock(
  'react-native-firebase',
  () =>
    new MockFirebase(
      stubFirebase({
        reddit: [
          { score: 0, content: 'foo' },
          { score: 1, content: 'bar' },
          { score: 2, content: 'xpto' },
        ],
      }),
    ),
);

const sandbox = createSandbox();

afterEach(sandbox.restore);

// TODO: orderBy is not working on mock-cloud-firebase
// describe('load phrase', () => {
//   const dataSource = new RedditDataSource();

//   it('loads the phrase with highest score', async () => {
//     const result = await dataSource.loadPhrase();

//     expect(result).toEqual(mockPhrases[2]);
//   });
// });

describe('save phrase', () => {
  const dataSource = new RedditDataSource();
  const transl = { 'pt-BR': 'xpto' };
  const id = '0';

  it('saves a phrase into the "phrases" collection', async () => {
    const phrases = sandbox.stub(dataSource.phrases, 'add');

    await dataSource.savePhrase(id, transl);

    assert.calledWith(phrases, { ...transl, en: mockPhrases[id].content });
  });

  it('deletes a phrase from the "reddit" collection after saving', async () => {
    let called = false;
    const doc = sandbox.stub(dataSource.reddit, 'doc').returns({
      delete: () => {
        called = true;
      },
      get: () => ({ data: () => ({ content: 'foobar' }) }),
    } as any);

    await dataSource.savePhrase(id, transl);

    assert.called(doc);
    expect(called).toEqual(true);
  });
});

describe('discard phrase', () => {
  const dataSource = new RedditDataSource();

  it('deletes the phrase from the "reddit" collection', async () => {
    let called = false;
    const id = '1';
    const doc = sandbox.stub(dataSource.reddit, 'doc').returns({
      delete: () => {
        called = true;
      },
      get: () => ({ data: () => ({ content: 'foobar' }) }),
    } as any);

    await dataSource.discardPhrase(id);

    assert.called(doc);
    expect(called).toEqual(true);
  });
});
