import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import * as utils from 'react-hook-utilities';

import * as asyncBinarySearch from '@utils/search';

import Model from 'src/models/phrases';

import hook from '../hooks';

const sandbox = createSandbox();
afterEach(sandbox.restore);

let getParam: sinon.SinonStub;
let setParams: sinon.SinonStub;
let getPhrase: sinon.SinonStub;
let initialProps: any;
const phrase = { id: 'foo', en: 'foobar', 'pt-BR': 'yolo' };

beforeEach(() => {
  sandbox.stub(console, 'error');

  getParam = sandbox.stub();
  setParams = sandbox.stub();

  sandbox.stub(Model.prototype, 'getRandomPhrase').resolves(phrase);
  sandbox.stub(asyncBinarySearch, 'asyncBinarySearch').resolves(1);

  initialProps = { navigation: { getParam, setParams } };
  getPhrase = sandbox.stub(Model.prototype, 'getPhrase').callsFake(id =>
    Promise.resolve({
      ...phrase,
      id,
    }),
  );
});

describe('starting with phrase id', () => {
  const phraseId = 'foobar';

  beforeEach(() => {
    getParam.returns(phraseId);
  });

  it('gets the phrase with the given id', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    act(() => {
      result.current.handlePhraseContainerSize({
        nativeEvent: { layout: { width: 100, height: 200 } } as any,
      });
    });

    await waitForNextUpdate();

    assert.calledWithExactly(getPhrase, phraseId);
    expect(result.current.phrase).toEqual({
      content: phrase.en,
      id: phraseId,
    });
  });

  it('unsets the phrase id', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, {
      initialProps,
    });

    act(() => {
      result.current.handlePhraseContainerSize({
        nativeEvent: { layout: { width: 100, height: 200 } } as any,
      });
    });

    await waitForNextUpdate();

    assert.calledWithExactly(setParams, { phraseId: undefined });
  });

  it('aborts previous fetch', async () => {
    const worker = sandbox
      .stub(utils, 'useWorkerState')
      .returns({ callback: () => {}, data: {} } as any);
    const newId = 'newId';
    getParam.onSecondCall().returns(newId);

    const { result } = renderHook(hook, { initialProps });

    const r1 = worker.args[0][0]();

    act(() => {
      result.current.handlePhraseContainerSize({
        nativeEvent: { layout: { width: 100, height: 200 } } as any,
      });
    });
    const r2 = worker.args[1][0]();

    await expect(r1).resolves.toMatchObject({
      font: undefined,
      phraseData: undefined,
    });
    await expect(r2).resolves.toMatchObject({
      phraseData: {
        ...phrase,
        id: newId,
      },
    });
  });
});

describe('get random phrase', () => {
  const phraseId = 'foobar';

  it('gets the phrase with the given id', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(hook, {
      initialProps,
    });

    act(() => {
      result.current.handlePhraseContainerSize({
        nativeEvent: { layout: { width: 100, height: 200 } } as any,
      });
    });

    await waitForNextUpdate();
    assert.notCalled(getPhrase);

    expect(result.current.phrase).toEqual({
      content: phrase.en,
      id: phrase.id,
    });

    // act
    getParam.returns(phraseId);
    rerender();
    await waitForNextUpdate();

    assert.calledWithExactly(getPhrase, phraseId);
    expect(result.current.phrase).toEqual({
      content: phrase.en,
      id: phraseId,
    });
  });

  it('unsets the phrase id', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(hook, {
      initialProps,
    });

    act(() => {
      result.current.handlePhraseContainerSize({
        nativeEvent: { layout: { width: 100, height: 200 } } as any,
      });
    });

    await waitForNextUpdate();
    assert.notCalled(getPhrase);

    expect(result.current.phrase).toEqual({
      content: phrase.en,
      id: phrase.id,
    });

    // act
    getParam.returns(phraseId);
    rerender();
    await waitForNextUpdate();

    assert.calledWithExactly(setParams, { phraseId: undefined });
  });
});
