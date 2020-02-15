import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import * as messaging from '@react-native-firebase/messaging';

import RouteName from '@routes';
import * as useLocale from '@hocs/withLocale';

import Analytics from 'src/models/analytics';

import hook from '..';
// import * as hooks from '../ads';
// const { buyAdFree } = hooks;

const sandbox = createSandbox();
afterEach(sandbox.restore);

let navigate: sinon.SinonStub;
let subscribeToTopic: sinon.SinonStub;
let unsubscribeFromTopic: sinon.SinonStub;
let messagingStub: sinon.SinonStub;
let initialProps: any;

beforeEach(() => {
  navigate = sandbox.stub();
  subscribeToTopic = sandbox.stub();
  unsubscribeFromTopic = sandbox.stub().resolves();

  initialProps = { navigation: { navigate } };
  messagingStub = sandbox.stub(messaging, 'default').returns({
    subscribeToTopic,
    unsubscribeFromTopic,
    isRegisteredForRemoteNotifications: true,
  } as any);
});

describe('on mount', () => {
  it('sets the screen on mount', () => {
    const setScreen = sandbox.stub(Analytics, 'currentScreen');

    renderHook(hook, { initialProps });

    assert.calledWithExactly(setScreen, RouteName.Settings);
  });

  it('does not subscribe to notifications if disabled', async () => {
    messagingStub.returns({
      subscribeToTopic,
      unsubscribeFromTopic,
      isRegisteredForRemoteNotifications: false,
    } as any);

    renderHook(hook, { initialProps });

    assert.notCalled(subscribeToTopic);
    assert.notCalled(unsubscribeFromTopic);
  });

  it("subscribes to initial locale's notifications", async () => {
    const locale = 'foobar';
    sandbox
      .stub(useLocale, 'useLocale')
      .returns({ locale, setLocale: sandbox.stub() } as any);

    renderHook(hook, { initialProps });

    assert.calledWithExactly(subscribeToTopic, locale);
    assert.calledWithExactly(unsubscribeFromTopic, '');
  });
});

it('handles navigation', () => {
  const routeName: any = 'foobar';
  const color = 'xpto';
  const { result } = renderHook(hook, {
    initialProps: { navigation: { navigate, color } } as any,
  });

  act(result.current.handleNavigate(routeName));

  assert.calledWithExactly(navigate, routeName, color);
});

describe('handle set locale', () => {
  const locale = 'foobar';
  const originalLocale = 'xpto';
  let setParams: sinon.SinonStub;
  let setLocale: sinon.SinonStub;
  let useLocaleStub: sinon.SinonStub;

  beforeEach(() => {
    setParams = sandbox.stub();
    setLocale = sandbox.stub();
    initialProps = { navigation: { setParams } };

    useLocaleStub = sandbox
      .stub(useLocale, 'useLocale')
      .returns({ setLocale, locale: originalLocale } as any);
  });

  it('updates the context', () => {
    const { result } = renderHook(hook, { initialProps });

    act(result.current.handleSetLocale.bind(null, locale));

    assert.calledWithExactly(setLocale, locale);
  });

  it('updates the navigation params', () => {
    const { result } = renderHook(hook, { initialProps });

    act(result.current.handleSetLocale.bind(null, locale));

    assert.calledWithExactly(setParams, { updateLocale: '' });
  });

  it('logs the event', () => {
    const event = sandbox.stub(Analytics, 'selectLanguage');
    const { result } = renderHook(hook, { initialProps });

    act(result.current.handleSetLocale.bind(null, locale));

    assert.calledWithExactly(event, locale);
  });

  it("subscribes to locale's notifications", async () => {
    const { rerender } = renderHook(hook, { initialProps });

    useLocaleStub.returns({ locale });
    rerender();

    assert.calledWithExactly(subscribeToTopic, locale);
  });

  it('unsubscribes from the previous locale', async () => {
    const { rerender } = renderHook(hook, { initialProps });

    useLocaleStub.returns({ locale });
    rerender();

    assert.calledWithExactly(unsubscribeFromTopic, originalLocale);
  });

  it('does not subscribe to notifications if disabled', async () => {
    messagingStub.returns({
      subscribeToTopic,
      unsubscribeFromTopic,
      isRegisteredForRemoteNotifications: false,
    } as any);
    const { rerender } = renderHook(hook, { initialProps });

    useLocaleStub.returns({ locale });
    rerender();

    assert.notCalled(subscribeToTopic);
    assert.notCalled(unsubscribeFromTopic);
  });
});
