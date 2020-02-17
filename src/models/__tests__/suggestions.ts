import { createSandbox, assert } from 'sinon';
import MockFirebase from 'mock-cloud-firestore';

import { stubFirebase } from '@utils/tests';

import {
  getSuggestion,
  discardSuggestion,
  saveSuggestion,
} from '../suggestions';

const mockPhrases = {
  a: {
    content: 'foo',
    date: new Date('2020-02-03'),
    discarded: false,
    id: 'a',
  },
  b: {
    content: 'bar',
    date: new Date('2020-02-02'),
    discarded: false,
    id: 'b',
  },
  c: {
    content: 'xpto',
    date: new Date('2020-02-01'),
    discarded: true,
    id: 'c',
  },
};
jest.mock('firebase', () => {
  (String.prototype as any).toDate = function() {
    // tslint:disable-next-line: no-invalid-this
    return new Date(this);
  };

  return new MockFirebase(
    stubFirebase({
      suggestion: [
        {
          content: 'foo',
          date: '2020-02-03',
          discarded: false,
          id: 'a',
        },
        {
          content: 'bar',
          date: '2020-02-02',
          discarded: false,
          id: 'b',
        },
        {
          content: 'xpto',
          date: '2020-02-01',
          discarded: true,
          id: 'c',
        },
      ],
    }),
  );
});

const sandbox = createSandbox();
let col: sinon.SinonStub;
let doc: sinon.SinonStub;
let update: sinon.SinonStub;
let firebase: sinon.SinonStub;
afterEach(sandbox.restore);

beforeEach(() => {
  update = sandbox.stub().resolves();
  doc = sandbox.stub().returns({ update });
  col = sandbox.stub().returns({ doc });

  firebase = sandbox
    // tslint:disable-next-line: no-require-imports
    .stub(require('firebase'), 'firestore')
    .returns({ collection: col } as any);
});

describe('get suggestion', () => {
  beforeEach(() => {
    firebase.restore();
  });

  it('returns the oldest unprocessed phrase', async () => {
    const suggestion = await getSuggestion();

    expect(suggestion).toEqual(mockPhrases.b);
  });
});

describe('discard suggestion', () => {
  const id = 'id';

  it('marks a suggestion as discarded', async () => {
    await discardSuggestion(id);

    assert.calledWithExactly(col, 'suggestion');
    assert.calledWithExactly(doc, id);
    assert.calledWithExactly(update, { discarded: true });
  });

  it('throws any errors on failure', async () => {
    const error = new Error('error');
    update.rejects(error);

    const result = discardSuggestion(id);

    expect(result).rejects.toBe(error);
  });
});

describe('save suggestion', () => {
  const id = 'id';
  const translations = [
    { language: 'pt-BR', content: 'foo' },
    { language: 'en', content: 'bar' },
  ];
  const date = new Date();
  let set: sinon.SinonStub;
  let del: sinon.SinonStub;
  let doc2: sinon.SinonStub;

  beforeEach(() => {
    sandbox.useFakeTimers(date);
    set = sandbox.stub().resolves();
    del = sandbox.stub();
    doc2 = sandbox.stub().returns({ set });

    doc.returns({ delete: del });
    col.withArgs('phrases').returns({ doc: doc2 });
  });

  it('saves a phrase with the given translations', async () => {
    await saveSuggestion(id, translations);

    assert.calledWithExactly(set, { 'pt-BR': 'foo', en: 'bar', date });
    assert.calledWithExactly(doc, id);
    assert.calledWithExactly(doc2, id);
  });

  it('deletes a suggestion after saving', async () => {
    await saveSuggestion(id, translations);

    assert.calledWithExactly(col, 'suggestion');
    assert.calledWithExactly(doc, id);
    assert.callOrder(set, del);
  });

  it('does not delete a phrase if saving fails', async () => {
    const error = new Error('error');
    set.rejects(error);

    try {
      await saveSuggestion(id, translations);
      fail('should have thrown error');
    } catch (e) {
      expect(e).toBe(error);
    }

    assert.notCalled(del);
  });

  it('throws errors if delete fails', async () => {
    const error = new Error('error');
    del.rejects(error);

    const result = saveSuggestion(id, translations);

    expect(result).rejects.toBe(error);
  });
});
