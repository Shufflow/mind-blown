import { createSandbox, assert } from 'sinon';
import { Platform } from 'react-native';
import * as messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import User from 'src/models/user';

import model from '../pushNotificationsPermissions';

const sandbox = createSandbox();
beforeEach(sandbox.restore);

const locale = 'xpto';
let messagingStub: sinon.SinonStub;
let checkPermissions: sinon.SinonStub;
let isPushEnabled: sinon.SinonStub;
let userSetEnabled: sinon.SinonStub;

beforeEach(() => {
  isPushEnabled = sandbox.stub(User, 'isPushEnabled').resolves(false);
  userSetEnabled = sandbox.stub(User, 'setPushEnabled').resolves(true);
});

describe('ios', () => {
  beforeEach(() => {
    sandbox.stub(Platform, 'select').callsFake(d => d.ios);

    messagingStub = sandbox
      .stub(messaging, 'default')
      .returns({ isRegisteredForRemoteNotifications: true } as any);

    checkPermissions = sandbox.stub(PushNotification, 'checkPermissions');
  });

  describe('is enabled', () => {
    it('is not registered', async () => {
      messagingStub.returns({
        isRegisteredForRemoteNotifications: false,
      } as any);

      const result = await model.isEnabled();

      expect(result).toBe(false);
    });

    it('does not have permissions', async () => {
      checkPermissions.yields({});

      const result = await model.isEnabled();

      expect(result).toBe(false);
    });

    it('user has not enabled', async () => {
      checkPermissions.yields({ alert: true });

      const result = await model.isEnabled();

      expect(result).toBe(false);
    });

    it('is enabled', async () => {
      checkPermissions.yields({ alert: true });
      isPushEnabled.resolves(true);

      const result = await model.isEnabled();

      expect(result).toBe(true);
    });
  });

  describe('request permissions', () => {
    let request: sinon.SinonStub;

    beforeEach(() => {
      request = sandbox.stub(PushNotification, 'requestPermissions');
    });

    it('grants', async () => {
      request.resolves({ badge: true });

      const result = await model.requestPermissions(locale);

      expect(result).toBe(true);
      assert.calledWithExactly(userSetEnabled, true, locale);
      assert.callOrder(request, userSetEnabled);
    });

    it('denies', async () => {
      request.resolves({});

      const result = await model.requestPermissions(locale);

      expect(result).toBe(false);
      assert.calledWithExactly(userSetEnabled, false, locale);
      assert.callOrder(request, userSetEnabled);
    });
  });
});

describe('android', () => {
  beforeEach(() => {
    checkPermissions = sandbox.stub();
    sandbox.stub(Platform, 'select').callsFake(d => d.android);

    messagingStub = sandbox.stub(messaging, 'default').returns({
      hasPermission: checkPermissions,
      isRegisteredForRemoteNotifications: true,
    } as any);
  });

  describe('is enabled', () => {
    it('is not registered', async () => {
      messagingStub.returns({
        hasPermission: checkPermissions,
        isRegisteredForRemoteNotifications: false,
      } as any);

      const result = await model.isEnabled();

      expect(result).toBe(false);
    });

    it('does not have permissions', async () => {
      checkPermissions.resolves(false);

      const result = await model.isEnabled();

      expect(result).toBe(false);
    });

    it('user has not enabled', async () => {
      checkPermissions.resolves(true);

      const result = await model.isEnabled();

      expect(result).toBe(false);
    });

    it('is enabled', async () => {
      checkPermissions.resolves(true);
      isPushEnabled.resolves(true);

      const result = await model.isEnabled();

      expect(result).toBe(true);
    });
  });

  describe('request permissions', () => {
    let request: sinon.SinonStub;

    beforeEach(() => {
      request = sandbox.stub();

      messagingStub.returns({
        hasPermission: checkPermissions,
        isRegisteredForRemoteNotifications: true,
        requestPermission: request,
      } as any);
    });

    it('grants', async () => {
      request.resolves(true);

      const result = await model.requestPermissions(locale);

      expect(result).toBe(true);
      assert.calledWithExactly(userSetEnabled, true, locale);
      assert.callOrder(request, userSetEnabled);
    });

    it('denies', async () => {
      request.resolves(false);
      userSetEnabled.resolves(false);

      const result = await model.requestPermissions(locale);

      expect(result).toBe(false);
      assert.calledWithExactly(userSetEnabled, false, locale);
      assert.callOrder(request, userSetEnabled);
    });
  });
});

describe('disable push notification', () => {
  let unregister: sinon.SinonStub;

  beforeEach(() => {
    unregister = sandbox.stub();
    messagingStub = sandbox.stub(messaging, 'default').returns({
      unregisterForRemoteNotifications: unregister,
    } as any);
  });

  it('disables and unregisters', async () => {
    const result = await model.disablePushNotification(locale);

    expect(result).toBe(true);
    assert.calledWithExactly(userSetEnabled, false, locale);
    assert.calledOnce(unregister);
  });
});
