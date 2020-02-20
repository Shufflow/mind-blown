import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import Share from 'react-native-share';

import RouteName from '@routes';
import * as withLocale from '@hocs/withLocale';
import * as alerts from '@utils/alerts';
import sleep from '@utils/sleep';

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
let useLocale: sinon.SinonStub;
let initialProps: any;
const phrase = { id: 'foo', en: 'foobar', 'pt-BR': 'yolo' };

beforeEach(() => {
  getNextFont = sandbox.stub();

  getNewColors = sandbox.stub(useColors, 'getNewColors').returns({
    bgColor: 'bgColor',
    fgColor: 'fgColor',
    isDark: false,
  });

  getRandomPhrase = sandbox
    .stub(Model.prototype, 'getRandomPhrase')
    .resolves(phrase);

  sandbox.stub(useFonts, 'useFonts').returns({
    getNextFont,
  } as any);
  useLocale = sandbox
    .stub(withLocale, 'useLocale')
    .returns({ locale: 'en' } as any);

  initialProps = {
    navigation: {
      getParam: sandbox.stub(),
      setParams: sandbox.stub(),
    },
  };
});

describe('init', () => {
  it('does not start loading immediately', async () => {
    const {
      result: {
        current: { isLoading },
      },
      waitForNextUpdate,
    } = renderHook(hook, { initialProps });

    expect(isLoading).toBe(false);

    await waitForNextUpdate();
  });

  it('starts loading if it takes a while to get a phrase', async () => {
    getRandomPhrase.callsFake(() => sleep(300).then(() => phrase));
    const timer = sandbox.useFakeTimers();
    const { result } = renderHook(hook, { initialProps });

    act(() => {
      timer.tick(200);
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('stops loading after the request finishes', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
  });

  it('returns a phrase', async () => {
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.phrase).toEqual({
      content: phrase.en,
      id: phrase.id,
    });
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

  it('changes the phrase content when locale changes', async () => {
    const { result, waitForNextUpdate, rerender } = renderHook(hook, {
      initialProps,
    });

    await waitForNextUpdate();

    // act
    useLocale.returns({ locale: 'pt-BR' });
    rerender();

    expect(result.current.phrase).toEqual({
      content: phrase['pt-BR'],
      id: phrase.id,
    });
    assert.calledOnce(getRandomPhrase);
  });
});

describe('get random phrase', () => {
  let logEvent: sinon.SinonStub;

  beforeEach(() => {
    logEvent = sandbox.stub(Analytics, 'viewPhrase');
  });

  it('returns a phrase with the expected locale', async () => {
    const content = 'xpto';
    useLocale.returns({ locale: 'cz' });
    getRandomPhrase.resolves({
      ...phrase,
      cz: content,
    });
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.phrase).toEqual({
      content,
      id: phrase.id,
    });
  });

  it('fallsback to english if locale is not found', async () => {
    useLocale.returns({ locale: 'cz' });
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    expect(result.current.phrase).toEqual({
      content: phrase.en,
      id: phrase.id,
    });
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
    const { colors } = result.current;

    await waitForNextUpdate();
    sandbox.resetHistory();

    assert.notCalled(getRandomPhrase);
    getRandomPhrase.rejects(error);

    act(() => {
      result.current.getRandomPhrase();
    });

    await waitForNextUpdate();

    assert.notCalled(logEvent);

    expect(result.current.error).toBe(error);
    expect(result.current.colors).toBe(colors);
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

  describe('gets new colors', () => {
    it('when phrase changes', async () => {
      const color = {
        bgColor: 'foo',
        fgColor: 'bar',
        isDark: true,
      };

      const { result, waitForNextUpdate } = renderHook(hook, { initialProps });
      const { colors } = result.current;

      await waitForNextUpdate();
      sandbox.resetHistory();
      getRandomPhrase.resolves({ id: '2' });

      assert.notCalled(getNewColors);
      getNewColors.returns(color);

      act(() => {
        result.current.getRandomPhrase();
      });

      await waitForNextUpdate();

      expect(result.current.colors).not.toEqual(colors);
      expect(result.current.colors).toBe(color);
    });

    it('when locale changes', async () => {
      const { waitForNextUpdate, rerender } = renderHook(hook, {
        initialProps,
      });

      await waitForNextUpdate();
      sandbox.resetHistory();

      assert.notCalled(getNewColors);

      // act
      useLocale.returns({ locale: 'foo' });
      rerender();

      assert.calledOnce(getNewColors);
    });
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

  it('asks to enable push if the review is positive', async () => {
    const alert = sandbox.stub(alerts, 'requestEnablePushNotifications');
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(true);
    });

    assert.calledOnce(alert);
  });

  it('do not ask to enable push if the review is negative', async () => {
    const alert = sandbox.stub(alerts, 'requestEnablePushNotifications');
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    act(() => {
      result.current.handlePressReview(false);
    });

    assert.notCalled(alert);
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

  it('asks to enable push', async () => {
    const alert = sandbox.stub(alerts, 'requestEnablePushNotifications');
    const { result, waitForNextUpdate } = renderHook(hook, { initialProps });

    await waitForNextUpdate();

    capture.resolves('foobar');
    sandbox.stub(result.current.viewShotRef, 'current').value({ capture });

    await act(result.current.handlePressShare);

    assert.calledOnce(alert);
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
      navigation: {
        ...initialProps.navigation,
        navigate,
      },
    },
  });

  act(handlePressSettings);

  await waitForNextUpdate();

  assert.calledWithExactly(navigate, RouteName.Settings);
});
