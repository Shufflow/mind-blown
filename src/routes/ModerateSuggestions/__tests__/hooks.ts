import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';

import * as suggestions from 'src/models/suggestions';

import useModerateSuggestions from '../hooks';

const sandbox = createSandbox();
const phrase = { id: 'id', content: 'content' };
const initialTranslation = [{ language: 'en', content: phrase.content }];
let getSuggestion: sinon.SinonStub;
afterEach(sandbox.restore);

beforeEach(() => {
  getSuggestion = sandbox
    .stub(suggestions, 'getSuggestion')
    .resolves(phrase as any);
});

describe('on load', () => {
  it('starts loading', async () => {
    const {
      result: {
        current: { isLoading },
      },
      waitForNextUpdate,
    } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();

    expect(isLoading).toBe(true);
  });

  it('gets a suggestion', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.phrase).toBe(phrase);
  });

  it('starts without translations', async () => {
    const {
      result: {
        current: { translations },
      },
      waitForNextUpdate,
    } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();

    expect(translations).toEqual([]);
  });

  it('sets with the english translation for the current phrase', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();

    expect(result.current.translations).toEqual(initialTranslation);
  });
});

describe('handle press add translation', () => {
  it('adds an empty translation if the phrase has no content', async () => {
    getSuggestion.resolves({ id: 'id' });
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    act(result.current.handlePressAddTranslation);

    expect(result.current.translations).toEqual([
      { language: 'en', content: '' },
      { language: 'pt-BR', content: '' },
    ]);
  });

  it("adds a translation with the current phrase's content", async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    act(result.current.handlePressAddTranslation);

    expect(result.current.translations).toEqual([
      initialTranslation[0],
      { language: 'pt-BR', content: phrase.content },
    ]);
  });
});

describe('handle translate', () => {
  it('updates the given translation', async () => {
    const translation = { language: 'en', content: 'foobar' };
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    act(() => {
      result.current.handlePressAddTranslation();
      result.current.handleTranslate(
        0,
        translation.language,
        translation.content,
      );
    });

    expect(result.current.translations).toEqual([translation]);
  });
});

describe('handle remove translation', () => {
  it('removes the translation at index 0', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    act(() => {
      result.current.handlePressAddTranslation();
      result.current.handleRemoveTranslation(0);
    });

    expect(result.current.translations).toEqual([]);
  });

  it('removes the translation in the middle', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    // setup
    await waitForNextUpdate();
    act(() => {
      result.current.handlePressAddTranslation();
      result.current.handlePressAddTranslation();
      result.current.handlePressAddTranslation();

      result.current.handleTranslate(0, 'en', 'foo');
      result.current.handleTranslate(2, 'cz', 'bar');
    });

    // behavior
    act(() => {
      result.current.handleRemoveTranslation(1);
    });

    expect(result.current.translations).toEqual([
      { language: 'en', content: 'foo' },
      { language: 'cz', content: 'bar' },
    ]);
  });

  it('removes the translation in the end index', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    // setup
    await waitForNextUpdate();
    act(() => {
      result.current.handlePressAddTranslation();
      result.current.handlePressAddTranslation();
      result.current.handlePressAddTranslation();

      result.current.handleTranslate(0, 'en', 'foo');
      result.current.handleTranslate(1, 'cz', 'bar');
    });

    // behavior
    act(() => {
      result.current.handleRemoveTranslation(2);
    });

    expect(result.current.translations).toEqual([
      { language: 'en', content: 'foo' },
      { language: 'cz', content: 'bar' },
    ]);
  });
});

describe('handle press discard', () => {
  let discard: sinon.SinonStub;

  beforeEach(() => {
    discard = sandbox.stub(suggestions, 'discardSuggestion');
  });

  it('starts loading', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    act(() => {
      result.current.handlePressDiscard();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    assert.calledWith(discard, phrase.id);
  });

  it('stops loading in the end', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    act(() => {
      result.current.handlePressDiscard();
      discard.resolves();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    assert.calledWith(discard, phrase.id);
  });

  it('loads a new phrase after discarding', async () => {
    const phrase2 = { id: 'foo' };
    discard.resolves();
    getSuggestion.onSecondCall().resolves(phrase2);
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    expect(result.current.phrase).toBe(phrase);

    act(() => {
      result.current.handlePressDiscard();
    });

    await waitForNextUpdate();

    expect(result.current.phrase).toBe(phrase2);
    assert.calledWith(discard, phrase.id);
  });
});

describe('handle press save', () => {
  let save: sinon.SinonStub;

  beforeEach(() => {
    save = sandbox.stub(suggestions, 'saveSuggestion');
  });

  it('starts loading', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    act(() => {
      result.current.handlePressSave();
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    assert.calledWith(save, phrase.id, initialTranslation);
  });

  it('stops loading in the end', async () => {
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    act(() => {
      result.current.handlePressSave();
      save.resolves();
    });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    assert.calledWith(save, phrase.id, initialTranslation);
  });

  it('loads a new phrase after discarding', async () => {
    const phrase2 = { id: 'foo' };
    save.resolves();
    getSuggestion.onSecondCall().resolves(phrase2);
    const { result, waitForNextUpdate } = renderHook(useModerateSuggestions);

    await waitForNextUpdate();
    expect(result.current.phrase).toBe(phrase);

    act(() => {
      result.current.handlePressSave();
    });

    await waitForNextUpdate();

    expect(result.current.phrase).toBe(phrase2);
    assert.calledWith(save, phrase.id, initialTranslation);
  });
});
