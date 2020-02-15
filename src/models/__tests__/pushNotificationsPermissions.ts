import { createSandbox } from 'sinon';
import { Platform } from 'react-native';
import * as messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import model from '../pushNotificationsPermissions';

const sandbox = createSandbox();
beforeEach(sandbox.restore);

let messagingStub: sinon.SinonStub;
let checkPermissions: sinon.SinonStub;

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
      checkPermissions.yieldsRight({});

      const result = await model.isEnabled();

      expect(result).toBe(false);
    });

    it('is enabled', async () => {
      checkPermissions.yields({ alert: true });

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

      const result = await model.requestPermissions();

      expect(result).toBe(true);
    });

    it('denies', async () => {
      request.resolves({});

      const result = await model.requestPermissions();

      expect(result).toBe(false);
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

    it('is enabled', async () => {
      checkPermissions.resolves(true);

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

      const result = await model.requestPermissions();

      expect(result).toBe(true);
    });

    it('denies', async () => {
      request.resolves(false);

      const result = await model.requestPermissions();

      expect(result).toBe(false);
    });
  });
});
