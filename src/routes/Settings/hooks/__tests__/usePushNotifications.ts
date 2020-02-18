import { createSandbox, assert } from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import * as localeModule from '@utils/hocs/withLocale';

import PushNotificationPermisions from 'src/models/pushNotificationsPermissions';

import { usePushNotifications } from '../usePushNotifications';

const sandbox = createSandbox();
afterEach(sandbox.restore);

const locale = 'xpto';
let isEnabled: sinon.SinonStub;
let requestPermission: sinon.SinonStub;
let disable: sinon.SinonStub;

beforeEach(() => {
  isEnabled = sandbox.stub(PushNotificationPermisions, 'isEnabled');
  disable = sandbox.stub(PushNotificationPermisions, 'disablePushNotification');
  requestPermission = sandbox.stub(
    PushNotificationPermisions,
    'requestPermissions',
  );
  sandbox.stub(localeModule, 'useLocale').returns({ locale } as any);
});

describe('check the permissions on mount', () => {
  it('starts disabled with loading', async () => {
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isPushEnabled).toBe(false);

    await waitForNextUpdate();
  });

  it('resolves enabled', async () => {
    isEnabled.resolves(true);
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPushEnabled).toBe(true);
  });

  it('does not have permission', async () => {
    isEnabled.resolves(false);
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isPushEnabled).toBe(false);
  });
});

describe('handle toggle push notification', () => {
  beforeEach(() => {
    requestPermission.resolves(true);

    isEnabled.resolves(false);
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
    requestPermission.resolves(false);
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();
    expect(result.current.isPushEnabled).toBe(false);

    await act(result.current.handleTogglePushNotification.bind(null, true));

    assert.notCalled(disable);
    expect(result.current.isPushEnabled).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('requests permissions and registers', async () => {
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();
    expect(result.current.isPushEnabled).toBe(false);
    isEnabled.resolves(true);

    await act(result.current.handleTogglePushNotification.bind(null, true));

    assert.calledWithExactly(requestPermission, locale);
    assert.notCalled(disable);
    expect(result.current.isPushEnabled).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not request permissions if disabling', async () => {
    const { result, waitForNextUpdate } = renderHook(usePushNotifications);

    await waitForNextUpdate();
    expect(result.current.isPushEnabled).toBe(false);

    await act(result.current.handleTogglePushNotification.bind(null, false));

    assert.notCalled(requestPermission);
    assert.called(disable);
    expect(result.current.isPushEnabled).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});
