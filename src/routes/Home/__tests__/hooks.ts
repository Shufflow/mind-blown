import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import Share from 'react-native-share';

import RouteName from '@routes';

import Model from 'src/models/phrases';
import * as useColors from 'src/models/assets';
import * as useFonts from 'src/models/fonts';
import Analytics from 'src/models/analytics';

import hook, { SelectedThumb } from '../hooks';

const sandbox = createSandbox();
afterEach(sandbox.restore);

let getRandomPhrase: sinon.SinonStub;
let getNewColors: sinon.SinonStub;
let getNextFont: sinon.SinonStub;
const initialProps: any = {
  locale: 'en',
};
const phrase = { id: 'foo', content: 'foobar' };

beforeEach(() => {
  getNewColors = sandbox.stub();
  getNextFont = sandbox.stub();

  getRandomPhrase = sandbox
    .stub(Model.prototype, 'getRandomPhrase')
    .resolves(phrase);

  sandbox.stub(useColors, 'useColors').returns({
    getNewColors,
  } as any);

  sandbox.stub(useFonts, 'useFonts').returns({
    getNextFont,
  } as any);
});

describe('init', () => {
  it('starts loading immediately', async () => {
    const {
      result: {
        current: { isLoading },
      },
      waitForNextUpdate,
    } = renderHook(hook, { initialProps });

    expect(isLoading).toBe(true);

    await waitForNextUpdate();
  });

  it('stops loading after the request finishes', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
  });

  it('returns a phrase', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.phrase).toBe(phrase);
  });

  it('does not return error if the request succeeds', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.error).toBeUndefined();
  });

  it('returns an error if the request fails', async () => {
    const error = new Error('error');
    getRandomPhrase.rejects(error);
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.error).toBe(error);
    expect(result.current.phrase).toBeUndefined();
  });

  it('asks the expected locale to the model', async () => {
    const { waitForNextUpdate } = renderHook(hook, {
      initialProps: { locale: 'cz' },
    } as any);

    await waitForNextUpdate();

    assert.calledWithExactly(getRandomPhrase, 'cz');
  });

  it('might not return an empty phrase', async () => {
    getRandomPhrase.resolves(undefined);
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.phrase).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('logs the event', async () => {
    const logEvent = sandbox.stub(Analytics, 'viewPhrase');
    const { waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    assert.calledWithExactly(logEvent, phrase.id);
  });

  it('does not log the event if the phrase is empty', async () => {
    const logEvent = sandbox.stub(Analytics, 'viewPhrase');
    getRandomPhrase.resolves(undefined);
    const { waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    assert.notCalled(logEvent);
  });
});

describe('get random phrase', () => {
  let logEvent: sinon.SinonStub;

  beforeEach(() => {
    logEvent = sandbox.stub(Analytics, 'viewPhrase');
  });

  it('asks for a new phrase with the current locale', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();
    sandbox.resetHistory();

    assert.notCalled(getRandomPhrase);

    act(() => {
      result.current.getRandomPhrase();
    });

    await waitForNextUpdate();

    assert.calledWith(getRandomPhrase, initialProps.locale);
  });

  it('gets new colors', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();
    sandbox.resetHistory();

    assert.notCalled(getNewColors);

    act(() => {
      result.current.getRandomPhrase();
    });

    await waitForNextUpdate();

    assert.calledOnce(getNewColors);
  });

  it('gets a new font', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();
    sandbox.resetHistory();

    assert.notCalled(getNextFont);

    act(() => {
      result.current.getRandomPhrase();
    });

    await waitForNextUpdate();

    assert.calledOnce(getNextFont);
  });

  it('removes previous review', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(true);
    });

    expect(result.current.selectedThumb).toBe(SelectedThumb.Up);

    act(() => {
      result.current.getRandomPhrase();
    });

    await waitForNextUpdate();

    expect(result.current.selectedThumb).toBeNull();
  });

  it("returns error and doesn't call side-effects on error", async () => {
    const error = new Error('error');
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();
    sandbox.resetHistory();

    assert.notCalled(getRandomPhrase);
    getRandomPhrase.rejects(error);

    act(() => {
      result.current.getRandomPhrase();
    });

    await waitForNextUpdate();

    assert.notCalled(getNewColors);
    assert.notCalled(getNewColors);
    assert.notCalled(logEvent);

    expect(result.current.error).toBe(error);
  });

  it('logs the event', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();
    sandbox.resetHistory();

    assert.notCalled(getRandomPhrase);

    act(() => {
      result.current.getRandomPhrase();
    });

    await waitForNextUpdate();

    assert.calledWithExactly(logEvent, phrase.id);
  });

  it('does not log the event if the phrase is empty', async () => {
    getRandomPhrase.resolves(undefined);
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();
    sandbox.resetHistory();

    assert.notCalled(getRandomPhrase);

    act(() => {
      result.current.getRandomPhrase();
    });

    await waitForNextUpdate();

    assert.notCalled(logEvent);
  });
});

describe('handle press review', () => {
  let review: sinon.SinonStub;

  beforeEach(() => {
    review = sandbox.stub(Model.prototype, 'reviewPhrase').resolves();
  });

  it('aborts when phrase is null', async () => {
    getRandomPhrase.resolves(undefined);
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(true);
    });

    assert.notCalled(review);
  });

  it('shows thumb up when positive', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(true);
    });

    expect(result.current.selectedThumb).toBe(SelectedThumb.Up);
  });

  it('shows thumb down when negative', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(false);
    });

    expect(result.current.selectedThumb).toBe(SelectedThumb.Down);
  });

  it('reviews a phrase', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(true);
    });

    assert.calledWithExactly(review, phrase.id, true);
  });

  it('removes thumb on errors', async () => {
    review.onSecondCall().rejects('error');
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(true);
    });

    expect(result.current.selectedThumb).toBe(SelectedThumb.Up);

    act(() => {
      result.current.handlePressReview(true);
    });

    await waitForNextUpdate();

    expect(result.current.selectedThumb).toBeNull();
  });

  it('logs the analytic event', async () => {
    const logEvent = sandbox.stub(Analytics, 'reviewPhrase');
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(true);
    });

    assert.calledWithExactly(logEvent, phrase.id, true);
  });
});

describe('handle press share', () => {
  const app = 'app';
  let capture: sinon.SinonStub;
  let share: sinon.SinonStub;
  let logEvent: sinon.SinonStub;

  beforeEach(() => {
    capture = sandbox.stub();
    share = sandbox.stub(Share, 'open').resolves({ app });
    logEvent = sandbox.stub(Analytics, 'sharePhrase');
    sandbox.stub(console, 'error');
  });

  it('does nothing if viewShotRef is undefined', async () => {
    const {
      result: {
        current: { handlePressShare },
      },
      waitForNextUpdate,
    } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    await act(handlePressShare);

    assert.notCalled(share);
    assert.notCalled(logEvent);
  });

  it('does nothing if capture is invalid', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    sandbox
      .stub(result.current.viewShotRef, 'current')
      .value({ capture: null });

    await act(result.current.handlePressShare);

    assert.notCalled(share);
    assert.notCalled(capture);
    assert.notCalled(logEvent);
  });

  it('shares the returned url', async () => {
    const url = 'foobar';
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    capture.resolves(url);
    sandbox.stub(result.current.viewShotRef, 'current').value({ capture });

    await act(result.current.handlePressShare);

    assert.calledWith(share, {
      type: 'image/png',
      url: `file://${url}`,
    });
  });

  it('suppresses errors', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    capture.rejects('error');
    sandbox.stub(result.current.viewShotRef, 'current').value({ capture });

    try {
      await act(result.current.handlePressShare);

      assert.notCalled(share);
      assert.notCalled(logEvent);
    } catch (e) {
      fail(e);
    }
  });

  it('logs the analytic event', async () => {
    const url = 'foobar';
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    capture.resolves(url);
    sandbox.stub(result.current.viewShotRef, 'current').value({ capture });

    await act(result.current.handlePressShare);

    assert.calledWithExactly(logEvent, phrase.id, app);
  });
});

it('handles press settings', async () => {
  const navigate = sandbox.stub();
  const {
    result: {
      current: { handlePressSettings },
    },
    waitForNextUpdate,
  } = renderHook(hook, {
    initialProps: {
      ...initialProps,
      navigation: { navigate },
    },
  });

  act(handlePressSettings);

  await waitForNextUpdate();

  assert.calledWithExactly(navigate, RouteName.Settings);
});
