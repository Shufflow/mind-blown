import MockFirebase from 'mock-cloud-firestore';
import { assert, createSandbox } from 'sinon';
import { decode } from 'base-64';
import firebase from 'firebase';

import { stubFirebase } from '@utils/tests';

import RawPhrasesDataSource from '../rawPhrases';
import { mockPhrases, mockPhraseWithDate } from '../__mocks__/rawPhrases';

const sandbox = createSandbox();
let model: RawPhrasesDataSource;
let firestore: sinon.SinonStub;

const mockFirebase = (data?: any) => {
  const fb = new MockFirebase(
    stubFirebase({
      [decode('cmVkZGl0')]: Object.values(data || mockPhrases),
    }),
  );

  firestore.returns(fb.firestore());
  model = new RawPhrasesDataSource();
};

beforeEach(() => {
  firestore = sandbox.stub(firebase, 'firestore');
  mockFirebase();
});
afterEach(sandbox.restore);

describe('load phrase', () => {
  it('loads the phrase with highest score', async () => {
    const { discarded, ...expectedResult } = mockPhrases.xpto;
    const result = await model.loadPhrase();

    expect(result).toEqual(expectedResult);
    expect(result!.id).not.toEqual(mockPhrases.yolo.id);
  });

  it('loads a phrase with no date', async () => {
    const result = await model.loadPhrase();

    expect(result!.dateAdded).toBeUndefined();
  });

  it('loads a phrase with date', async () => {
    mockFirebase(mockPhraseWithDate);

    const result = await model.loadPhrase();

    expect(result!.dateAdded).toEqual(new Date(2019, 6, 28));
  });
});

describe('save phrase', () => {
  const transl = { 'pt-BR': 'xpto' };
  const id = 'bar';

  it('saves a phrase into the "phrases" collection', async () => {
    const date = new Date();
    sandbox.useFakeTimers(date);
    const phrase = sandbox.stub().resolves();
    const doc = sandbox.stub(model.phrases, 'doc').returns({
      set: phrase,
    } as any);

    await model.savePhrase(id, transl);

    assert.calledWith(doc, id);
    assert.calledWith(phrase, {
      ...transl,
      date,
      en: mockPhrases[id].content,
      usedAsPOtD: false,
    });
  });

  it('deletes a phrase from the collection after saving', async () => {
    const del = sandbox.stub().resolves();
    const doc = sandbox.stub(model.rawPhrases, 'doc').returns({
      delete: del,
      get: () => ({ data: () => ({ content: 'foobar' }) }),
    } as any);

    await model.savePhrase(id, transl);

    assert.called(doc);
    expect(del.called).toEqual(true);
  });
});

describe('discard phrase', () => {
  const date = new Date();

  it('marks the phrase as discarded', async () => {
    const id = 'bar';
    sandbox.useFakeTimers(date.getTime());
    const update = sandbox.stub().resolves();
    const doc = sandbox.stub(model.rawPhrases, 'doc').returns({
      update,
    } as any);

    await model.discardPhrase(id);

    assert.called(doc);
    assert.calledWithExactly(update, {
      date,
      discarded: true,
    });
  });
});
