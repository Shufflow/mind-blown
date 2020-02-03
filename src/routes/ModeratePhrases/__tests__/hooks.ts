import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';

import * as RawPhrasesDataSource from 'src/models/rawPhrases';

import {
  disableConsoleErrorAndWarn,
  enableConsoleErrorAndWarn,
} from '@utils/hooksTesting';

import { mockRawPhrase } from '../__mocks__/rawPhrase';
import useModeratePhrases from '../hooks';

const sandbox = createSandbox();
beforeAll(disableConsoleErrorAndWarn);
afterAll(enableConsoleErrorAndWarn);
afterEach(sandbox.restore);

const emptyTranslation = { language: 'pt-BR', content: '' };

describe('initial behavior', () => {
  let loadPhrase: sinon.SinonStub;

  beforeEach(() => {
    loadPhrase = sandbox.stub().resolves(mockRawPhrase);
    sandbox.stub(RawPhrasesDataSource, 'default').returns({
      loadPhrase,
    });
  });

  it('has the correct initial values', () => {
    const {
      result: {
        current: { isLoading, phrase, translations },
      },
    } = renderHook(useModeratePhrases);

    expect(isLoading).toEqual(true);
    expect(phrase).toEqual(null);
    expect(translations).toEqual([emptyTranslation]);
  });

  describe('load phrase', () => {
    it('loads phrase on mount', async () => {
      const { result, waitForNextUpdate } = renderHook(useModeratePhrases, {
        initialProps: {},
      });

      await waitForNextUpdate();

      assert.calledOnce(loadPhrase);
      expect(result.current.phrase).toEqual(mockRawPhrase);
      expect(result.current.translations).toEqual([emptyTranslation]);
      expect(result.current.isLoading).toEqual(false);
    });

    it('sets loading at the start', async () => {
      const { result } = renderHook(useModeratePhrases);

      expect(result.current.isLoading).toEqual(true);
    });

    it('suppresses errors', async () => {
      loadPhrase.rejects('error');

      const { result, waitForNextUpdate } = renderHook(useModeratePhrases);

      await waitForNextUpdate();

      expect(result.current.isLoading).toEqual(false);
    });
  });
});

describe('handle press add translation', () => {
  it('adds an empty translation', async () => {
    const { result } = renderHook(useModeratePhrases);

    act(result.current.handlePressAddTranslation);

    expect(result.current.translations).toEqual([
      emptyTranslation,
      emptyTranslation,
    ]);
  });
});

describe('handle press remove translation', () => {
  const prepareMock = (length: number, { result, waitForNextUpdate }: any) => {
    Array.from({ length: length - 1 }).forEach((_, i) => {
      result.current.handlePressAddTranslation();
      result.current.handleTranslate(i, i.toString(), i.toString());
    });
  };

  it('removes the translation at the given index', () => {
    const length = 5;
    const idx = 2;
    const hook = renderHook(useModeratePhrases);
    const { result } = hook;

    prepareMock(length, hook);
    result.current.handleRemoveTranslation(idx);

    expect(result.current.translations.length).toEqual(length - 1);
    expect(result.current.translations).not.toContainEqual({
      content: idx.toString(),
      language: idx.toString(),
    });
  });

  it('does nothing if array is empty', async () => {
    const { result } = renderHook(useModeratePhrases);

    result.current.handleRemoveTranslation(0);
    result.current.handleRemoveTranslation(0);

    expect(result.current.translations).toEqual([]);
  });

  it('does nothing if idx is out of bounds', async () => {
    const { result } = renderHook(useModeratePhrases);
    const original = result.current.translations;

    result.current.handleRemoveTranslation(7);

    expect(result.current.translations).toEqual(original);
  });
});

describe('handle press discard', () => {
  let discardPhrase: sinon.SinonStub;
  let loadPhrase: sinon.SinonStub;

  beforeEach(() => {
    discardPhrase = sandbox.stub();
    loadPhrase = sandbox.stub().resolves(mockRawPhrase);

    sandbox.stub(RawPhrasesDataSource, 'default').returns({
      discardPhrase,
      loadPhrase,
    });
  });

  it('does nothing if phrase is null', async () => {
    loadPhrase.resolves(undefined);
    const { result } = renderHook(useModeratePhrases);
    loadPhrase.reset();

    expect(result.current.phrase).toEqual(null);

    await result.current.handlePressDiscard();

    expect(result.current.isLoading).toEqual(false);
    assert.notCalled(discardPhrase);
    assert.notCalled(loadPhrase);
  });

  it('sets loading at the start', async () => {
    const { result } = renderHook(useModeratePhrases);

    result.current.handlePressDiscard();

    expect(result.current.isLoading).toEqual(true);
  });

  it('discards the given phrase', async () => {
    const { result, waitForNextUpdate } = renderHook(useModeratePhrases);

    await waitForNextUpdate();
    expect(result.current.phrase).not.toEqual(null);

    await result.current.handlePressDiscard();

    assert.calledWithExactly(discardPhrase, mockRawPhrase.id);
    assert.callOrder(discardPhrase, loadPhrase);
  });
});

describe('handle press save', () => {
  let savePhrase: sinon.SinonStub;
  let loadPhrase: sinon.SinonStub;

  beforeEach(() => {
    savePhrase = sandbox.stub();
    loadPhrase = sandbox.stub().resolves(mockRawPhrase);

    sandbox.stub(RawPhrasesDataSource, 'default').returns({
      loadPhrase,
      savePhrase,
    });
  });

  it('does nothing if phrase is null', async () => {
    loadPhrase.resolves(undefined);
    const { result } = renderHook(useModeratePhrases);
    loadPhrase.reset();

    expect(result.current.phrase).toEqual(null);

    await result.current.handlePressSave();

    expect(result.current.isLoading).toEqual(false);
    assert.notCalled(savePhrase);
    assert.notCalled(loadPhrase);
  });

  it('sets loading at the start', async () => {
    const { result } = renderHook(useModeratePhrases);

    result.current.handlePressSave();

    expect(result.current.isLoading).toEqual(true);
  });

  it('saves the current and loads a new one', async () => {
    const { result, waitForNextUpdate } = renderHook(useModeratePhrases);

    await Promise.all(
      Array.from({ length: 2 }).map(async (_, i) => {
        result.current.handlePressAddTranslation();
        result.current.handleTranslate(i, i.toString(), i.toString());
        return waitForNextUpdate();
      }),
    );

    await result.current.handlePressSave();

    expect(result.current.isLoading).toEqual(false);
    assert.calledWith(savePhrase, mockRawPhrase.id, {
      0: '0',
      1: '1',
      'pt-BR': '',
    });
    assert.callOrder(savePhrase, loadPhrase);
  });
});
