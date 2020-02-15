import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import * as messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import { usePushNotifications } from '../usePushNotifications';

const sandbox = createSandbox();
afterEach(sandbox.restore);

let hasPermission: sinon.SinonStub;
let requestPermission: sinon.SinonStub;
let register: sinon.SinonStub;
let unregister: sinon.SinonStub;
let defaultStub: sinon.SinonStub;

beforeEach(() => {
  hasPermission = sandbox
    .stub(PushNotificationIOS, 'checkPermissions')
    .yields();
  requestPermission = sandbox.stub(PushNotificationIOS, 'requestPermissions');
  register = sandbox.stub();
  unregister = sandbox.stub();

  defaultStub = sandbox.stub(messaging, 'default').returns({
    isRegisteredForRemoteNotifications: false,
    registerForRemoteNotifications: register,
    unregisterForRemoteNotifications: unregister,
  } as any);
});

const stubRegistered = (isRegisteredForRemoteNotifications: boolean) =>
  defaultStub.returns({
    hasPermission,
    isRegisteredForRemoteNotifications,
    requestPermission,
    registerForRemoteNotifications: register,
    unregisterForRemoteNotifications: unregister,
  });

describe('check the permissions on mount', () => {
  it('starts disabled with loading', async () => {
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isPushEnabled).toBe(false);

    await waitForNextUpdate();
  });

  it('resolves enabled', async () => {
    stubRegistered(true);
    hasPermission.yieldsRight({ badge: true });
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPushEnabled).toBe(true);
  });

  it('is not registered', async () => {
    stubRegistered(false);
    hasPermission.resolves(true);
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPushEnabled).toBe(false);
  });

  it('does not have permission', async () => {
    stubRegistered(true);
    hasPermission.resolves(false);
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPushEnabled).toBe(false);
  });
});

describe('handle toggle push notification', () => {
  beforeEach(() => {
    requestPermission.resolves({ alert: true });

    stubRegistered(false);
    hasPermission.yieldsRight({ sound: true });
  });

  it('sets loading', async () => {
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();

    act(() => {
      result.current.handleTogglePushNotification(false);
    });

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();
  });

  it('requests permissions which are not granted', async () => {
    requestPermission.resolves({});
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();
    expect(result.current.isPushEnabled).toBe(false);

    await act(result.current.handleTogglePushNotification.bind(null, true));

    assert.notCalled(register);
    assert.notCalled(unregister);
    expect(result.current.isPushEnabled).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('requests permissions and registers', async () => {
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();
    expect(result.current.isPushEnabled).toBe(false);
    stubRegistered(true);

    await act(result.current.handleTogglePushNotification.bind(null, true));

    assert.callOrder(requestPermission, register);
    assert.notCalled(unregister);
    expect(result.current.isPushEnabled).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not request permissions if disabling', async () => {
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();
    expect(result.current.isPushEnabled).toBe(false);

    await act(result.current.handleTogglePushNotification.bind(null, false));

    assert.notCalled(requestPermission);
    assert.notCalled(register);
    assert.called(unregister);
    expect(result.current.isPushEnabled).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});
