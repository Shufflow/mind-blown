import { createSandbox, assert } from 'sinon';
import { Alert } from 'react-native';

import Persist from 'src/models/persist';
import PushNotificationPermisions from 'src/models/pushNotificationsPermissions';

import { requestEnablePushNotifications } from '../alerts';

const sandbox = createSandbox();
afterEach(sandbox.restore);

const locale = 'foobar';
let alert: sinon.SinonStub;
let didAsk: sinon.SinonStub;
let setAsk: sinon.SinonStub;
let isEnabled: sinon.SinonStub;
let requestPermissions: sinon.SinonStub;

beforeEach(() => {
  alert = sandbox.stub(Alert, 'alert');
  didAsk = sandbox.stub(Persist.prototype, 'didAskToEnablePushNotifications');
  setAsk = sandbox.stub(Persist.prototype, 'setAskToEnablePushNotifications');
  isEnabled = sandbox.stub(PushNotificationPermisions, 'isEnabled');
  requestPermissions = sandbox.stub(
    PushNotificationPermisions,
    'requestPermissions',
  );
});

describe('do not show alert', () => {
  it('did already ask', async () => {
    didAsk.resolves(true);
    isEnabled.resolves(false);

    requestEnablePushNotifications(locale);

    assert.notCalled(alert);
    assert.notCalled(requestPermissions);
    assert.notCalled(setAsk);
  });

  it('is already enabled', async () => {
    didAsk.resolves(false);
    isEnabled.resolves(true);

    requestEnablePushNotifications(locale);

    assert.notCalled(alert);
    assert.notCalled(requestPermissions);
    assert.notCalled(setAsk);
  });
});

describe('show alert', () => {
  const buttons = { ok: 0, later: 1, cancel: 2 };
  const mockButtonPress = (button: keyof typeof buttons) => {
    const { onPress } = alert.args[0][2][buttons[button]];
    onPress?.();
  };

  beforeEach(() => {
    didAsk.resolves(false);
    isEnabled.resolves(false);
  });

  it('selects later', async () => {
    await requestEnablePushNotifications(locale);

    mockButtonPress('later');

    assert.notCalled(requestPermissions);
    assert.notCalled(setAsk);
  });

  it('selects cancel', async () => {
    await requestEnablePushNotifications(locale);

    mockButtonPress('cancel');

    assert.notCalled(requestPermissions);
    assert.calledWithExactly(setAsk, true);
  });

  it('selects ok', async () => {
    await requestEnablePushNotifications(locale);

    mockButtonPress('ok');

    assert.calledWithExactly(requestPermissions, locale);
    assert.calledWithExactly(setAsk, true);
  });
});
